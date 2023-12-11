---
layout: mermaid
title:  "[Part 3] Azure Functions and machine learning applications"
categories: azure azure-function machine-learning python github github-action
permalink: azure-function/machine-learning/part-3
---
# Introduction
The [previous article]({% link _posts/2023-12-10-azure-function-python-ml-part-2.markdown %}) transforms the application allowing a remote training proceed by a GitHub Action. The current article focus on improving the quality of the application by verifying the integrity and the correctness of this trained model.

> [Here](https://github.com/florian-vuillemot/az-fct-python-ml/tree/main/part-3) is the code article's code.

> Feel free to create an issue to comment on or help us improve [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).


# Current status
The [previous article]({% link _posts/2023-12-10-azure-function-python-ml-part-2.markdown %}) leads to these files:
- [function_app.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-2/function_app.py): with the application API.
- [train.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-2/train.py): doing the model training.
- [requirements.txt](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-2/requirements.txt): containing the application dependencies.
- [.github/workflows/main_az-fct-python-ml.yml](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-2/.github/workflows/main_az-fct-python-ml.yml): the GitHub Action workflow training the model then deploying the API.

# Validation steps
Before deploying a model in production, it interesting to perform some verifications. Verifications can be automatic as unit tests or manual as testing the application on a staging environment.

This article will:
- Add a unit test on the API.
- Ask for a human validation before deploying the new model.

But before, let's update the training part of the application to gather scoring metrics.

## Updating the application
Scoring is not possible with a dataset of two elements. Let's update the `train.py` file by generating the dataset before adding the scoring step and printing some model information:
```
import sys
import pickle

from sklearn.datasets import make_classification
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Define the model.
clf = RandomForestClassifier(random_state=0)

# Define the training dataset.
X, y = make_classification(
    n_samples=1000, n_features=3,
    n_informative=2, n_redundant=0,
    random_state=0, shuffle=False
)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)

# Train the model on the dataset.
clf.fit(X_train, y_train)

# Save the model as a pickle file.
with open('model.pkl', 'wb') as f:
    pickle.dump(clf, f)

# Evaluate the model.
scores = cross_val_score(clf, X_test, y_test, cv=5)

# Print some model's information.
print('### {scores.mean():.2f} accuracy with a standard deviation of {scores.std():.2f}')
```

## Automatic validation
[Software testing](https://en.wikipedia.org/wiki/Software_testing) is standard in software development. Let's add a test in a file `test.py` on the Azure Function to validate the interface of our application:
```
import json
import pickle
import unittest
import azure.functions as func
from sklearn.ensemble import RandomForestClassifier
from function_app import predict

class TestFunction(unittest.TestCase):
    X = [[1, 2, 3], [11, 12, 13]]
    y = [0, 1]

    def setUp(self):
        """
        Create a model specifically for the test.
        """
        clf = RandomForestClassifier(random_state=0)
        clf.fit(self.X, self.y)
        with open('model.pkl', 'wb') as fd:
            fd.write(pickle.dumps(clf))

    def test_interface(self):
        # Construct a mock HTTP request.
        req = func.HttpRequest(
            method='POST',
            url='/api/predict',
            body=json.dumps(self.X).encode()
        )

        # Call the function.
        func_call = predict.build().get_user_function()
        resp = func_call(req)

        # Check the output.
        self.assertEqual(
            json.loads(resp.get_body()),
            self.y,
        )

if __name__ == "__main__":
    unittest.main()
```
> [Here](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/test.py) the relative file.

> This article is not about testing and this application as this test are poor examples of what software testing is. Please, keep in mind the idea and workflow and not the implementation.

Then run the test on the GitHub Action workflow by adding the step:
```
- name: Test the API application
  run: python test.py
```
> [Here](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/.github/workflows/main_az-fct-python-ml.yml) the complete file.

In case of error, the GitHub Action stops the workflow and so the deployment.

=> Add a failing gif with the failure

## Manual validation
It's a common usecase to want a manual validation before updating a production environment. GitHub allows manual validation with the usage of [environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment).

Environments on GitHub allow the scoping of [secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-secrets) and [variables](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-variables) but also the management of [protection rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#deployment-protection-rules). Protection rules allows powerfull guardrail protecting the production environment from common mistake. An interresting fonctionality of protection rules is [required reviewers](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#required-reviewers). It allows a human validation before steps in workflows.

> For more information about secrets and variable in the context of our application, take a look at the [previous article]({% link _posts/2023-12-10-azure-function-python-ml-part-2.markdown %}).

During the configuration, Azure creates a "Production" environment. Let's update it to add the human validation:
- Go under the "Settings" bar of the application repository.
- Then click on the "Environments" panel.
- Select "Production".
- Click on "Required reviewers" and add the reviewer: it can be yourself.
- Then click on "Save protection rules".

=> Add GIF.

The workflow is already using this environment in the step `deploy`:
```
  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: 'Production'
      url: ${{ steps.deploy-to-function.outputs.webapp-url }}
```

> Remember, the workflow is in the file `.github\workflows\main_az-fct-python-ml.yml` [here](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/.github/workflows/main_az-fct-python-ml.yml).

Next time the workflow run, it will pause and wait the human validation before processing the `deploy` step.

=> Add Gif

# Training output
The `train.py` script print information about the model: 
```
print('### {scores.mean():.2f} accuracy with a standard deviation of {scores.std():.2f}')
```

Those information are important specially before validating a deployment and we want to get them easily not by searching in the workflow's logs. GitHub Action allows that by using the [environment file](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary) `GITHUB_STEP_SUMMARY`. Let's update the "Train the model" step to gather the output:
```
- name: Train the model
  run: python train.py >> $GITHUB_STEP_SUMMARY
```
=> GIF

Now, the user is able to verify the model accuracy before deploying it.

# Summary and next steps
Controlling what is deploying is only a step in an application journey. When deploy, an application must be monitoring and depending of some metric, may be rollback. As deployment, rollback can be automated as the next article will discuss.

> Any comments, feedback or problems? Please create an issue [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).
