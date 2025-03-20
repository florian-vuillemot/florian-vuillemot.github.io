---
title: Natural Language Processing
description: AI-900 Certification Learning Notes - NLP
---

> **Disclaimer:** These are my personal learning notes. Do not consider them an official source of truth.

---

## Tokenization
Tokenization can take multiple forms. For example, the sentence "we choose to go to the moon" can be tokenized as:
- **Unigram**: ["we", "choose", "to", "go", "to", "the", "moon"], then represented as {1,2,3,4,3,5,6}.

### Pre-processing
These are potential operations performed before running a machine learning algorithm:
- **Lowercasing**: Converting all words to lowercase. It can introduce difficulties with proper nouns.
- **Removing punctuation**: Eliminating punctuation from the text, which can remove significant information.
- **Removing stop words**: Excluding common words like "the", "is", and "and" that hold little semantic value.
- **n-grams**: Grouping words or phrases based on the number of words they contain. For example: "Ok" → unigram, "I have" → bigram, "I have dreams" → trigram.
- **Stemming**: Reducing words to their root forms, e.g., "power", "powered", and "powerful" become "power".

## Understanding the Meaning

### Frequency Analysis
Frequency analysis is conducted using words that are not stop words and helps identify the most common words within a text.

An algorithm like **Term Frequency - Inverse Document Frequency (TF-IDF)** is commonly used for frequency analysis. It couples terms that appear frequently in a document but not across other documents.

### Machine Learning
Classification algorithms such as Logistic Regression can be trained to categorize text. A common application is sentiment analysis, determining whether text expresses positive or negative sentiment.

### Semantic Language Models
Each word carries semantic meaning for humans. The idea behind semantic language models is to capture this meaning (and contextual information) in vectors that machines can interpret.

For example, humans understand that "cats" and "dogs" are both "pets". "Pets" implies they are animals living in our homes. This complex information is translated into vectors positioned close together at least in terms of concepts like "animal" and "companionship".

## Conversational Language Understanding (CLU)
To interpret user input effectively, a machine must understand utterances, entities, and intents. In Azure AI Language Studio, users define intents, entities, and utterances, and then train models on these inputs to enhance performance.

### Utterance
An utterance is something a user says that the machine must understand. It could be a question, command, or statement.

Example: "Switch the fan on."

### Entity
An entity is the object or subject the utterance refers to. It could be a person, place, thing, etc.

Example: In "Switch the fan on," the entity is "fan."

### Intent
The intent represents the user's purpose or goal. The intent can be "None" if the utterance's purpose isn't clear.

Example: "Switch the fan on." → Intent: "TurnOn". "What's the meaning of life?" → Intent: "None".

## Azure AI Language
As part of Azure AI Services, Azure AI Language performs language processing analysis tasks such as:
- **Language detection**: Identifies the primary language in a sentence, providing a confidence score. Some languages or symbols (e.g., emoticons like ":-)") may not be recognized.
- **Entity recognition and linking**: Adds contextual information to items, such as subtype information ("DateTime", "number", "percentage", "age") or links to Wikipedia articles for locations.
- **Personally Identifiable Information (PII)**: Detects sensitive personal information and personal health information.
- **Named entity recognition**: Identifies people, places, and events. It can be customized for additional categories.
- **Sentiment analysis and opinion mining**.
- **Summarization**.
- **Key phrase extraction**: Helps extract the main ideas from text.

## Speech Recognition

### How Speech-to-Text Works
1. **Acoustic model**: Converts audio signals into phonemes.
2. **Language model**: Transforms phonemes into the most probable words.

### How Text-to-Speech Works
This process requires:
- **Text**: The content to convert to speech.
- **Voice font**: The specific voice used for speech synthesis.

It starts by tokenizing text into words and assigning phonetic sounds to each word. Then it segments text into prosodic units (like sentences). Finally, phonemes are converted into audio signals matched with chosen voice characteristics.

### Azure AI Speech
Enables text-to-speech and speech-to-text conversions, both in batch processing and real-time. It allows customization of models for specific pronunciation or acoustic properties.

## Translation

### Semantic vs. Literal Translation
- **Semantic translation** focuses on conveying the meaning of the original text.
- **Literal translation** focuses on translating individual words exactly as they appear.

### Speech Translation
Speech translation can occur as speech-to-speech or speech-to-text-to-speech.

### Translation in Azure
- **Azure AI Speech** can translate from speech-to-text or speech-to-speech across 90 languages.

- **Azure AI Translation** translates only text-to-text across 130 languages.
    - It can convert texts or documents and offers customized models.
    - Supports profanity filtering.
    - Allows selective translation to exclude certain terms or brand-specific words.
