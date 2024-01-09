---
layout: mermaid
title:  "[Part 4] Azure Functions and machine learning applications"
categories: azure azure-function machine-learning python github github-action
permalink: azure-function/machine-learning/part-4
---
# Introduction
The [previous article]({% link _posts/2023-12-17-azure-function-python-ml-part-3.markdown %}) improves delivery quality, adding a test and human validation before deploying the application. Despite precautions,  a new version of an application may fail, and restoring the service is a priority. In order to restore the service more quickly, this article integrates a rollback capability.

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
Blue-green deployment is a pattern for instantaneously switching from one version of an application - called **blue** - to another - called **green**. The **blue** application runs at version **N**, and the **green** application runs at version **N'**. During deployment, requests sent to the **blue** application are redirected to the **green** application: they switch. But the **blue** application continues to run in the background, and in the event of failure, it receives back requests, putting offline the **green** application: they roll back.

Another advantage of this deployment model is that it's native in Azure Function.

> Blue-green deployment is a standard, well-documented deployment model. The reader can find more information [here](https://en.wikipedia.org/wiki/Blue%E2%80%93green_deployment) or on the Internet.

# Azure Function deployment slot
A [deployment slot](https://learn.microsoft.com/en-us/azure/azure-functions/functions-deployment-slots?tabs=azure-portal) is an independent live application with a dedicated endpoint and lifecycle hosted on an Azure Function. The default deployment slot is transparent: we use it to host the application. Deployment slots on the same Azure Function can swap, enabling the blue-green deployment feature.

> The current [consumption plan](https://learn.microsoft.com/en-us/azure/azure-functions/consumption-plan) limits the number of deployment slots to two, but [Prenium](https://learn.microsoft.com/en-us/azure/azure-functions/functions-premium-plan?tabs=portal) and [Dedicated](https://learn.microsoft.com/en-us/azure/azure-functions/dedicated-plan) allow more.

## Adding a slot
Slots are in the "Deployment slots" panel of Azure Function. Initially, only the "Production" slot is present. Add a new slot by clicking "Add slot", name it **staging**, and confirm. Two slots are now present, but [the new slot](https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots?tabs=portal) is empty and we need to push an application as we did on the production slot.

![Deployment slot demo](/assets/2023-12-24-azure-function-python-ml-part-4/create-slot.gif)

# Authentication
The swap operation between slots is performed via the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/), which needs an authentication different from the one we are currently using. This authentication between the GitHub Action and Azure can be performed with [OpenID Connect](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure) (OIDC). OIDC is a tokenless authentication mechanism capable of replacing the current token-based authentication.

> Using OIDC removes the necessity of token rotation.

Following GIFs drives the reader through the main steps enabling OIDC, but a complete documentation is available [here](https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure?tabs=azure-portal%2Clinux).

First, create the Microsoft Entra application:
![Entra app](/assets/2023-12-24-azure-function-python-ml-part-4/create-app.gif)

Then, allow the Microsoft Entra application to deploy on both Azure Function deployment slots:
![App permission](/assets/2023-12-24-azure-function-python-ml-part-4/app-permissions.gif)

Then, allow GitHub Action to use the identity:
![Federated identity](/assets/2023-12-24-azure-function-python-ml-part-4/federated.gif)

Now, on GitHub, add the Microsoft Entra application information:
![GitHub secrets](/assets/2023-12-24-azure-function-python-ml-part-4/workflow-identity.gif)

Now, update [the workflow](https://github.com/florian-vuillemot/az-fct-python-ml/tree/main/part-4/.github/workflows/main_az-fct-python-ml.yml) to use the Microsoft Entra application as explained [here](https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure?tabs=azure-portal%2Clinux#set-up-azure-login-with-openid-connect-authentication). The workflow 'Deploy to Azure Functions' can not be updated yet and will still use the GitHub Secret to publish due to a [technical reason](https://github.com/Azure/functions-action/issues/147). But, the secret needs to be replaced by the [**publish profile** value](https://learn.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings?tabs=portal) of the **staging** slot because we are now publishing on it not on the **Production** slot.

# Workflow
Updating the **N** version of the application to the **N'** version with the blue-green deployment using the deployment slot and the GitHub Action leads to the following infrastructure interaction:
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
The current workflow contains the `build` and `deploy` jobs. The swap operation can be placed in the `deploy` job, which does not allow rollback. A solution is to create another job focused on the swap operation. In the event of failure, this job can be manually re-triggered, rollbacking the application.

Rename the `deploy` workflow to `deploy-on-staging` to be more precise, then update the deployment step to point on the **staging** slot by replacing `Production` by `staging`:
{% raw %}
```
deploy-on-staging:
  runs-on: ubuntu-latest
  needs: build
  environment:
    name: 'Production'
    url: ${{ steps.deploy-to-function.outputs.webapp-url }}

  steps:
    ...

    - name: 'Deploy to Azure Functions'
      uses: Azure/functions-action@v1
      id: deploy-to-function
      with:
        app-name: 'az-fct-python-ml'
        slot-name: 'staging'
        package: ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
        scm-do-build-during-deployment: true
        enable-oryx-build: true
```
{% endraw %}
Then, create a new job to swap slots:
{% raw %}
```
swap-staging-and-production:
  runs-on: ubuntu-latest
  needs: deploy-on-staging
  environment:
    name: 'Production'
    url: ${{ steps.deploy-to-function.outputs.webapp-url }}

  steps:
    - name: 'Az CLI login'
      uses: azure/login@v1
      with:
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
        enable-AzPSSession: true

    - name: Swap staging and production
      run: az functionapp deployment slot swap -g az-fct-python-ml_group -n az-fct-python-ml --slot staging --target-slot production
```
{% endraw %}
Where `az-fct-python-ml_group` and `az-fct-python-ml` are, respectively, the Ressource Group and the Azure Function created during the [step 1]({% link _posts/2023-12-24-azure-function-python-ml-part-4.markdown %}) of this guide.

> For simplicity, we only use one GitHub Environment and Azure pre-defined role for readability, which is not the best for security.

![Rollback](/assets/2023-12-24-azure-function-python-ml-part-4/rollback.gif)

## HTTP 503
The reader is probably already aware of the [cold start](https://azure.microsoft.com/fr-fr/blog/understanding-serverless-cold-start/), but during a swap, API users may also encounter [HTTP errors](https://github.com/projectkudu/kudu/wiki/Configurable-settings#disable-the-generation-of-bindings-in-applicationhostconfig) during a couple of seconds due to technical reasons. To limit this error, add in the app settings of all slots the variable `WEBSITE_ADD_SITENAME_BINDINGS_IN_APPHOST_CONFIG` set to `1`.

> A good article on this topic [here](https://medium.com/@yapaxinl/azure-deployment-slots-how-not-to-make-deployment-worse-23c5819d1a17).

![App settings](/assets/2023-12-24-azure-function-python-ml-part-4/app-settings.gif)

# Summary and next step
We can now quickly revert to the previous version of our application. But in fact, we're deploying an API that doesn't need updating: we're updating its model without touching the API code. The [following article]({% link _posts/2024-01-09-azure-function-python-ml-part-5.markdown %}) focuses on remote model storage, limiting infrastructure updates to each version.

> Any comments, feedback or problems? Please create an issue [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).
