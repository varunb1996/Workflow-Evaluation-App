export default function DeploymentStatus({
  regressions
}) {

  const hasRun =
    regressions !== undefined &&
    regressions !== null

  const safe =
    hasRun &&
    regressions === 0

  return (
    <div
      style={{
        background:
          !hasRun
            ? "#16181c"
            : safe
              ? "#10261b"
              : "#2b1717",

        border:
          !hasRun
            ? "1px solid #2a2d35"
            : safe
              ? "1px solid #1d8f52"
              : "1px solid #a53a3a",

        borderRadius: "16px",
        padding: "24px",
        minHeight: "180px",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >

      <h3
        style={{
          marginTop: 0,
          color: "#ffffff",
          marginBottom: "20px"
        }}
      >
        Deployment Recommendation
      </h3>

      {!hasRun && (
        <>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#94a3b8"
            }}
          >
            NO EVALUATION
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#6b7280"
            }}
          >
            Run a comparison first
          </div>
        </>
      )}

      {hasRun && safe && (
        <>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#4ade80"
            }}
          >
            SAFE TO DEPLOY
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#86efac"
            }}
          >
            No regressions detected
          </div>
        </>
      )}

      {hasRun && !safe && (
        <>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#ff6b6b"
            }}
          >
            INVESTIGATE
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#fca5a5"
            }}
          >
            {regressions} regression(s) detected
          </div>
        </>
      )}

    </div>
  )
}