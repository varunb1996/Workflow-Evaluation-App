import os

from langchain_community.document_loaders import (
    PyPDFLoader
)

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from langchain_community.vectorstores import (
    FAISS
)

from langchain_community.embeddings import (
    HuggingFaceEmbeddings
)


def build_vectorstore():

    DOCUMENTS_FOLDER = "documents"

    all_docs = []

    print("Loading PDFs...")

    for filename in os.listdir(
        DOCUMENTS_FOLDER
    ):

        if filename.endswith(".pdf"):

            pdf_path = os.path.join(
                DOCUMENTS_FOLDER,
                filename
            )

            print(
                f"Loading {filename}"
            )

            loader = PyPDFLoader(
                pdf_path
            )

            docs = loader.load()

            all_docs.extend(docs)

    print(
        f"Loaded {len(all_docs)} pages."
    )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(
        all_docs
    )

    print(
        f"Created {len(chunks)} chunks."
    )

    embeddings = HuggingFaceEmbeddings(
        model_name=
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    print(
        "Embedding model loaded."
    )

    db = FAISS.from_documents(
        chunks,
        embeddings
    )

    db.save_local(
        "vectorstore"
    )

    print(
        "Vector DB created successfully."
    )


if __name__ == "__main__":
    build_vectorstore()