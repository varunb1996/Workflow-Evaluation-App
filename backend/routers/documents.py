from fastapi import (
    APIRouter,
    UploadFile,
    File
)

import shutil
import os

from services.build_vectorstore import (
    build_vectorstore
)

router = APIRouter(
    prefix="/documents",
    tags=["documents"]
)


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):

    os.makedirs(
        "documents",
        exist_ok=True
    )

    save_path = (
        f"documents/{file.filename}"
    )

    with open(
        save_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    build_vectorstore()

    return {
        "message":
        "uploaded and indexed",
        "file":
        file.filename
    }


@router.get("/current")
def current_documents():

    os.makedirs(
        "documents",
        exist_ok=True
    )

    files = []

    for file in os.listdir(
        "documents"
    ):

        if file.endswith(".pdf"):
            files.append(file)

    return {
        "documents": files
    }