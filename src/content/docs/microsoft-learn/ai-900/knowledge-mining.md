---
title: Document Intelligence and Knowledge Mining
description: AI-900 Certification Learning Notes - Document Intelligence and Knowledge Mining
---

> **Disclaimer:** These are my personal learning notes. Do not consider them an official source of truth.

---

## Document Intelligence

### Definitions
"Document Intelligence" refers to machine learning models trained to recognize and extract data from text. The capability of extracting text or identifying its location on a page is called "document analysis."

### Azure AI Document
This service specializes in extracting information from documents. It can extract text using pre-built models or custom models trained on specific data. A notable capability is extracting information from receipts captured through images, scans, PDFs, and other formats.

Azure AI Document has been trained on a wide range of documents, with particular strengths in these domains:
- Financial
- Legal
- US tax
- US Mortgage
- Identification documents

## Knowledge Mining

### Definitions
Knowledge mining is the process of extracting actionable knowledge from data (structured or unstructured) at scale.

### Azure AI Search
#### Overview
Azure AI Search, built upon Apache Lucene—an open-source search engine library renowned for its powerful indexing and query capabilities— enables searching and extracting information from various data sources, including:
- Images
- Handwritten text
- PDFs
- JSON files

It performs content extraction followed by indexing.

#### Content Extraction
Content extraction and analysis can utilize vector search, full-text search, or hybrid search methods. It can handle phonetic or language-specific matches.

The data ingestion pipeline typically looks like this:

```
Data Source → Indexer (Document Cracking and Enrichment) → Indexing → Ready for Search
```

The indexer first extracts information from documents (document cracking), then enriches the data with additional metadata (enrichment). During enrichment, various pre-built or custom skills, such as Optical Character Recognition (OCR), image processing, NLP, translation, or Azure functions, can be applied. Multiple skills can form a skillset.

##### Indexer
An indexer can index only one data source, but multiple indexers can target the same data source, allowing different indexing strategies or skillsets to be applied independently based on diverse use cases or search requirements. For blob storage, the indexer initially reads all data, subsequently only indexing new data. For SQL or CosmosDB, change detection must be enabled to track modifications in the source data, ensuring only new or updated records are indexed, thus optimizing resource usage and indexing performance

Indexer Steps:
1. **Document Cracking:** The indexer extracts information from the source data. It reads binary data from files but only non-binary data from SQL or CosmosDB.
2. **Field Mapping:** Data is extracted from a source field into a target field. The target field can be either user-defined (custom mapping) or pre-defined.
3. **Skillset (optional):** A skillset represents a pipeline applying processes (e.g., OCR, image processing, NLP, translation, Azure functions) to transform data.
4. **Skillset Output Mapping (if skillset is used):** The skillset's output can be mapped to specific target fields.

Indexers can run on a schedule or be triggered on demand.

#### Querying
Simple queries follow this syntax: `<searched content> (+<content to include> -<content to exclude>)`, for example, `coffee (-"busy" +"wifi")`.

More complex queries can utilize the Lucene query syntax.

