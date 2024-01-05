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

Azure File Share is not a service directly instanciable from Azure. It's a service hold by Azure Storage Account. To create a File Share, let's first create an Azure Storage Account:

GIF

Now let's create the File Share **models**:

GIF

# Exposing the model
The model will no longer be in the artifact but in Azure File Share. Consequently, we must upload the model on it. This will change the GitHub `build` workflow.

ADD Mermaid

## Update permissions
To be able to upload a file on the Azure File Share we must provide the permission. To do so, go on the Azure File Share, then IAM and add role "" to the Microsoft Entra application **az-fct-python-ml** used by the GitHub Action workflow.

ADD GIF

## Update the GitHub Action workflow
Let's update the workflow to upload the generated model to the Azure FileShare.

# Consumming the model

## Update permissions

## Mount File Share
az webapp config storage-account add --account-name sahxdxmidphrzrqizjki --access-key Hf2Eq8UtWNreTohktbM/xhxhwTr0pC5ZD3ppqL5BBtbd5MGLIdqayTcb/n3tcw/gFbjT7nMdGKkV+AStpbveGA== --custom-id myaEid2 --share-name "test" --storage-type AzureFiles --resource-group az-fct-python-ml_group --name az-fct-python-ml --mount-path "/fileshare/"
+1 for the staging slot.
https://learn.microsoft.com/en-us/cli/azure/webapp/config/storage-account?view=azure-cli-latest#az-webapp-config-storage-account-add

Then restart the Function. or the restart will work on next deployment?

## Update the application
Add binding

> Serverless nature of Azure Function lead to load the model on each call. This can be time consuming and take time if your model model size is consequence. If you are in this case, you may want to use som

# Summary and next step

> Any comments, feedback or problems? Please create an issue [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).
