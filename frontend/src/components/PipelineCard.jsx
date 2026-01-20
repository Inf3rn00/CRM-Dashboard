import React from 'react'
import '../styles/PipelineCard.css'

function PipelineCard({ stageBreakdown }) {
  const totalAmount = stageBreakdown?.reduce((sum, stage) => sum + (stage.total || 0), 0) || 0

  return (
    <div className="card pipeline-card">
      <div className="card-header">
        <h3>💰 Pipeline by Stage</h3>
      </div>
      <div className="card-body">
        {stageBreakdown && stageBreakdown.length > 0 ? (
          <div className="pipeline-stages">
            {stageBreakdown.map((stage) => {
              const percentage = totalAmount > 0 ? (stage.total / totalAmount) * 100 : 0
              return (
                <div key={stage.stage} className="stage-item">
                  <div className="stage-header">
                    <p className="stage-name">{stage.stage}</p>
                    <p className="stage-value">${stage.total?.toLocaleString()}</p>
                  </div>
                  <div className="stage-bar">
                    <div className="stage-bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <p className="stage-count">{stage.count} deal{stage.count !== 1 ? 's' : ''}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="no-data">No pipeline data</p>
        )}
      </div>
    </div>
  )
}

export default PipelineCard
