import { useEffect, useState } from "react"
import axios from "axios"

const API = "http://localhost:8000"

export default function RecentChanges() {

  const [changes, setChanges] =
    useState([])

  useEffect(() => {

    axios
      .get(
        `${API}/changes?workflow_id=wf_001`
      )
      .then(res =>
        setChanges(res.data)
      )
      .catch(console.error)

  }, [])

  return (

    <div style={container}>

      <div style={header}>

        <h2 style={title}>
          Recent Workflow Changes
        </h2>

        <div style={countBadge}>
          {changes.length} changes
        </div>

      </div>

      {changes.map(change => (

        <div
          key={change.id}
          style={card}
        >

          <div style={topRow}>

            <span style={tagBadge}>
              {change.tag}
            </span>

            <span style={idText}>
              {change.id.slice(0,8)}
            </span>

          </div>

          <div style={description}>
            {change.description}
          </div>

          <div style={metaGrid}>

            <div>
              <label>Workflow</label>
              <div>
                {change.workflow_version || "-"}
              </div>
            </div>

            <div>
              <label>Prompt</label>
              <div>
                {change.prompt_version || "-"}
              </div>
            </div>

            <div>
              <label>Model</label>
              <div>
                {change.model_name || "-"}
              </div>
            </div>

            <div>
              <label>Retrieval</label>
              <div>
                {change.retrieval_config || "-"}
              </div>
            </div>

            <div>
              <label>Reranker</label>
              <div>
                {change.reranker_config || "-"}
              </div>
            </div>

            <div>
              <label>Memory</label>
              <div>
                {change.memory_config || "-"}
              </div>
            </div>

          </div>

        </div>

      ))}

    </div>
  )
}

const container = {
  background:"#13161d",
  border:"1px solid #252934",
  borderRadius:"18px",
  padding:"28px"
}

const header = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:"20px"
}

const title = {
  color:"#fff",
  margin:0
}

const countBadge = {
  color:"#9ca3af"
}

const card = {
  background:"#181c25",
  border:"1px solid #252934",
  borderRadius:"12px",
  padding:"18px",
  marginBottom:"16px"
}

const topRow = {
  display:"flex",
  justifyContent:"space-between",
  marginBottom:"12px"
}

const tagBadge = {
  background:"#c8f06020",
  color:"#c8f060",
  padding:"4px 10px",
  borderRadius:"999px",
  fontSize:"12px"
}

const idText = {
  color:"#6b7280",
  fontSize:"12px"
}

const description = {
  color:"#e5e7eb",
  marginBottom:"16px"
}

const metaGrid = {
  display:"grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(180px,1fr))",
  gap:"12px",
  color:"#cbd5e1",
  fontSize:"13px"
}