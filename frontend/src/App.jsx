import { useState } from "react"

import ChangeLogger from "./components/ChangeLogger"
import ComparisonTable from "./components/ComparisonTable"

import AnalyticsDashboard from "./components/AnalyticsDashboard"
import RecentChanges from "./components/RecentChanges"

import PageHeader from "./components/PageHeader"
import DeploymentStatus from "./components/DeploymentStatus"
import RunHistory from "./components/RunHistory"
import DocumentUploader from "./components/DocumentUploader"

export default function App() {
  const [lastRun, setLastRun] = useState(null)

  const regressions =
    lastRun?.drift_count

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px",
        background: "#0b0d12",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "Inter, sans-serif"
      }}
    >
      <PageHeader />

      <DocumentUploader />
      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 350px",
          gap: "20px",
          marginBottom: "24px"
        }}
      >
        <ChangeLogger
          onRunComplete={setLastRun}
        />

        <DeploymentStatus
          regressions={regressions}
        />
      </div>

      <AnalyticsDashboard />

      <RecentChanges />

      <RunHistory />

      {lastRun && (
        <div style={{ marginTop: "30px" }}>
          <ComparisonTable run={lastRun} />
        </div>
      )}
    </div>
  )
}
