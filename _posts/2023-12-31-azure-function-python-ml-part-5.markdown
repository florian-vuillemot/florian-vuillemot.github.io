---
layout: mermaid
title:  "[Part 5] Azure Functions and machine learning applications"
categories: azure azure-function machine-learning python github github-action
permalink: azure-function/machine-learning/part-5
---
# Introduction
The [previous article]({% link _posts/2023-12-24-azure-function-python-ml-part-4.markdown %}) allows rollback improving reliability in case of failure. Unfortunatly, each deployment impact the application reliability and contains a risk so its better to limit them. Beside, because the model is in the artifact and mixed with the application code, its size is limited.

> [Here](https://github.com/florian-vuillemot/az-fct-python-ml/tree/main/part-5) is the code for this article.

> Feel free to create an issue to comment on or help us improve [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).


# Current status
The [previous article]({% link _posts/2023-12-24-azure-function-python-ml-part-4.markdown %}) leads to these files:
- [function_app.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-4/function_app.py): with the application API.
- [train.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-4/train.py): running the model training.
- [test.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-4/test.py): testing the API.
- [requirements.txt](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-4/requirements.txt): containing the application dependencies.
- [.github/workflows/main_az-fct-python-ml.yml](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-4/.github/workflows/main_az-fct-python-ml.yml): the GitHub Action workflow doing the model training, asking for deployment validation then deploying the API.

We also created the Microsoft Entra application **az-fct-python-ml**.

# Azure File Share
Azure File Share is a managed Azure service that allows remote files storage. It provides a simple and secure way to store both structured and unstructured data as in our case machine learning model. Azure File Share and Azure Function are well integrated and we will use both together to serve model that can become multi-Gb without problem.

Thanks to Azure File Share, the deployment will be speed up and more agile. We will also be able to increase the model size. But this will update our workflows:
<pre class="mermaid">
sequenceDiagram
    participant User
    participant GitHub Action
    participant Azure File Share
    participant Azure Function
    Note over User, Azure Function: Update the model
    User ->> GitHub Action: Push
    GitHub Action ->> GitHub Action: Create the model
    GitHub Action ->> Azure File Share: Upload the model
    Note over User, Azure Function: Update the API
    User ->> GitHub Action: Push
    GitHub Action ->> GitHub Action: Create the artifact
    GitHub Action ->> Azure Function: Deploy the artifact
    Note over User, Azure Function: API call
    User ->> Azure Function: HTTP Request
    Azure Function ->> Azure File Share: Retrieve the model
    Azure Function ->> Azure Function: Process the request
    Azure Function ->> User: HTTP Response
</pre>

Azure File Share is not a service directly instanciable from Azure. It's a service hold by Azure Storage Account. To create a File Share, let's first create an Azure Storage Account:

![Create Storage Account](/assets/2023-12-31-azure-function-python-ml-part-5/create-storage-account.gif)

Now let's create the File Share **models**:

![Create File Share](/assets/2023-12-31-azure-function-python-ml-part-5/create-file-share.gif)

# Exposing the model
The model will no longer be in the artifact but on an Azure File Share. Consequently, we must upload the model on it. This imply to create a new GitHub Action workflow with correct permissions.

## Update permissions
To be able to upload a file on the Azure File Share we must provide the permission. To do so, go on the Azure File Share, then IAM and add role "Storage Account Contributor" to the Microsoft Entra application **az-fct-python-ml** used by the GitHub Action workflow.

![Update permission](/assets/2023-12-31-azure-function-python-ml-part-5/file-share-permission.gif)

> This permission is broad and can be improved.

## Updates the GitHub Action workflow
Using Azure File Share we can now create two workflows in place of our current:
- Updating the API: Create a new artifact containing the application code only and deploy it on the Azure Function.
- Updating the model: Train the model then upload it to the Azure File Share.

What about rollbacking the model? Azure propose nothing in our case. But we can implement the same process then with Azure Function. We can create two files on the File Share, one with the current running model, the other with the previous model then erase the previous model with the current and the current with the new model. In case of problem, we rollout the previous working model in the blue-green mindset.

> Blue-green deployment with Azure Function is our context is explain [here]({% link _posts/2023-12-24-azure-function-python-ml-part-4.markdown %}).

### Updates the API workflow
We no longer need to train the model in the current workflow so let's remove this part our `build` job:
{% raw %}
```
- name: Train the model
  run: python train.py >> $GITHUB_STEP_SUMMARY
```
{% endraw %}

And that's all! Let's now dig in the more complex part, creates the training model workflow.

### Trains the model workflow
Let's create a new job doing the training and the upload. This job also keep the previous model available for rollback.
```
train:
    runs-on: ubuntu-latest
    environment:
    name: 'Production'
    steps:
        - name: Checkout repository
        uses: actions/checkout@v4

        - name: Setup Python version
        uses: actions/setup-python@v1
        with:
            python-version: ${{ env.PYTHON_VERSION }}

        - name: Create and start a virtual environment
        run: |
            python -m venv venv
            source venv/bin/activate

        - name: Install the dependencies
        run: pip install -r requirements.txt
        
        - name: Train the model
        run: python train.py >> $GITHUB_STEP_SUMMARY

        - name: 'Az CLI login'
        uses: azure/login@v1
        with:
            client-id: ${{ secrets.AZURE_CLIENT_ID }}
            tenant-id: ${{ secrets.AZURE_TENANT_ID }}
            subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
            enable-AzPSSession: true

        - name: Backup the current model if exists
        continue-on-error: true
        run: |
            # Download the current model
            az storage file download --path ${{ env.CURRENT_MODEL_NAME }} --account-name ${{ env.STORAGE_ACCOUNT_NAME }} --share-name ${{ env.FILE_SHARE_NAME }} --dest /tmp/previous-model
            # Upload the current model named as the previous model to the file share
            az storage file upload --path ${{ env.PREVIOUS_MODEL_NAME }} --account-name ${{ env.STORAGE_ACCOUNT_NAME }} --share-name ${{ env.FILE_SHARE_NAME }} --source /tmp/previous-model
        
        - name: Replace the current model by the new one
        run: |
            # Upload the new model to the file share
            az storage file upload --path ${{ env.CURRENT_MODEL_NAME }} --account-name ${{ env.STORAGE_ACCOUNT_NAME }} --share-name ${{ env.FILE_SHARE_NAME }} --source ${{ env.CURRENT_MODEL_NAME }}
```

### Rollback the model
Now, you can enable rollback by adding the following job. The review on the `Production` environment is the safeguard.
```
swap-current-and-previous-model:
    runs-on: ubuntu-latest
    needs: train
    environment:
      name: 'Production'
    steps:
      - name: 'Az CLI login'
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
          enable-AzPSSession: true

      - name: Rollback the model
        run: |
          # Download the previous model
          az storage file download --path ${{ env.PREVIOUS_MODEL_NAME }} --account-name ${{ env.STORAGE_ACCOUNT_NAME }} --share-name ${{ env.FILE_SHARE_NAME }} --dest /tmp/previous-model
          # Download the current model
          az storage file download --path ${{ env.CURRENT_MODEL_NAME }} --account-name ${{ env.STORAGE_ACCOUNT_NAME }} --share-name ${{ env.FILE_SHARE_NAME }} --dest /tmp/current-model

          # Upload the previous model as the current
          az storage file upload --path ${{ env.CURRENT_MODEL_NAME }} --account-name ${{ env.STORAGE_ACCOUNT_NAME }} --share-name ${{ env.FILE_SHARE_NAME }} --source /tmp/previous-model
          # Upload the current model as the previous
          az storage file upload --path ${{ env.PREVIOUS_MODEL_NAME }} --account-name ${{ env.STORAGE_ACCOUNT_NAME }} --share-name ${{ env.FILE_SHARE_NAME }} --source /tmp/current-model
```

# Consumming the model
The simpler way to use the generated model is to mount the Azure File Share as a folder in our Azure Function. In that case, the model will be accessible directly as a file by the application.

## Mount File Share
You must use a terminal or a [Cloud Shell](https://learn.microsoft.com/en-us/azure/cloud-shell/overview) to run the command line mounting the Azure File Share under the Azure Function. This command needs to be run once. In our case the File Share will be mounted on the default 'Production' slot but can also be mounted on the 'staging' slot is needed.
```
az webapp config storage-account add --account-name azfctpythonmlmodel --access-key <access-key> --custom-id models --share-name "models" --storage-type AzureFiles --resource-group az-fct-python-ml_group --name az-fct-python-ml --mount-path "/models"
```

> More information on this command [here](https://learn.microsoft.com/en-us/cli/azure/webapp/config/storage-account?view=azure-cli-latest#az-webapp-config-storage-account-add).

Then restart the Function. It is not possible to retrieve mounted files on Azure function from the Azure Portal but it is from the CLI or API.

## Update the application
Models are now available under the folder `/models`. Consequently, the only element to update in the application is the model path. This update must be propagate to tests. Because the `/models` folder may not exists on the runner, you can create it before running [tests](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-5/.github/workflows/main_az-fct-python-ml.yml).

Consequently, the line:
```
with open('model.pkl', 'rb') as f:
```
Becomes:
```
with open('/models/model.pkl', 'rb') as f:
```

And that it! The API will now serve the model from the File Share and so serve each new model when deployed by the `train` workflow.

> Serverless nature of Azure Function lead to load the model on each call. This can be time consuming and take time if the model model size is consequence. In that case, consider using another compute service as [Azure Web App](https://learn.microsoft.com/en-us/azure/app-service/overview).

# Summary and next step
Decoupling the deployment of the API and the model improve the deployment process and the agility of the system.

> Any comments, feedback or problems? Please create an issue [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).
