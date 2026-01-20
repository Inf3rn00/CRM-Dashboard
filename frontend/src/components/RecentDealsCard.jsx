import React from 'react'
import '../styles/RecentDealsCard.css'

function RecentDealsCard({ deals }) {
  const getStageColor = (stage) => {
    switch (stage) {
      case 'Closed Won':
        return 'success'
      case 'Closed Lost':
        return 'danger'
      case 'Negotiation':
        return 'warning'
      default:
        return 'info'
    }
  }

  return (
    <div className="card recent-deals-card">
      <div className="card-header">
        <h3>📊 Recent Deals</h3>
      </div>
      <div className="card-body">
        {deals && deals.length > 0 ? (
          <div className="deals-list">
            {deals.map((deal) => (
              <div key={deal.id} className="deal-item">
                <div className="deal-info">
                  <p className="deal-title">{deal.title}</p>
                  <p className="deal-customer">{deal.customer_name}</p>
                </div>
                <div className="deal-amount">${deal.amount?.toLocaleString()}</div>
                <span className={`badge badge-${getStageColor(deal.stage)}`}>
                  {deal.stage}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No deals yet</p>
        )}
      </div>
    </div>
  )
}

export default RecentDealsCard
