from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import (
    get_db,
    Change
)

from models import (
    ChangeCreate,
    ChangeOut
)

from typing import List

router = APIRouter(
    prefix="/changes",
    tags=["changes"]
)

# LOG CHANGE
@router.post("/")
def log_change(
    payload: ChangeCreate,
    db: Session = Depends(get_db)
):

    change = Change(
        description=payload.description,
        tag=payload.tag,

        workflow_id=payload.workflow_id,

        workflow_version=payload.workflow_version,
        prompt_version=payload.prompt_version,

        model_name=payload.model_name,

        retrieval_config=payload.retrieval_config,
        reranker_config=payload.reranker_config,
        memory_config=payload.memory_config
    )

    db.add(change)

    db.commit()

    db.refresh(change)

    return {
        "change_id": change.id,
        "message": "Configuration saved successfully."
    }

# LIST CHANGES
@router.get(
    "/",
    response_model=List[ChangeOut]
)
def list_changes(
    workflow_id: str,
    db: Session = Depends(get_db)
):

    return (
        db.query(Change)
        .filter(
            Change.workflow_id == workflow_id
        )
        .order_by(
            Change.created_at.desc()
        )
        .all()
    )