---
layout: mermaid
title:  "[Part 4] Azure Functions and machine learning applications"
categories: azure azure-function machine-learning python github github-action
permalink: azure-function/machine-learning/part-3
---
# Introduction
The [previous article]({% link _posts/2023-12-13-azure-function-python-ml-part-3.markdown %}) improves delivery quality with testing and human validation before deploying the application. Regardless of the precautions taken before a new release, it can fail and the service needs to be restored as quickly as possible. In order to restore the service more quickly, we will allow rollbacks.

> [Here](https://github.com/florian-vuillemot/az-fct-python-ml/tree/main/part-4) is the code for this article.

> Feel free to create an issue to comment on or help us improve [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).


# Current status
The [previous article]({% link _posts/2023-12-17-azure-function-python-ml-part-3.markdown %}) leads to these files:
- [function_app.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/function_app.py): with the application API.
- [train.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/train.py): running the model training.
- [test.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/test.py): testing the API.
- [requirements.txt](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/requirements.txt): containing the application dependencies.
- [.github/workflows/main_az-fct-python-ml.yml](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/.github/workflows/main_az-fct-python-ml.yml): the GitHub Action workflow doing the model training, asking for deployment validation then deploying the API.

# Blue-green deployment
It's a deployment model that allows you to quickly switch from one version of an application to another. The "blue" application running at version N, and the "green" application running at version N+1 in the initial state. Then, during deployment, we switch from the "blue" to the "green" version, while keeping the previous version offline in case of failure of the new current version, allowing easy rollback. Further information is available [here](https://en.wikipedia.org/wiki/Blue%E2%80%93green_deployment) and on the Internet.

Another advantage of this deployment model: it's native in Azure Function.

# Azure Function deployment slot
A [deployment slot](https://learn.microsoft.com/en-us/azure/azure-functions/functions-deployment-slots?tabs=azure-portal) is an independent live application with a dedicated endpoint and lifecycle. The default deployment slot is transparent: we're using it to host the application. It is also possible to add another deployment slot to host another live application with its own dedicated endpoint. Deployment slots on a same Azure Function can be swapped, enabling the blue-green deployment feature.

> The current [consumption plan](https://learn.microsoft.com/en-us/azure/azure-functions/consumption-plan) limits the number of deployment to two but [Prenium](https://learn.microsoft.com/en-us/azure/azure-functions/functions-premium-plan?tabs=portal) and [Dedicated](https://learn.microsoft.com/en-us/azure/azure-functions/dedicated-plan) allow more.

## Adding a slot
Slots are located in the Azure Function "Deployment slots" panel. Initially, only one slot is present. Add a new slot by clicking on "Add slot", name it **staging** and confirm. On creation, two slots are present, but the new slot is empty and we need to push an application as we did on the production slot.

ADD GIF

## Inspecting a slot
In the deployment slot panel, click on the slot deployment name as explain [here](https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots?tabs=portal). From the UI point of view, the user is on a similar Azure Function but empty.

![Deployment slot demo](/assets/2023-12-24-azure-function-python-ml-part-4/create-slot.gif)

# Workflow
Updating the version `N` of the application to the version `N'` with the blue-green deployment using deployment slot and GitHub Action, leads to the following infrastructure interraction diagram:
<pre class="mermaid">
sequenceDiagram
    participant GitHub Action
    participant Azure
    participant Staging slot
    participant Production slot
    note over Staging slot, Production slot: Staging slot: Version unknow<br>Production slot: Version N'
    GitHub Action ->> Azure: Deploy version N'
    Azure ->> Staging slot: Deploy version N'
    note over Staging slot, Production slot: Staging slot: Version N'<br>Production slot: Version N
    GitHub Action ->> Azure: Swap deployment slots
    Azure ->> Staging slot: Swap
    par
        Staging slot -> Production slot: Swap
    end
    note over Staging slot, Production slot: Staging slot: Version N<br>Version slot: Application N'
</pre>

## Update the GitHub Action workflow
First, update the workflow to deploy on the **Staging** slot by replacing `Production` by `staging`:
```
- name: 'Deploy to Azure Functions'
  uses: Azure/functions-action@v1
  id: deploy-to-function
  with:
    app-name: 'az-fct-python-ml'
    slot-name: 'staging'
    package: ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
    publish-profile: ${{ secrets.AZUREAPPSERVICE_PUBLISHPROFILE_A9B4B58D0D7443A68FA374C8D4F718A6 }}
    scm-do-build-during-deployment: true
    enable-oryx-build: true
```

Then, create a new step to swap slots:
```
- name: 'Swap slot'
  run: az functionapp deployment slot swap -g az-fct-python-ml_group -n az-fct-python-ml --slot staging --target-slot production
```
Where `az-fct-python-ml_group` and `az-fct-python-ml` are respectively the Ressource Group and the Azure Function creates during the [step 1]({% link _posts/2023-12-24-azure-function-python-ml-part-4.markdown %}) of this guide.

ADD GIF

## In case of failure
Currently, your new and old application are in a running state. In case of failure, you can re run the last step of the workflow restoring the previous version of your application. Because the next deployment will erase the **Staging** slot, rollbacks are not impacting next deployment.

ADD GIFFFFFF

## HTTP 503
The reader is probably already aware of the [cold start](https://azure.microsoft.com/fr-fr/blog/understanding-serverless-cold-start/), but during a swap API users may also encountered [HTTP errors](https://github.com/projectkudu/kudu/wiki/Configurable-settings#disable-the-generation-of-bindings-in-applicationhostconfig) during a couple of seconds due to technical reasons. To limit this error, add in the app settings of all slots the variable `WEBSITE_ADD_SITENAME_BINDINGS_IN_APPHOST_CONFIG` set to `1`.

> A good article about that [here](https://medium.com/@yapaxinl/azure-deployment-slots-how-not-to-make-deployment-worse-23c5819d1a17).

ADD GIFFFF

# Summary and next step
We can now quickly revert to the previous version of our application. But in fact, we're deploying an API that doesn't need updating: we're updating its model without touching the API code. The following article focuses on remote model storage, limiting infrastructure updates to each version.

> Any comments, feedback or problems? Please create an issue [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).
