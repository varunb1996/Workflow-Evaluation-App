import { useEffect, useState } from "react"
import axios from "axios"

const API = "http://localhost:8000"

export default function RunHistory() {

  const [runs, setRuns] = useState([])

  useEffect(() => {

    axios
      .get(`${API}/runs`)
      .then(res => setRuns(res.data))
      .catch(console.error)

  }, [])

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
      <h2
        style={{
          color:"#fff",
          marginBottom:"20px"
        }}
      >
        Evaluation History
      </h2>

      {
        runs.map(run => (

          <div
            key={run.id}
            style={{
              padding:"16px",
              borderBottom:"1px solid #2a2d35"
            }}
          >
            <div
              style={{
                color:"#c8f060",
                fontWeight:"600"
              }}
            >
              {run.tag}
            </div>

            <div
              style={{
                color:"#e8eaf0",
                marginTop:"4px"
              }}
            >
              {run.description}
            </div>

            <div
              style={{
                color:"#9ca0ae",
                marginTop:"6px",
                fontSize:"12px"
              }}
            >
              Verdict: {run.verdict}
              {" | "}
              Regressions: {run.drift_count}
            </div>
          </div>

        ))
      }

    </div>
  )
}