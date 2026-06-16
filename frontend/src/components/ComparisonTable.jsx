const driftColor = {
  none: "#6b7080",
  improvement: "#c8f060",
  regression: "#ff5e5e"
}

const verdictStyle = {
  safe: {
    color: "#c8f060",
    label: "✓ Safe to deploy"
  },
  investigate: {
    color: "#f5c842",
    label: "⚠ Investigate before deploying"
  },
  hold: {
    color: "#ff5e5e",
    label: "✗ Hold — regression detected"
  }
}

export default function ComparisonTable({ run }) {

  const v =
    verdictStyle[run.verdict]
    || verdictStyle.investigate

  return (
    <div
      style={{
        background: "#16181c",
        border: "1px solid #2a2d35",
        borderRadius: "8px",
        overflow: "hidden"
      }}
    >

      {/* Header */}

      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid #2a2d35",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#1a1d22"
        }}
      >

        <div
          style={{
            fontSize: "13px"
          }}
        >
          Comparison Run — {run.drift_count} regression(s) found
        </div>

        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: v.color,
            padding: "4px 12px",
            border: `1px solid ${v.color}`,
            borderRadius: "20px"
          }}
        >
          {v.label}
        </div>

      </div>

      {/* Query Results */}

      {run.results.map((r, i) => (

        <div
          key={r.query_id}
          style={{
            borderBottom:
              i < run.results.length - 1
                ? "1px solid #2a2d35"
                : "none"
          }}
        >

          {/* Query Header */}

          <div
            style={{
              padding: "10px 16px",
              background: "#13151a",
              fontSize: "12px",
              color: "#6b7080",
              fontStyle: "italic",
              display: "flex",
              justifyContent: "space-between"
            }}
          >

            <span>
              {r.query_text}
            </span>

            <span
              style={{
                color: driftColor[r.drift],
                fontStyle: "normal",
                fontWeight: "600",
                textTransform: "uppercase",
                fontSize: "10px",
                letterSpacing: "0.1em"
              }}
            >
              {r.drift}
            </span>

          </div>

          {/* Before / After */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr"
            }}
          >

            {/* Before */}

            <div
              style={{
                padding: "12px 16px",
                borderRight: "1px solid #2a2d35",
                fontSize: "12px",
                color: "#9ca0ae",
                lineHeight: "1.6"
              }}
            >

              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6b7080",
                  marginBottom: "6px"
                }}
              >
                Before
              </div>

              {r.before}

            </div>

            {/* After */}

            <div
              style={{
                padding: "12px 16px",
                fontSize: "12px",
                lineHeight: "1.6",
                color:
                  r.drift === "regression"
                    ? "#ff5e5e"
                    : "#e8eaf0",

                background:
                  r.drift === "regression"
                    ? "rgba(255,94,94,0.04)"
                    : r.drift === "improvement"
                      ? "rgba(200,240,96,0.04)"
                      : "transparent"
              }}
            >

              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: driftColor[r.drift],
                  marginBottom: "6px"
                }}
              >
                After
              </div>

              {r.after}

            </div>

          </div>

          {/* Analysis */}

          <div
            style={{
              padding: "10px 16px",
              borderTop: "1px solid #2a2d35",
              background: "#14171c"
            }}
          >

            <div
              style={{
                fontSize: "11px",
                color:
                  r.drift === "regression"
                    ? "#ff5e5e"
                    : r.drift === "improvement"
                      ? "#c8f060"
                      : "#9ca0ae",
                marginBottom: "8px"
              }}
            >
              {r.note}
            </div>

            <div
              style={{
                display: "flex",
                gap: "24px",
                fontSize: "11px",
                color: "#9ca0ae"
              }}
            >

              <div>
                Confidence:{" "}
                <strong>
                  {r.confidence
                    ? r.confidence.toFixed(2)
                    : "N/A"}
                </strong>
              </div>

              <div>
                Similarity:{" "}
                <strong>
                  {r.similarity_score
                    ? r.similarity_score.toFixed(2)
                    : "N/A"}
                </strong>
              </div>

            </div>

          </div>

        </div>

      ))}

    </div>
  )
}