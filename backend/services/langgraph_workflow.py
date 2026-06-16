import os
from dotenv import load_dotenv

load_dotenv()

from typing import TypedDict, List

from langgraph.graph import StateGraph

from langchain_groq import ChatGroq

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import (
    HuggingFaceInferenceAPIEmbeddings
)

# CONFIG
TOP_K = int(
    os.getenv("TOP_K", 4)
)

# LOAD EMBEDDINGS
embeddings = HuggingFaceInferenceAPIEmbeddings(
    api_key=os.getenv("HF_API_KEY"),
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# LOAD VECTOR STORE
vector_db = FAISS.load_local(
    "vectorstore",
    embeddings,
    allow_dangerous_deserialization=True
)

retriever = vector_db.as_retriever(
    search_kwargs={
        "k": TOP_K
    }
)

# LLM
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY")
)

# STATE
class AgentState(TypedDict):
    query: str
    context: str
    answer: str
    sources: List[str]

# RETRIEVAL NODE
def retrieve_node(state):

    docs = retriever.invoke(
        state["query"]
    )

    # No documents found
    if not docs:
        return {
            **state,
            "context": "",
            "sources": []
        }

    context = "\n\n".join(
        d.page_content
        for d in docs
    )

    sources = []

    for d in docs:

        source = d.metadata.get(
            "source",
            "unknown"
        )

        sources.append(source)

    return {
        **state,
        "context": context,
        "sources": list(set(sources))
    }

# ANSWER NODE
def answer_node(state):

    # Skip LLM call if retrieval returned nothing

    if not state["context"]:

        return {
            **state,
            "answer":
            "I could not find that information in the uploaded documents."
        }

    prompt = f"""
You are an AI assistant.

Use ONLY the provided context.

If the answer cannot be found in the context,
respond exactly with:

I could not find that information in the uploaded documents.

Context:
{state["context"]}

Question:
{state["query"]}
"""

    response = llm.invoke(prompt)

    return {
        **state,
        "answer": response.content
    }

# BUILD GRAPH
graph = StateGraph(AgentState)

graph.add_node(
    "retrieve",
    retrieve_node
)

graph.add_node(
    "answer",
    answer_node
)

graph.set_entry_point(
    "retrieve"
)

graph.add_edge(
    "retrieve",
    "answer"
)

graph.set_finish_point(
    "answer"
)

workflow = graph.compile()
