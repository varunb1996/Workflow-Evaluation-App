import { useState } from "react"
import axios from "axios"

const API = "http://localhost:8000"

export default function ChangeLogger({ onRunComplete }) {

  const [description, setDescription] = useState("")
  const [tag, setTag] = useState("PROMPT")

  const [workflowVersion, setWorkflowVersion] =
    useState("v1.0")

  const [promptVersion, setPromptVersion] =
    useState("prompt_v1")

  const [modelName, setModelName] =
    useState("llama-3.1-8b-instant")

  const [retrievalConfig, setRetrievalConfig] =
    useState("top_k=5")

  const [rerankerConfig, setRerankerConfig] =
    useState("disabled")

  const [memoryConfig, setMemoryConfig] =
    useState("window=5")

  const [workflowId] =
    useState("wf_001")

  const [loading, setLoading] =
    useState(false)

  const [message, setMessage] =
    useState("")

  async function handleRunEvaluation() {

    if (!description.trim()) {
      return
    }

    setLoading(true)
    setMessage("")

    try {

      const changeRes =
        await axios.post(
          `${API}/changes/`,
          {
            description,
            tag,

            workflow_id: workflowId,

            workflow_version: workflowVersion,
            prompt_version: promptVersion,

            model_name: modelName,

            retrieval_config: retrievalConfig,
            reranker_config: rerankerConfig,
            memory_config: memoryConfig
          }
        )

      const changeId =
        changeRes.data.change_id

      const runRes =
        await axios.post(
          `${API}/runs/`,
          {
            change_id: changeId
          }
        )

      onRunComplete(
        runRes.data
      )

      setMessage(
        "Evaluation completed successfully."
      )

      setDescription("")

    } catch (e) {

      console.error(e)

      if (e.response?.data) {

        setMessage(
          JSON.stringify(
            e.response.data
          )
        )

      } else {

        setMessage(
          e.message
        )

      }

    }

    setLoading(false)
  }

  return (
    <div
      style={{
        background:"#16181c",
        border:"1px solid #2a2d35",
        borderRadius:"16px",
        padding:"24px"
      }}
    >

      <div
        style={{
          color:"#c8f060",
          fontSize:"12px",
          letterSpacing:"0.15em",
          marginBottom:"16px"
        }}
      >
        WORKFLOW CONFIGURATION
      </div>

      <div
        style={{
          display:"flex",
          flexDirection:"column",
          gap:"12px"
        }}
      >

        <select
          value={tag}
          onChange={(e)=>
            setTag(e.target.value)
          }
          style={inputStyle}
        >
          <option>PROMPT</option>
          <option>RETRIEVAL</option>
          <option>RERANKER</option>
          <option>MEMORY</option>
          <option>MODEL</option>
        </select>

        <input
          placeholder="Workflow Version"
          value={workflowVersion}
          onChange={(e)=>
            setWorkflowVersion(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Prompt Version"
          value={promptVersion}
          onChange={(e)=>
            setPromptVersion(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Model Name"
          value={modelName}
          onChange={(e)=>
            setModelName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Retrieval Config"
          value={retrievalConfig}
          onChange={(e)=>
            setRetrievalConfig(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Reranker Config"
          value={rerankerConfig}
          onChange={(e)=>
            setRerankerConfig(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          placeholder="Memory Config"
          value={memoryConfig}
          onChange={(e)=>
            setMemoryConfig(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <textarea
          rows={4}
          placeholder="Describe the workflow change..."
          value={description}
          onChange={(e)=>
            setDescription(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <button
          onClick={
            handleRunEvaluation
          }
          disabled={loading}
          style={buttonStyle}
        >
          {
            loading
              ? "Running Evaluation..."
              : "Save Configuration & Run Evaluation"
          }
        </button>

      </div>

      {message && (

        <div
          style={{
            color:"#f5c842",
            marginTop:"16px",
            fontSize:"12px"
          }}
        >
          {message}
        </div>

      )}

    </div>
  )
}

const inputStyle = {
  background:"#1a1d22",
  border:"1px solid #2a2d35",
  color:"#e8eaf0",
  padding:"10px",
  borderRadius:"6px",
  fontSize:"13px",
  width:"100%"
}

const buttonStyle = {
  background:"#c8f060",
  color:"#0b0d12",
  border:"none",
  padding:"10px 16px",
  borderRadius:"8px",
  fontWeight:"600",
  cursor:"pointer",
  width:"fit-content"
}