from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

# CHANGE LOGGING
class ChangeCreate(BaseModel):
    description: str

    tag: Optional[str] = "GENERAL"

    workflow_id: str

    workflow_version: str

    prompt_version: str

    model_name: str

    retrieval_config: str

    reranker_config: str

    memory_config: str


class ChangeOut(BaseModel):
    id: str
    description: str
    tag: str
    workflow_id: str

    workflow_version: Optional[str] = None
    prompt_version: Optional[str] = None
    model_name: Optional[str] = None
    retrieval_config: Optional[str] = None
    reranker_config: Optional[str] = None
    memory_config: Optional[str] = None

    created_at: datetime

    class Config:
        from_attributes = True

# BASELINE QUERIES
class QueryCreate(BaseModel):
    workflow_id: str

    query_text: str

    baseline_output: str


class BaselineOut(BaseModel):
    id: str

    workflow_id: str

    query_text: str

    baseline_output: str

    updated_at: datetime

    class Config:
        from_attributes = True

# QUERY DIFF RESULT
class QueryDiff(BaseModel):
    query_id: str

    query_text: str

    before: str

    after: str

    drift: str

    note: str

# RUN CREATION
class RunCreate(BaseModel):
    change_id: str

class RunResponse(BaseModel):
    run_id: str

    verdict: str

    drift_count: int

    results: list

# ANALYTICS
class TagRiskOut(BaseModel):
    tag: str

    total_runs: int

    regressions: int


class WorkflowHealthOut(BaseModel):
    workflow_id: str

    total_runs: int

    safe_runs: int

    safe_rate: float


class QueryFailureOut(BaseModel):
    query_text: str

    regression_count: int

# CONFIG HISTORY
class ConfigurationHistoryOut(BaseModel):
    workflow_version: str

    prompt_version: str

    model_name: str

    retrieval_config: str

    reranker_config: str

    memory_config: str

    created_at: datetime