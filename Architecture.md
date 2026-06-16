System Architecture

High-Level Architecture

                        ┌─────────────────┐
                        │   React UI      │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ FastAPI Backend │
                        └────────┬────────┘
                                 │
                ┌────────────────┼────────────────┐
                ▼                ▼                ▼

        ┌────────────┐   ┌─────────────┐   ┌────────────┐
        │ SQLite DB  │   │ LangGraph   │   │ Analytics  │
        └────────────┘   └──────┬──────┘   └────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │ FAISS Retriever │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Groq LLM        │
                        └─────────────────┘

---

Workflow Lifecycle

Step 1

Knowledge base documents are uploaded.

PDF Upload
      ↓
Document Storage
      ↓
Chunking
      ↓
Embeddings
      ↓
FAISS Index

---

Step 2

Baseline queries are created.

Example:

What problem is being solved?

Who are the stakeholders?

What are the key risks?

Each baseline stores:

Question
Expected Answer

---

Step 3

An engineer logs a workflow change.

Examples:

Prompt v1 → v2

Retriever TopK 5 → 10

Model Upgrade

Memory Configuration Update

---

Step 4

Evaluation Run Begins

Change Logged
       ↓
Load Baselines
       ↓
Run LangGraph Workflow
       ↓
Generate New Answers

---

Step 5

Retrieval Pipeline

User Query
      ↓
Retriever
      ↓
FAISS Search
      ↓
Relevant Chunks
      ↓
LangGraph State

---

Step 6

Generation Pipeline

Retrieved Context
        ↓
Groq LLM
        ↓
Answer Generation

---

Step 7

Regression Evaluation

Baseline Answer
        vs
Generated Answer

Evaluation categories:

Improvement

No Change

Regression

---

Step 8

Deployment Decision

Rules:

0 regressions
    ↓
SAFE

1-2 regressions
    ↓
INVESTIGATE

3+ regressions
    ↓
HOLD

---

Database Model

Change

Tracks workflow modifications.

Attributes:

- id
- description
- tag
- workflow_id
- workflow_version
- prompt_version
- model_name
- retrieval_config
- reranker_config
- memory_config
- created_at

---

QueryBaseline

Stores baseline evaluation queries.

Attributes:

- id
- workflow_id
- query_text
- baseline_output
- updated_at

---

Run

Stores evaluation results.

Attributes:

- id
- workflow_id
- change_id
- verdict
- drift_count
- results
- created_at

---

QueryResult

Stores query-level evaluation details.

Attributes:

- id
- run_id
- workflow_id
- query_id
- query_text
- drift
- confidence
- similarity_score
- note
- created_at

---

LangGraph Workflow

START
  │
  ▼
Retrieve Context
  │
  ▼
Generate Answer
  │
  ▼
END

State Object:

{
    "query": str,
    "context": str,
    "answer": str
}

---

Deployment Architecture

Frontend

Vercel

Hosts:

- React
- Vite

---

Backend

Render

Hosts:

- FastAPI
- LangGraph
- Groq Integration

---

Vector Database

FAISS

Stores:

- Document Embeddings
- Retrieval Index

---

LLM Provider

Groq

Model:

llama-3.1-8b-instant

---

End-to-End Flow

Upload PDF
      ↓
Build Vector Store
      ↓
Create Baselines
      ↓
Log Workflow Change
      ↓
Run Evaluation
      ↓
Generate Answers
      ↓
Compare With Baselines
      ↓
Detect Regressions
      ↓
Deployment Recommendation
      ↓
Analytics & History
