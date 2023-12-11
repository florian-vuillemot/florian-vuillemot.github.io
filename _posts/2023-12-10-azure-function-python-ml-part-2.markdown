---
layout: mermaid
title:  "[Part 2] Azure Functions and machine learning applications"
categories: azure azure-function machine-learning python github github-action
permalink: azure-function/machine-learning/part-2
---
# Introduction
The [previous article]({% link _posts/2023-12-03-azure-function-python-ml-part-1.markdown %}) focuses on turning a small machine learning application into an API and deploying it automatically with GitHub Action. With this automation done, it's time to improve the application and allow the deployment of a larger-scale machine learning model.

> [Here](https://github.com/florian-vuillemot/az-fct-python-ml/tree/main/part-2) is the code article's code.

> Feel free to create an issue to comment on or help us improve [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).


# Current status
The [previous article]({% link _posts/2023-12-03-azure-function-python-ml-part-1.markdown %}) leads to these files:
- [function_app.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-1/function_app.py): with the application as an API.
- [requirements.txt](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-1/requirements.txt): containing the application dependencies.
- [.github/workflows/main_az-fct-python-ml.yml](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-1/.github/workflows/main_az-fct-python-ml.yml): the GitHub Action workflow. 

The previous article focuses on the application, hence on the `function_app.py` file. Here, we will focus on the GitHub Action workflow and the `.github/workflows/main_az-fct-python-ml.yml` file.

## The GitHub Action workflow
This workflow has been created during the Azure configuration and performs the following tasks:
<pre class="mermaid">
sequenceDiagram
    actor User
    participant GitHub
    participant GitHub Action
    participant Azure

    User->>GitHub: Push
    GitHub->>GitHub Action: Trigger a deployment
    GitHub Action->>GitHub Action: Build
    GitHub Action->>Azure: Deploy
</pre>

### The build step
<pre class="mermaid">
flowchart LR
    id1(Retrieve the application code) --> id2(Set the python version)
    id2 --> id3(Create the virtual environment)
    id3 --> id4(Start the virtual environment)
    id4 --> id5(Install the application's dependencies)
    id5 --> id6(Create the artifact)
    id6 --> id7(Save the artifact)
</pre>

The `build` step generates an [artifact](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts). An artifact results from operations on a software code. In our case, the artifact contains the application's code with its dependencies installed; it's an executable package. Users can download an artifact from the [run](https://docs.github.com/en/actions/managing-workflow-runs/downloading-workflow-artifacts) of the GitHub Action workflow that creates it.

![GitHub artifact](/assets/2023-12-10-azure-function-python-ml-part-2/github-artifact.gif)

> Artifact are kept [90 days](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-repository) by default.

### The deploy step
In order to deploy the application, the workflow must communicate with Azure. It performs this operation using a secret deployed by Azure during the configuration.
<pre class="mermaid">
sequenceDiagram
    participant GitHub Action
    participant GitHub
    participant Azure

    GitHub Action->>GitHub: Retrieve the artifact.
    GitHub Action->>GitHub: Retrieve the Azure's secret.
    GitHub Action->>Azure: Secret-based authentification.
    GitHub Action->>Azure: Application's code.
</pre>

> In the [current example](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-1/.github/workflows/main_az-fct-python-ml.yml), the secret is named: `AZUREAPPSERVICE_PUBLISHPROFILE_A9B4B58D0D7443A68FA374C8D4F718A6`.

GitHub can manage [secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) and [variables](https://docs.github.com/en/actions/learn-github-actions/variables) usable in workflows. Secrets and variables allow a dynamics customization, extremely useful when coupled with [environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment), but we will tackle that in the next article.

![GitHub secret](/assets/2023-12-10-azure-function-python-ml-part-2/github-secret.gif)

> Users need to be careful when using secrets in their workflows. Workflows create logs that may contain secrets, leading to security issues. Some bots continuously crawl GitHub's public repositories to find and exploit leaked credentials. It's also a common privilege escalation on private repositories.

> Logs are kept [90 days](https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization) by default.

# Isolating the training part
Training and predicting simultaneously without validation is not an everyday use case. A more realistic approach is to train the model, validate it, and then deploy it. This article focuses on the isolation of the training part, leaving the validation step to the next.

Putting a machine learning model in a Git repository is not the best idea, even if technically possible at our scale. A more realistic and scalable way is to create it in the GitHub workflow's `build` step, letting the GitHub Action train it remotely. Then, save the trained model in a file, packaged with the application deployed on the Azure Function.

<pre class="mermaid">
sequenceDiagram
    User ->> GitHub: Push
    GitHub ->> GitHub Action: Trigger
    Note over User,Azure: Build start.
    GitHub Action ->> GitHub Action: Train the model
    GitHub Action ->> GitHub Action: Save the model
    GitHub Action ->> GitHub Action: Create the artifact
    Note over User,Azure: End of the build.
    GitHub Action ->> Azure: Deploy
</pre>

> Here, we save the trained model in the [pickle](https://scikit-learn.org/stable/model_persistence.html) format for pedagogical purposes.

> In our case, the dataset is alongside the code, therefore, on Git. Another article will discuss remote data retrieval for training, but we will keep things simple at this stage of this guide.

## Updating the application
First, create a `train.py` file besides the current `function_app.py` file with the following content:
```
import pickle
from sklearn.ensemble import RandomForestClassifier

# Define the model.
clf = RandomForestClassifier(random_state=0)

# Define the training dataset.
X = [[ 1,  2,  3], [11, 12, 13]]
y = [0, 1]

# Train the model on the dataset.
clf.fit(X, y)

# Save the model as a pickle file.
with open('model.pkl', 'wb') as f:
    pickle.dump(clf, f)
```

Then update the `function_app.py` to load and serve the model:
```
import json
import pickle
import azure.functions as func

# Create the Azure Function App.
# The ANONYMOUS level indicates no authentification is needed to access this API.
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# Defining the API endpoint.
@app.route(route="predict")
def predict(req: func.HttpRequest):
    # Retrieve the data to be predicted.
    # For education purposes, there is no input validation.
    to_predict = req.get_json()

    # Load the model.
    with open('model.pkl', 'rb') as f:
        clf = pickle.load(f)

    # Run the prediction.
    prediction = clf.predict(to_predict)

    # Convert the prediction for HTTP output.
    res = json.dumps(prediction.tolist())

    # Return the HTTP result.
    return func.HttpResponse(res, status_code=200)
```

> Both files are available [here](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-2/).

The application is now ready.

## Updating the GitHub Action workflow
Add the training to the `build` step:
```
build:
  runs-on: ubuntu-latest
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
      run: python train.py

    - name: Zip artifact for deployment
      run: zip release.zip ./* -r

    - name: Upload the artifact for deployment job
      uses: actions/upload-artifact@v3
      with:
        name: python-app
        path: |
          release.zip
          !venv/
```

> The complete workflow is [here](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-2/.github/workflows/main_az-fct-python-ml.yml).

And that's it! Next time this action runs, the GitHub Action will train, save, and then deploy the model beside the application code on the Azure Function. API consumers must notice an improvement in the response time.

The user can retrieve and test the generated model thanks to the artifact.

![Retrieving the trained model](/assets/2023-12-10-azure-function-python-ml-part-2/model-trained.gif)

## GitHub Action and machine learning training
Training the model using the GitHub Action service can be surprising, but it's a good place to handle the task. Indeed, GitHub Action can provide [large machines](https://docs.github.com/en/actions/using-github-hosted-runners/about-larger-runners/about-larger-runners), and workflows can run for [hours](https://docs.github.com/en/actions/learn-github-actions/usage-limits-billing-and-administration#usage-limits). In fact, [GitHub considers this topic](https://github.blog/changelog/2023-10-31-run-your-ml-workloads-on-github-actions-with-gpu-runners/) seriously, and we will probably see more of it in the future.

> A dedicated GitHub Runner article will demonstrate some possibilities offered by GitHub.

# Summary and next step
Remotely training a model is convenient and easy with GitHub Action. But, putting a model in production requires verifying its integrity. The following article will focus on a validation step ensuring the model quality before the deployment.

> Any comments, feedback or problems? Please create an issue [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).
