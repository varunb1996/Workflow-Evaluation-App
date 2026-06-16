import { useState } from "react"
import axios from "axios"

const API = "http://localhost:8000"

export default function BaselineManager() {

  const [queryText, setQueryText] =
    useState("")

  const [baselineOutput, setBaselineOutput] =
    useState("")

  const [message, setMessage] =
    useState("")

  async function saveBaseline() {

    try {

      await axios.post(
        `${API}/runs/baselines`,
        {
          workflow_id:"wf_001",
          query_text:queryText,
          baseline_output:baselineOutput
        }
      )

      setMessage(
        "Baseline saved"
      )

      setQueryText("")
      setBaselineOutput("")

    } catch (err) {

      setMessage(
        "Save failed"
      )

    }

  }

  return (
    <div
      style={{
        background:"#13161d",
        border:"1px solid #252934",
        borderRadius:"18px",
        padding:"24px",
        marginTop:"24px"
      }}
    >
      <h2>Baseline Manager</h2>

      <input
        value={queryText}
        onChange={e =>
          setQueryText(
            e.target.value
          )
        }
        placeholder="Question"
        style={{
          width:"100%",
          marginBottom:"10px"
        }}
      />

      <textarea
        rows={4}
        value={baselineOutput}
        onChange={e =>
          setBaselineOutput(
            e.target.value
          )
        }
        placeholder="Baseline answer"
        style={{
          width:"100%"
        }}
      />

      <button
        onClick={saveBaseline}
      >
        Save Baseline
      </button>

      <div>{message}</div>
    </div>
  )
}