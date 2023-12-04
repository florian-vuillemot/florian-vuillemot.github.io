---
layout: mermaid
title:  "[Part 2] Azure Function and machine learning applications"
categories: azure azure-function machine-learning python github github-action
permalink: azure-function/machine-learning/part-2
---
# Introduction
The [previous article]({% link _posts/2023-12-03-azure-function-python-ml-part-1.markdown %}) focus on the first step to transform as an API a little machine learning application.

The objectif of the current article, is to allow the reader to deploy and bigger machine learning application requiring real training step.

> [Here](https://github.com/florian-vuillemot/az-fct-python-ml/tree/main/part-2) is the code for this article.

> Feel free to create an issue for comment or improvement [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).


# Status
## The application
In the [first article]({% link _posts/2023-12-03-azure-function-python-ml-part-1.markdown %}).
```
import json

import azure.functions as func
from sklearn.ensemble import RandomForestClassifier

# Create the Azure Function App.
# The ANONYMOUS level indicates no authentification is needed to access this API.
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


# Defining the API endpoint.
@app.route(route="predict")
def predict(req: func.HttpRequest):
    # Retrieve the data to be predicted.
    # For education purposes, there is no input validation.
    to_predict = req.get_json()

    # Define the model.
    clf = RandomForestClassifier(random_state=0)

    # Define the training dataset.
    X = [[ 1,  2,  3], [11, 12, 13]]
    y = [0, 1]

    # Train the model on the dataset.
    clf.fit(X, y)

    # Run the prediction.
    prediction = clf.predict(to_predict)

    # Convert the prediction for HTTP output.
    res = json.dumps(prediction.tolist())

    # Return the HTTP result.
    return func.HttpResponse(res, status_code=200)
```

## The GitHub workflow
The current status of workflow do the following steps:
```mermaid
sequenceDiagram
    actor User
    participant GitHub
    participant GitHub Action
    participant Azure

    User->>GitHub: Push
    GitHub->>GitHub Action: Trigger a deployment
    GitHub Action->>Azure: Deploy
```

Let's focus on the "deploy" action. The worklow presents in `.github/workflows/main_az-fct-python-ml.yml` do it in two steps: the build then the deploy.

## Build
The `build` step in the workflow do the following actions:
```mermaid
flowchart LR
    id1(Retrieve the application code) --> id2(Set the python version)
    id2 --> id3(Create the virtual environment)
    id3 --> id4(Start the virtual environment)
    id4 --> id5(Install the application dependencies)
    id5 --> id6(Create the artifact)
    id6 --> id7(Saved the artifact)
```

The purpose of the build is to generate an artifact. An Artifact is the output of a build or compilation process and represent a versioned and packaged form of the application. They are essential for maintaining consistency, traceability, and reproducibility throughout the software development and deployment lifecycle. If you doing an application for fun, you probably don't need to worry about artifact, but in company you do.

Artifacts are stored on GitHub in the run of the [GitHub Action](https://docs.github.com/en/actions/managing-workflow-runs/downloading-workflow-artifacts). They are downloadable and expectable.
![GitHub artifact](/assets/2023-12-10-azure-function-python-ml-part-2/github-artifact.gif)

> Artifact are keep [90 days](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-repository) by default.


## Deploy
The `deploy` step in the workflow do the following actions:
```mermaid
flowchart LR
    id1(Download the artifact) --> id2(Unzip the application code)
    id2 --> id3(Deploy the application code)
```

To be able to deploy the artifact, the deploy step must communicate with the Azure Function. To do so, it using secrets automatically deployed by Azure during the configuration of the infrastructure in the [first article]({% link _posts/2023-12-03-azure-function-python-ml-part-1.markdown %}).

GitHub can managed [secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) and [variable](https://docs.github.com/en/actions/learn-github-actions/variables) usable in workflow. Be careful with the manipulation of secrets in your workflow. As artifacts, logs provided by a workflow have a retention period of [90 days](https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization) by default. In case of leak, rotate your credentials as soon as possible.
![GitHub secret](/assets/2023-12-10-azure-function-python-ml-part-2/github-secret.gif)

> Note: Some bots are scrolling GitHub's public repositories to find and exploit leaked credentials. To improve it's user security, [GitHub](https://github.blog/2022-12-15-leaked-a-secret-check-your-github-alerts-for-free/) does too but can't catch everything. Limit your secrets, there access and update them frequently for a better security.

```
name: Build and deploy Python project to Azure Function App - az-fct-python-ml

# The trigger of the workflow.
on:
  push:
    branches:
      - main            # On each push on main.
  workflow_dispatch:    # Manually triggered: https://docs.github.com/en/actions/using-workflows/manually-running-a-workflow


# Environment variables.
env:
  AZURE_FUNCTIONAPP_PACKAGE_PATH: '.' # set this to the path to your web app project, defaults to the repository root
  PYTHON_VERSION: '3.10' # set this to the python version to use (supports 3.6, 3.7, 3.8)


jobs:
  # The first part of the workflow is to build the application.
  # During the build, the workflow will create a package directly usable in the
  # targetted environment. 
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      # Install the python version to use during in the workflow.
      - name: Setup Python version
        uses: actions/setup-python@v1
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Create and start virtual environment
        run: |
          python -m venv venv
          source venv/bin/activate

      - name: Install dependencies
        run: pip install -r requirements.txt

      # Zip the content of the application 
      - name: Zip artifact for deployment
        run: zip release.zip ./* -r

      - name: Upload artifact for deployment job
        uses: actions/upload-artifact@v3
        with:
          name: python-app
          path: |
            release.zip
            !venv/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: 'Production'
      url: ${{ steps.deploy-to-function.outputs.webapp-url }}

    steps:
      - name: Download artifact from build job
        uses: actions/download-artifact@v3
        with:
          name: python-app

      - name: Unzip artifact for deployment
        run: unzip release.zip

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
