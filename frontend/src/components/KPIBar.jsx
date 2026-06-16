export default function KPIBar({
  workflowHealth,
  tagRisk
}) {

  const totalRuns =
    Object.values(workflowHealth)
      .reduce(
        (acc,v)=>acc+v.total,
        0
      )

  const safeRuns =
    Object.values(workflowHealth)
      .reduce(
        (acc,v)=>acc+v.safe,
        0
      )

  const regressions =
    Object.values(tagRisk)
      .reduce(
        (acc,v)=>acc+v.regressions,
        0
      )

  const cards = [
    {
      title:"Total Runs",
      value:totalRuns
    },
    {
      title:"Safe Runs",
      value:safeRuns
    },
    {
      title:"Regressions",
      value:regressions
    },
    {
      title:"Deploy Rate",
      value:
        totalRuns
          ? `${Math.round((safeRuns/totalRuns)*100)}%`
          : "0%"
    }
  ]

  return (
    <div
      style={{
        display:"grid",
        gridTemplateColumns:
          "repeat(4,1fr)",
        gap:"16px",
        marginBottom:"24px"
      }}
    >
      {cards.map(card=>(
        <div
          key={card.title}
          style={{
            background:"#12151c",
            border:"1px solid #232833",
            borderRadius:"16px",
            padding:"24px",
            boxShadow:"0 4px 20px rgba(0,0,0,0.25)"
          }}
        >
          <div
            style={{
              color:"#6b7080",
              fontSize:"12px"
            }}
          >
            {card.title}
          </div>

          <div
            style={{
              color:"#c8f060",
              fontSize:"28px",
              fontWeight:"700"
            }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  )
}