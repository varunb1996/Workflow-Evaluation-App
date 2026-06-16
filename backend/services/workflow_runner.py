from services.langgraph_workflow import workflow


def run_workflow(query: str):

    result = workflow.invoke(
        {
            "query": query,
            "context": "",
            "answer": "",
            "sources": []
        }
    )

    return result["answer"]