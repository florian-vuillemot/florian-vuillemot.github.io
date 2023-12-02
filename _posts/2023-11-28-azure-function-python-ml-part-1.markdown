---
layout: bootstrap
title:  "[Part 1] Azure Function and Machine Learning applications"
categories: azure azure-function machine-learning python github github-action
---
# Introduction
This article is the first of a guide to help the reader provide a machine learning application from its local environment to the cloud. This guide comprises articles focusing on the [MLOps](https://en.wikipedia.org/wiki/MLOps) topic and not the machine learning itself. Article by article, the application will improve its scalability and resilience, starting with nerds' needs and finishing with the enterprise's requirements.

Even if those articles go step-by-step, some Python, GitHub and Azure knowledge may be necessary. Articles provide official documentation to let the reader handle micro steps considered straightforward. Moreover, basic Python knowledge as packaging, condition or function as well as navigating in the GitHub interface, the Git part of GitHub are considered known as well as essential components of Azure components as [Resource Group](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal#what-is-a-resource-group).


# The application
## The basic example
In this example, we will use an example from the [scikit-learn](https://scikit-learn.org/) documentation.

Here is the local application that we want to expose as an API:
```
from sklearn.ensemble import RandomForestClassifier

# Define the model.
clf = RandomForestClassifier(random_state=0)

# Define the training dataset.
X = [[ 1,  2,  3],
    [11, 12, 13]]
y = [0, 1]

# Train the model on the dataset.
clf.fit(X, y)

# Do the prediction.
prediction = clf.predict([[4, 5, 6], [14, 15, 16]])

# Print the prediction result.
print(prediction)
```

## From a local application to an API
This application can not handle HTTP requests yet. We will follow the Azure Function framework to transform the code in an API. This framework may seem complex initially, but it looks like [Flask](https://flask.palletsprojects.com/en/3.0.x/) and is simple to use.

First, we will put the application code in a file named `function_app.py`. This file name is the default entry point used by Azure Function. If you want to use another name, you must configure the Azure Function, which is outside this article's scope.

Then, we will add the Azure Function framework layer to handle HTTP Request and return HTTP Response.
```
import json

import azure.functions as func
from sklearn.ensemble import RandomForestClassifier

# Create the Azure Function App.
# The level ANONYMOUS indicate there is no authentification need to access this API.
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


# Defining the API endpoint.
# This route listens `/predict`.
@app.route(route="predict")
def predict(req: func.HttpRequest):
    # Retrieve the data to predict.
    # For education purposes, there is no input validation.
    to_predict = req.get_json()

    # Define the model.
    clf = RandomForestClassifier(random_state=0)

    # Define the training dataset.
    X = [[ 1,  2,  3], [11, 12, 13]]
    y = [0, 1]

    # Training the model on the dataset.
    clf.fit(X, y)

    # Do the prediction.
    prediction = clf.predict(to_predict)

    # Converte the prediction for HTTP output.
    res = json.dumps(prediction.tolist())

    # Return the HTTP result.
    return func.HttpResponse(res, status_code=200)
```
Now, we must indicate the application dependencies in a `requirements.txt` file.
```
scikit-learn
azure-functions
```

Both files, `function_app.py` and `requirements.txt`, must be at the root of your repository and pushed GitHub to be consumed by the Azure Function.

{% include alerts/info.html content="To better understand the [Azure Function framework](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-python?tabs=asgi%2Capplication-level&pivots=python-mode-decorators) to understand better what is happening in the following code." %}

## Run locally an Azure Function
Now, the application is ready to serve in the cloud. However, running the application on the local machine is more complex than it was. Because here the code is a mix between the Azure Function framework and the application code, it is not possible to test the application code without running the [Azure Function emulator](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-local). Even if running this emulator is straightforward, the reader is encouraged to separate the Azure Function code and the business application to improve the feedback loop.


# Create and configure the infrastructure
We will use Azure Function service to expose our application on the Internet. While configuring the Azure Function, we will also configure the connection with GitHub. Based on this connection, we can create a GitHub Workflow to deploy the application automatically when a push operation happens on the repository.

The workflow:
```mermaid
sequenceDiagram
    actor User
    participant Azure
    participant GitHub
    participant GitHub Action

    Note over User,GitHub Action: Create and configure the infrastructure

    User->>Azure: Create the Azure Function
    Azure->>User: GitHub Integration ?
    User->>Azure: Yes
    Azure-->>GitHub: Ask for authorization
    GitHub->>User: Grant authorization ?
    User->>GitHub: Yes
    GitHub-->>Azure: Authorization granted

    Note over Azure,GitHub: When the Azure Function is created configure the continuous deployment
    Azure->>GitHub: Commit and push the GitHub workflow for the continuous deployment
    GitHub->>GitHub Action: Run the workflow
    GitHub Action->>Azure: Deploy

    Note over User,GitHub Action: Configuration and infrastructure are done
    User->>GitHub: Push on the 'main' branch
    GitHub->>GitHub Action: Run the workflow
    GitHub Action->>Azure: Deploy
```

## What is an Azure Function
Azure Functions is an event-driven serverless computing service that allows the execution of small applications - named "function" - without managing the underlying infrastructure. This service automatically scales based on the demand, and you pay only for the resources consumed during execution, making it a cost-effective solution for various application scenarios.

{% include alerts/info.html content="You can find more documentation about Azure Function [here](https://learn.microsoft.com/en-us/azure/azure-functions/)" %}

## What is GitHub Action
GitHub Actions is an automation and CI/CD service provided by GitHub. It allows the definition of workflows triggered by action on the GitHub repository. In our case, a trigger on the action 'push on main' will run a workflow created during the configuration to deploy the code on the Azure Function.

{% include alerts/info.html content="You can find more documentation about GitHub Action [here](https://docs.github.com/en/actions)" %}

## Step by step from the Azure Portal
1. Go to the [Azure Portal](https://portal.azure.com).
2. Search the "Function App" service, then click "create". [Here](https://learn.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal) is a step-by-step guide. 
3. The Azure Function name will be the subdomain of the API endpoint.
4. Specify the information without forgetting to update the runtime stack to `Python`.
![Create an Azure Function](/assets/2023-11-28-azure-function-python-ml-part-1/create-fct-app.png)
5. Click on "Next" until you are on the **Deployment** panel.
6. In this panel, you can authorize Azure to access a GitHub repository. In this case, I selected the repository containing the [example application](https://github.com/florian-vuillemot/az-fct-python-ml).
![GitHub configuration](/assets/2023-11-28-azure-function-python-ml-part-1/grant-deployment-permission.png)
7. The configuration is done, the Azure Function can be created. ![Configuration review](/assets/2023-11-28-azure-function-python-ml-part-1/review-before-create-fct-app.png)

After creating the Azure Function, Azure pushes the workflow file `main_az-fct-python-ml.yml` on the repository under folder `.github/workflows`. This file contains the workflow that GitHub will perform on each push on the branch `main`.
![GitHub repository files](/assets/2023-11-28-azure-function-python-ml-part-1/files-in-repository.png)


{% include alerts/info.html content="The next article will deep dive into this file." %}

The application is now accessible via an HTTP Request.
```
curl -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '[[4, 5, 6], [14, 15, 16]]' https://<fct-name>.azurewebsites.net/api/predict
[
    0,
    1
]
```

# GitHub Action
The GitHub Action panel contains the history of workflow runs. Currently, it only includes one run with the first deployment. Feel free to update the application to trigger a new deployment.
![GitHub Action panel](/assets/2023-11-28-azure-function-python-ml-part-1/github-actions-panel.png)

This workflow contains steps defined in the workflow configuration 
![GitHub Workflow](/assets/2023-11-28-azure-function-python-ml-part-1/github-action-workflow.png).

# Summary and next steps
This article gives the reader the basic knowledge to deploy a basic machine learning application. However, this simple example does not allow the deployment of a real machine-learning model! And that will be the focus of the next article.