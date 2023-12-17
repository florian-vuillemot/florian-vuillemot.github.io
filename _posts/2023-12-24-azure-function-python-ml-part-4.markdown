---
layout: mermaid
title:  "[Part 4] Azure Functions and machine learning applications"
categories: azure azure-function machine-learning python github github-action
permalink: azure-function/machine-learning/part-3
---
# Introduction
The [previous article]({% link _posts/2023-12-13-azure-function-python-ml-part-3.markdown %}) allows an human validation before deploying the application. We can go further allowing the user to rollback its application in case of crashed.


> [Here](https://github.com/florian-vuillemot/az-fct-python-ml/tree/main/part-4) is the code for this article.

> Feel free to create an issue to comment on or help us improve [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).


# Current status
The [previous article]({% link _posts/2023-12-17-azure-function-python-ml-part-3.markdown %}) leads to these files:
- [function_app.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/function_app.py): with the application API.
- [train.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/train.py): doing the model training.
- [test.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/test.py): testing the API.
- [requirements.txt](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/requirements.txt): containing the application dependencies.
- [.github/workflows/main_az-fct-python-ml.yml](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/.github/workflows/main_az-fct-python-ml.yml): the GitHub Action workflow doing the model training, asking for validation then deploying the API.


# Blue-green deployment
It's a deployment model allowing a quick switch between two versions of an applications. The "blue" application running at the version N, and the "green" application running at the version N+1 at the initial state. Blue-green deployment is switch from the "blue" version to the "green" version but keeps the "blue" running offline in case of failure of the "green" version allowing an easy rollback. You can find more information [here](https://en.wikipedia.org/wiki/Blue%E2%80%93green_deployment) and on the Internet.

Another advantage of this deployment model: it's native in Azure Function.

# Azure Function deployment slot
A [deployment slot](https://learn.microsoft.com/en-us/azure/azure-functions/functions-deployment-slots?tabs=azure-portal) is a live application with dedicated endpoint. There is at least one deployment slot by Azure Function and it's the one we are using since the beginning of this guide. You can add another deployment slot and host another live application with its dedicated endpoint. What is interesting, is the possibility of swapping those slots because it allows the blue-green deployment fonctionnality.

> The current [consumption plan](https://learn.microsoft.com/en-us/azure/azure-functions/consumption-plan) limits the number of deployment to two but [Prenium](https://learn.microsoft.com/en-us/azure/azure-functions/functions-premium-plan?tabs=portal) and [Dedicated](https://learn.microsoft.com/en-us/azure/azure-functions/dedicated-plan) allow more.

## Adding a slot
Slots are in the Azure Function "Deployment slots" panel. Initially only one slot is present. Add an new slot by clicking on "Add slot", name it *Staging* then validate. When creates, two slots are present but the new slot is empty and we must push code as we did on the production slot.

## Inspecting a slot
In the deployment slot panel, click on the slot deployment name as explain [here](https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots?tabs=portal). From the UI point of view, the user is on a similar Azure Function but without application ready.

![Deployment slot demo](/assets/2023-12-24-azure-function-python-ml-part-4/create-slot.gif)

# Workflow
The current workflow updates the application on the "Production" slot:
```
- name: 'Deploy to Azure Functions'
  uses: Azure/functions-action@v1
  id: deploy-to-function
  with:
    app-name: 'az-fct-python-ml'
    slot-name: 'Production'
    package: ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
    publish-profile: ${{ secrets.AZUREAPPSERVICE_PUBLISHPROFILE_A9B4B58D0D7443A68FA374C8D4F718A6 }}
    scm-do-build-during-deployment: true
    enable-oryx-build: true
```
Leading the deployment to deploy on the production environment immediatly.

Updating the version `N` of the application to the version `N'` with the blue-green deployment using deployment slot and GitHub Action, leads to the following diagram:
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
First, update the workflow to deploy on the *Staging* slot:
```
- name: 'Deploy to Azure Functions'
  uses: Azure/functions-action@v1
  id: deploy-to-function
  with:
    app-name: 'az-fct-python-ml'
    slot-name: 'Staging'
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
Currently, your new and old application are in a running state. In case of failure, you can re run the last step of the workflow restoring the previous version of your application. Because the next deployment will erase the **staging** slot, rollbacks are not impacting next deployment.

ADD GIFFFFFF

## HTTP 503
Well magic is great but magic can't do everything. More then [cold start](https://azure.microsoft.com/fr-fr/blog/understanding-serverless-cold-start/), users may encountered [HTTP errors](https://github.com/projectkudu/kudu/wiki/Configurable-settings#disable-the-generation-of-bindings-in-applicationhostconfig) due to technical reasons. To limit this error, add in the app settings of all slots the variable `WEBSITE_ADD_SITENAME_BINDINGS_IN_APPHOST_CONFIG` set to `1`.

> A good article about that [here](https://medium.com/@yapaxinl/azure-deployment-slots-how-not-to-make-deployment-worse-23c5819d1a17).

ADD GIFFFF

# Summary and next step
We are now able to quickly rollback on an previous version of our application. 

> Any comments, feedback or problems? Please create an issue [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).
