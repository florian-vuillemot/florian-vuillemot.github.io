---
title: Generative AI
description: AI-900 Certification Learning Notes - Generative AI
---

> **Disclaimer:** These are my personal learning notes. Do not consider them an official source of truth.

---

## What is Generative AI?
Generative AI refers to AI technologies capable of producing original and creative content, such as text, images, music, and other media. Popular examples include ChatGPT and Microsoft Copilot.

## Key Concepts in Generative AI

### Transformer Architecture
The transformer architecture is the backbone of modern generative models and consists of two primary components:

- **Encoder:** Converts input text into semantic vectors (embeddings).
- **Decoder:** Generates coherent output text from the embeddings.

Some models use only a portion of this architecture:
- **GPT-3:** Uses the decoder only.
- **BERT:** Uses the encoder only.

### Tokenization
Tokenization involves breaking down input text into smaller units (tokens), allowing the encoder to efficiently process and analyze text data. More details are available in the [NLP notes](./nlp.md).

### Embeddings
Embeddings transform tokenized inputs into "contextual vectors," numerical representations capturing the semantic meaning of the text, enabling the model to understand and generate contextually relevant responses.

### Attention Mechanism
The attention mechanism enables models to dynamically focus on specific parts of the input text, assigning higher weights to words most relevant to the context. It helps distinguish between words with multiple meanings, for example:
- "The bark of the tree"
- "The dog bark"

Attention layers exist in both the encoder and decoder components of transformers.

## Large Language Models (LLM) vs. Small Language Models (SLM)

| Feature                 | LLM (Large Language Model)                                | SLM (Small Language Model)                                |
|-------------------------|-----------------------------------------------------------|-----------------------------------------------------------|
| **Model Size**          | Billions of parameters                                    | Millions of parameters                                    |
| **Training Data**       | Extensive, diverse datasets                               | Limited, specific datasets                                |
| **Computational Needs** | High resource usage                                       | Lower resource usage                                      |
| **Use Cases**           | Complex tasks, versatile use cases                        | Specific tasks, targeted applications                     |
| **Performance**         | Highly versatile and flexible                             | Specialized and optimized                                 |
| **Cost of Inference**   | Higher due to larger model size and resource requirements | Lower due to smaller model size and resource requirements |

## Generative AI in Azure

### Copilot Studio
A low-code platform fully hosted as a SaaS solution within Microsoft 365, enabling users to easily build and deploy custom AI-powered agents.

### Azure AI Foundry
Azure AI Foundry provides advanced tools and services to build and deploy AI models at scale. It includes robust functionalities for data preparation, model training, and deployment, specifically designed for data scientists and developers seeking a pro-code environment.

