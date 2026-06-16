from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.workflow_runner import run_workflow

from database import (
    get_db,
    Run,
    QueryBaseline,
    Change,
    QueryResult
)

from services.diff import classify_drift

from models import (
    RunCreate,
    RunResponse,
    QueryCreate,
    BaselineOut
)

from typing import List

router = APIRouter(
    prefix="/runs",
    tags=["runs"]
)


# POST /runs - Engineer submits fresh outputs generated after making a workflow change.
@router.post("/", response_model=RunResponse)
def create_run(
    payload: RunCreate,
    db: Session = Depends(get_db)
):
    # Verify that the change exists
    change = (
        db.query(Change)
        .filter(Change.id == payload.change_id)
        .first()
    )

    if not change:
        raise HTTPException(
            status_code=404,
            detail="Change not found"
        )

    # Load all baseline queries
    # associated with this workflow
    baselines = (
        db.query(QueryBaseline)
        .filter(
            QueryBaseline.workflow_id
            == change.workflow_id
        )
        .all()
    )

    if not baselines:
        raise HTTPException(
            status_code=400,
            detail="No baseline queries saved for this workflow."
        )

    results = []

    # Tracks how many regressions occur
    regression_count = 0

    # Compare every baseline against
    # the new output submitted
    for q in baselines:

        after_output = run_workflow(
            q.query_text,
        )

        # Ask our AI evaluator
        diff = classify_drift(
            q.baseline_output,
            after_output
        )

        if diff["drift"] == "regression":
            regression_count += 1

        # Save result for report
        results.append({
            "query_id": q.id,
            "query_text": q.query_text,
            "before": q.baseline_output,
            "after": after_output,
            "drift": diff["drift"],
            "note": diff["note"],
            "confidence": diff["confidence"],
            "similarity_score": diff["similarity_score"]
        })

    # Overall verdict logic
    #
    # 0 regressions = safe
    # 1-2 regressions = investigate
    # 3+ regressions = hold

    if regression_count == 0:
        verdict = "safe"
    elif regression_count <= 2:
        verdict = "investigate"
    else:
        verdict = "hold"

    # Save evaluation report
    run = Run(
        change_id=payload.change_id,
        workflow_id=change.workflow_id,
        results=results,
        drift_count=str(regression_count),
        verdict=verdict
    )

    db.add(run)
    db.commit()
    db.refresh(run)

    # Save every query result individually
    for r in results:

        qr = QueryResult(
            run_id=run.id,
            workflow_id=change.workflow_id,
            query_id=r["query_id"],
            query_text=r["query_text"],
            drift=r["drift"],
            note=r["note"],
            confidence=r["confidence"],
            similarity_score=r["similarity_score"]
        )

        db.add(qr)

    db.commit()

    return {
        "run_id": run.id,
        "verdict": verdict,
        "drift_count": regression_count,
        "results": results
    }

# POST /runs/baselines - Save a baseline query and its current good output.
# Future runs compare against this.
@router.post("/baselines")
def save_baseline(
    payload: QueryCreate,
    db: Session = Depends(get_db)
):
    baseline = QueryBaseline(
        workflow_id=payload.workflow_id,
        query_text=payload.query_text,
        baseline_output=payload.baseline_output
    )

    db.add(baseline)
    db.commit()
    db.refresh(baseline)

    return {
        "baseline_id": baseline.id,
        "message": "Baseline saved."
    }


# GET /runs/baselines?workflow_id=wf_001 - List all baseline queries for a workflow

@router.get(
    "/baselines",
    response_model=List[BaselineOut]
)
def list_baselines(
    workflow_id: str,
    db: Session = Depends(get_db)
):
    return (
        db.query(QueryBaseline)
        .filter(
            QueryBaseline.workflow_id
            == workflow_id
        )
        .all()
    )

# GET /runs/{run_id} - Retrieve a previously executed run
@router.get("/{run_id}")
def get_run(
    run_id: str,
    db: Session = Depends(get_db)
):
    run = (
        db.query(Run)
        .filter(Run.id == run_id)
        .first()
    )

    if not run:
        raise HTTPException(
            status_code=404,
            detail="Run not found"
        )

    return run

# GET /runs/ - Gives all the historical runs
@router.get("/")
def list_runs(
    db: Session = Depends(get_db)
):
    runs = (
        db.query(Run)
        .order_by(Run.created_at.desc())
        .all()
    )

    output = []

    for run in runs:

        change = (
            db.query(Change)
            .filter(Change.id == run.change_id)
            .first()
        )

        output.append({
            "id": run.id,
            "verdict": run.verdict,
            "drift_count": run.drift_count,
            "created_at": run.created_at,
            "tag": change.tag if change else "UNKNOWN",
            "description":
                change.description if change else ""
        })

    return output
