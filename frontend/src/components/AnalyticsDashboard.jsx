import { useEffect, useState } from "react"
import axios from "axios"
import KPIBar from "./KPIBar"

const API = "http://localhost:8000"

export default function AnalyticsDashboard() {

  const [tagRisk, setTagRisk] = useState({})
  const [workflowHealth, setWorkflowHealth] = useState({})
  const [queryFailures, setQueryFailures] = useState({})

  useEffect(() => {
    loadAnalytics()
  }, [])

  async function loadAnalytics() {

    try {

      const [
        tagRes,
        workflowRes,
        queryRes
      ] = await Promise.all([
        axios.get(`${API}/analytics/tag-risk`),
        axios.get(`${API}/analytics/workflow-health`),
        axios.get(`${API}/analytics/query-failures`)
      ])

      setTagRisk(tagRes.data)
      setWorkflowHealth(workflowRes.data)
      setQueryFailures(queryRes.data)

    } catch (err) {

      console.error(
        "Analytics loading failed:",
        err
      )

    }
  }

  return (
    <div
      style={{
        marginBottom: "32px"
      }}
    >

      {/* ========================================= */}
      {/* KPI BAR */}
      {/* ========================================= */}

      <KPIBar
        workflowHealth={workflowHealth}
        tagRisk={tagRisk}
      />

      {/* ========================================= */}
      {/* ANALYTICS GRID */}
      {/* ========================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: "20px"
        }}
      >

        {/* ===================================== */}
        {/* TAG RISK */}
        {/* ===================================== */}

        <div style={card}>

          <h3 style={title}>
            Tag Risk
          </h3>

          {
            Object.entries(tagRisk).length === 0
              ? (
                <div style={emptyState}>
                  No analytics yet
                </div>
              )
              : (
                Object.entries(tagRisk).map(
                  ([tag, data]) => (

                    <div
                      key={tag}
                      style={row}
                    >
                      <span>
                        {tag}
                      </span>

                      <span
                        style={{
                          color:
                            data.regressions > 0
                              ? "#ff5e5e"
                              : "#c8f060",
                          fontWeight: "600"
                        }}
                      >
                        {data.regressions}/{data.total}
                      </span>

                    </div>
                  )
                )
              )
          }

        </div>

        {/* ===================================== */}
        {/* WORKFLOW HEALTH */}
        {/* ===================================== */}

        <div style={card}>

          <h3 style={title}>
            Workflow Health
          </h3>

          {
            Object.entries(workflowHealth).length === 0
              ? (
                <div style={emptyState}>
                  No workflow runs yet
                </div>
              )
              : (
                Object.entries(workflowHealth).map(
                  ([workflow, data]) => (

                    <div
                      key={workflow}
                      style={row}
                    >

                      <span>
                        {workflow}
                      </span>

                      <span
                        style={{
                          color: "#c8f060",
                          fontWeight: "600"
                        }}
                      >
                        {data.safe}/{data.total} safe
                      </span>

                    </div>

                  )
                )
              )
          }

        </div>

        {/* ===================================== */}
        {/* TOP FAILING QUERIES */}
        {/* ===================================== */}

        <div style={card}>

          <h3 style={title}>
            Top Failing Queries
          </h3>

          {
            Object.entries(queryFailures).length === 0
              ? (
                <div style={emptyState}>
                  No regressions detected
                </div>
              )
              : (
                Object.entries(queryFailures).map(
                  ([query, count]) => (

                    <div
                      key={query}
                      style={row}
                    >

                      <span
                        style={{
                          maxWidth: "85%"
                        }}
                      >
                        {query}
                      </span>

                      <span
                        style={{
                          color: "#ff5e5e",
                          fontWeight: "600"
                        }}
                      >
                        {count}
                      </span>

                    </div>

                  )
                )
              )
          }

        </div>

      </div>

    </div>
  )
}

/* ========================================= */
/* STYLES */
/* ========================================= */

const card = {
  background: "#12151c",
  border: "1px solid #232833",
  borderRadius: "16px",
  padding: "24px",
  minHeight: "260px",
  boxShadow:
    "0 4px 20px rgba(0,0,0,0,0.25)"
}

const title = {
  color: "#c8f060",
  marginBottom: "20px",
  fontSize: "18px",
  fontWeight: "700",
  textAlign: "center"
}

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #2a2d35",
  fontSize: "13px"
}

const emptyState = {
  color: "#6b7080",
  fontSize: "13px"
}
