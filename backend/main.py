from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import (
    changes,
    runs,
    analytics,
    documents
)

# Importing database automatically
# triggers:
# Base.metadata.create_all(...)
# during startup

import database

# Main FastAPI application
app = FastAPI(
    title="Workflow Eval API"
)

# Allow frontend running on localhost:5173
# to communicate with backend on localhost:8000
# Without CORS the browser blocks requests

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes from changes.py
app.include_router(changes.router)

# Register all routes from runs.py
app.include_router(runs.router)

# Resgister all routes from analytics.py
app.include_router(analytics.router)

# Register all routes from documents.py
app.include_router(documents.router)

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Workflow Eval API is running"
    }


# Health endpoint
@app.get("/health")
def health():
    return {
        "status": "ok"
    }