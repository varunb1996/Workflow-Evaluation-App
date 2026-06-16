export default function PageHeader() {
  return (
    <div
      style={{
        marginBottom: "40px"
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "42px",
          fontWeight: "700",
          color: "#ffffff"
        }}
      >
        Workflow Evaluation Platform
      </h1>

      <p
        style={{
          marginTop: "10px",
          color: "#8e8ea0",
          fontSize: "16px"
        }}
      >
        Monitor regressions before deployment
      </p>
    </div>
  )
}