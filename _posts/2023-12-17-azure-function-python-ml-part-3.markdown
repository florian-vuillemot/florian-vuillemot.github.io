---
layout: mermaid
title:  "[Part 3] Azure Functions and machine learning applications"
categories: azure azure-function machine-learning python github github-action
permalink: azure-function/machine-learning/part-3
---
# Introduction
The [previous article]({% link _posts/2023-12-10-azure-function-python-ml-part-2.markdown %}) transforms the application and enables remote training through a GitHub Action. This remote training is the base of the current article focusing on improving the quality of the application by verifying the integrity and correctness of this trained model.

> [Here](https://github.com/florian-vuillemot/az-fct-python-ml/tree/main/part-3) is the code article's code.

> Feel free to create an issue to comment on or help us improve [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).


# Current status
The [previous article]({% link _posts/2023-12-10-azure-function-python-ml-part-2.markdown %}) leads to these files:
- [function_app.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-2/function_app.py): with the application API.
- [train.py](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-2/train.py): doing the model training.
- [requirements.txt](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-2/requirements.txt): containing the application dependencies.
- [.github/workflows/main_az-fct-python-ml.yml](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-2/.github/workflows/main_az-fct-python-ml.yml): the GitHub Action workflow doing the model training then deploying the API.

# Validation steps
Before using a model, it is interesting to carry out some checks. The checks can be automatic in the form of unit tests or manually by letting a human perform verifications.

This article will:
- Add a unit test for the API.
- Require human validation before deploying the new model.

But before, we will update the training part of the application to collect scoring metrics.

## Updating the application
Scoring is not possible with the current dataset. Let's update the `train.py` file by creating a larger dataset before adding the scoring step and outputting some model information:
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
> [Here](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/test.py) the file.

> This article is not about testing! This application and this test are bad examples of what software testing is. Please think about the idea and the workflow and not the implementation.

Now, add the following step in GitHub Action workflow to perform the test remotely before deploying:
```
- name: Test the API application
  run: python test.py
```
> [Here](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/.github/workflows/main_az-fct-python-ml.yml) the complet file.

In case of an error, the GitHub Action stops the workflow and, thus, the deployment.

![Failing test stop the workflow](/assets/2023-12-17-azure-function-python-ml-part-3/failing-test.png)

## Manual validation
Human validation before updating the production environment is a common use case. GitHub allows this with [environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment).

Environments on GitHub not only enable the scoping of [secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-secrets) and [variables](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-variables), but also the management of [protection rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#deployment-protection-rules). Protection rules provide a powerful guardrail that protects an environment from common errors. Especially, it allows to specify human [validators](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#required-reviewers) that have to approve changes to let the workflow continue its execution manually.

In fact, our [workflow](https://github.com/florian-vuillemot/az-fct-python-ml/blob/main/part-3/.github/workflows/main_az-fct-python-ml.yml) already uses a "Production" environment created by Azure during the configuration:
```
deploy:
  runs-on: ubuntu-latest
  needs: build
  environment:
    name: 'Production'
    url: ${{ steps.deploy-to-function.outputs.webapp-url }}
```

So, we only need to apply a protection rule to add the human validation:
- Go under the "Settings" bar of the application repository.
- Then click on the "Environments" panel.
- Select "Production".
- Click "Required reviewers" and add the reviewer: it can be yourself.
- Then click on "Save protection rules".
![GitHub secret](/assets/2023-12-17-azure-function-python-ml-part-3/protection-rules.gif)

The next time the workflow is executed, it will pause and wait for human validation before performing the `deploy` step.

> For more information about secrets and variables in the context of our application, take a look at the [previous article]({% link _posts/2023-12-10-azure-function-python-ml-part-2.markdown %}).

# Training output
The `train.py` script prints information about the model: 
```
print('### {scores.mean():.2f} accuracy with a standard deviation of {scores.std():.2f}')
```

Those information are essential before validating a deployment, and we want to avoid getting it by searching in the workflow's logs. GitHub Action makes this possible by using the [environment file](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary) `GITHUB_STEP_SUMMARY`. Let's update the "Train the model" step to display this output:
```
- name: Train the model
  run: python train.py >> $GITHUB_STEP_SUMMARY
```
![Complete workflow](/assets/2023-12-17-azure-function-python-ml-part-3/complete-workflow.gif)

Now, the user can verify the model's accuracy before deploying it.

# Summary and next step
Controlling what is deployed is a step in an application journey. After deployment, an application must be monitored, and depending on the metrics, a rollback can take place. Like deployment, rollback can also be automated, as explained in the next article.

> Any comments, feedback or problems? Please create an issue [here](https://github.com/florian-vuillemot/florian-vuillemot.github.io).
