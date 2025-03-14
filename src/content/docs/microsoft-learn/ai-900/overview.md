---
title: Overview
description: AI-900 certification learning notes - Overview
---

> **Disclaimer:** These are my personal learning notes. Do not consider them an official source of truth.

---

The AI-900 certification provides foundational knowledge of artificial intelligence (AI), including concepts, methods, and evaluation techniques across various AI workloads and models.

## Vision

Computer vision enables AI systems to interpret and process visual information from images or videos.

- **Image Classification:** Identifies objects within an image.
- **Object Detection:** Identifies objects and their locations within an image.
- **Semantic Segmentation:** Identifies boundaries and segments individual objects within an image.

## Speech

Speech technologies enable AI systems to understand and generate human speech.

- **Speech Recognition:** Converts spoken language to text.
- **Speech Synthesis:** Converts text into spoken language.

## Natural Language Processing (NLP)

NLP allows AI systems to comprehend, analyze, and generate human language.

- **Entity Extraction:** Identifies named entities (people, places, dates, etc.) within text.
- **Text Classification:** Assigns documents or text into predefined categories.
- **Sentiment Analysis:** Determines the emotional tone (positive, negative, neutral) within the text.
- **Language Detection:** Identifies the language in which a text is written.

> **Note:** NLP can also be referred to as Natural Language Understanding (NLU).

---

## Supervised Learning

Supervised learning involves training models on datasets containing labeled features, allowing the model to predict outcomes based on learned patterns.

### Classification

Used when labels are categorical.

#### Binary Classification

- Labels belong to one of two possible categories.
- Common algorithm: Logistic Regression.

#### Multiclass Classification

- Labels belong to one of three or more possible categories.

Common algorithms:
- **One-vs-Rest (OvR):** Trains a binary classifier for each category separately, then combines the results.
- **Multinomial Classification:** Predicts multiple categories, providing a probability for each category.

#### Evaluation Metrics

Evaluated using a confusion matrix and related metrics:

- **Accuracy:** \( \frac{TP + TN}{TP + TN + FP + FN} \)
  - Accuracy can be misleading if the data is imbalanced. For example, 95% accuracy on a dataset with 95% negatives means the algorithm always returns False.

- **Recall:** \( \frac{TP}{TP + FN} \)
  - Measures how many actual positives were correctly identified.

- **Precision:** \( \frac{TP}{TP + FP} \)
  - Measures how many predicted positives were correct.

### Regression

Regression is used when predicting continuous numerical outcomes based on input data.

#### Evaluation Metrics

- **Mean Absolute Error (MAE):** Average absolute difference between actual and predicted values.
  - Treats all errors equally regardless of direction.

- **Mean Squared Error (MSE):** Average squared difference between actual and predicted values.
  - Penalizes larger errors more significantly than smaller ones.

- **Root Mean Squared Error (RMSE):** Square root of MSE; measures error in the same unit as the label.

- **Coefficient of Determination (R²):** Indicates how much of the variance in the dependent variable can be explained by the model.
  - Ranges from 0 (poor fit) to 1 (perfect fit).

---

## Unsupervised Learning

Unsupervised learning involves training models on datasets without labels, discovering patterns or structures in the data based solely on features.

The most common unsupervised technique is **clustering**, grouping data points based on similarity.

- **K-means clustering:** Groups data into K clusters by finding the nearest neighbors and iteratively adjusting cluster centroids.

### Evaluation Metrics

Evaluating unsupervised models can be challenging due to the absence of labels.

- **Silhouette Score:** Measures how similar a data point is to its own cluster compared to others.
  - Ranges from -1 to 1; higher scores indicate better-defined clusters.

