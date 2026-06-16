export default function DashboardCard({
  title,
  children
}) {
  return (
    <div
      style={{
        background:"#16181c",
        border:"1px solid #2a2d35",
        borderRadius:"12px",
        padding:"20px"
      }}
    >
      <h3
        style={{
          color:"#c8f060",
          marginBottom:"18px"
        }}
      >
        {title}
      </h3>

      {children}
    </div>
  )
}