import os
import uuid

from datetime import datetime

from dotenv import load_dotenv

from sqlalchemy import (
    create_engine,
    Column,
    String,
    Text,
    DateTime,
    JSON,
    Float
)

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "sqlite:///./eval.db"
)

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# CHANGE LOGS
class Change(Base):
    __tablename__ = "changes"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    description = Column(
        Text,
        nullable=False
    )

    tag = Column(String)

    workflow_id = Column(String)

    workflow_version = Column(String)

    prompt_version = Column(String)

    model_name = Column(String)

    retrieval_config = Column(Text)

    reranker_config = Column(Text)

    memory_config = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# BASELINE QUERIES
class QueryBaseline(Base):
    __tablename__ = "query_baselines"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    workflow_id = Column(String)

    query_text = Column(Text)

    baseline_output = Column(Text)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# EVALUATION RUNS
class Run(Base):
    __tablename__ = "runs"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    change_id = Column(String)

    workflow_id = Column(String)

    results = Column(JSON)

    drift_count = Column(String)

    verdict = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# QUERY RESULTS
class QueryResult(Base):
    __tablename__ = "query_results"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    run_id = Column(String)

    workflow_id = Column(String)

    query_id = Column(String)

    query_text = Column(Text)

    drift = Column(String)

    note = Column(Text)

    confidence = Column(Float)

    similarity_score = Column(Float)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

# CREATE TABLES
Base.metadata.create_all(bind=engine)

# DB SESSION
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()