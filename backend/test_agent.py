from services.workflow_runner import run_workflow

question = "What is this document about?"

answer = run_workflow(question)

print("\n")
print(answer)
print("\n")
print(run_workflow("What problem does the document solve?"))
print("\n")
print(run_workflow("What are the risks discussed?"))
print("\n")
print(run_workflow("What is the proposed solution?"))
print("\n")