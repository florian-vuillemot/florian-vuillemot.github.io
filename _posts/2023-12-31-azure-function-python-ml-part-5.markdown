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

# Azure File Share

# Exposing the model

## Update permissions

## Update the GitHub Action workflow

# Consumming the model

## Update permissions

## Update the application
Add binding

> Serverless nature of Azure Function lead to load the model on each call. This can be time consuming and take time if your model model size is consequence. If you are in this case, you may want to use som

# Summary and next step

> Any comments, feedback or problems? Please create an issue [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).
