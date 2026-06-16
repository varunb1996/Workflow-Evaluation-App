AI Workflow Evaluation Platform

Overview

The AI Workflow Evaluation Platform is a regression testing and deployment governance system for Retrieval-Augmented Generation (RAG) and agentic AI workflows.

The platform helps AI engineers detect workflow regressions before deployment by automatically evaluating workflow outputs against saved baseline queries.

Instead of manually checking whether prompt, retrieval, model, memory, or reranker changes improve or degrade workflow performance, the platform executes an automated evaluation pipeline and produces deployment recommendations.

---

Problem Statement

Modern AI systems evolve rapidly through:

- Prompt updates
- Retrieval configuration changes
- Model upgrades
- Memory modifications
- Knowledge base updates

Even small changes can introduce unexpected regressions.

The platform provides an automated evaluation framework that answers:

- Did the workflow improve?
- Did the workflow regress?
- Is it safe to deploy?

---

Key Features

Workflow Change Tracking

Track modifications across:

- Prompts
- Retrieval
- Rerankers
- Memory
- Models

---

Knowledge Base Management

Upload PDF documents that serve as the workflow's retrieval source.

Uploaded documents are automatically:

1. Stored
2. Chunked
3. Embedded
4. Indexed into FAISS

---

LangGraph Agent Workflow

The evaluation workflow is implemented using LangGraph.

Workflow:

- Retrieve relevant context
- Generate answers using Groq LLM
- Evaluate against baseline responses

---

Automated Regression Detection

Every evaluation run compares:

Baseline Output
        vs
Current Workflow Output

and classifies:

- Improvement
- No Change
- Regression

---

Deployment Recommendations

The system automatically determines:

- SAFE
- INVESTIGATE
- HOLD

based on detected regressions.

---

Analytics Dashboard

Provides insights including:

- Tag Risk Analysis
- Workflow Health
- Query Failure Analysis

---

Historical Tracking

Track:

- Workflow changes
- Evaluation runs
- Regression trends

over time.

---

Technology Stack

Frontend

- React
- Vite
- Axios

Backend

- FastAPI
- SQLAlchemy
- Pydantic

AI Stack

- Groq
- LangGraph
- LangChain

Retrieval

- FAISS
- Sentence Transformers

Storage

- SQLite

---

Architecture

See:

ARCHITECTURE.md

for detailed architecture and workflow diagrams.

---

Local Setup

Backend

Install dependencies:

pip install -r requirements.txt

Run backend:

uvicorn main:app --reload

---

Frontend

Install dependencies:

npm install

Run frontend:

npm run dev

---

Environment Variables

Create:

.env

Example:

GROQ_API_KEY=YOUR_GROQ_API_KEY

---

Future Enhancements

- PostgreSQL support
- Dataset Manager
- Multi-workflow support
- User authentication
- Team collaboration
- Scheduled evaluations
- CI/CD integration

---

Author

Built as an AI Engineering and Workflow Governance project demonstrating:

- Agentic AI
- LangGraph
- RAG Evaluation
- Workflow Regression Testing
- Deployment Governance
