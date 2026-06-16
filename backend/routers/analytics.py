from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import (
    get_db,
    Change,
    Run,
    QueryResult
)

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"]
)

# Which change types are most risky?

@router.get("/tag-risk")
def tag_risk(
    db: Session = Depends(get_db)
):
    changes = db.query(Change).all()

    result = {}

    for change in changes:

        runs = (
            db.query(Run)
            .filter(Run.change_id == change.id)
            .all()
        )

        if change.tag not in result:
            result[change.tag] = {
                "total": 0,
                "regressions": 0
            }

        result[change.tag]["total"] += len(runs)

        for run in runs:

            if run.verdict != "safe":
                result[change.tag]["regressions"] += 1

    return result


# Which workflows are healthiest?

@router.get("/workflow-health")
def workflow_health(
    db: Session = Depends(get_db)
):
    runs = db.query(Run).all()

    summary = {}

    for run in runs:

        if run.workflow_id not in summary:

            summary[run.workflow_id] = {
                "total": 0,
                "safe": 0
            }

        summary[run.workflow_id]["total"] += 1

        if run.verdict == "safe":
            summary[run.workflow_id]["safe"] += 1

    return summary


# Which baseline queries fail most often?

@router.get("/query-failures")
def query_failures(
    db: Session = Depends(get_db)
):
    rows = (
        db.query(QueryResult)
        .filter(
            QueryResult.drift == "regression"
        )
        .all()
    )

    counts = {}

    for row in rows:

        key = row.query_text

        counts[key] = counts.get(key, 0) + 1

    return counts