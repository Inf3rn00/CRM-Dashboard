import React from 'react'
import '../styles/TopCustomersCard.css'

function TopCustomersCard({ customers }) {
  return (
    <div className="card top-customers-card">
      <div className="card-header">
        <h3>👥 Top Customers</h3>
      </div>
      <div className="card-body">
        {customers && customers.length > 0 ? (
          <div className="customers-list">
            {customers.map((customer, index) => (
              <div key={customer.id} className="customer-item">
                <div className="customer-rank">{index + 1}</div>
                <div className="customer-info">
                  <p className="customer-name">{customer.name}</p>
                  <p className="customer-company">{customer.company}</p>
                </div>
                <div className="customer-stats">
                  <p className="stat-deals">{customer.deal_count || 0} deals</p>
                  <p className="stat-value">
                    ${customer.total_deal_value ? customer.total_deal_value.toLocaleString() : 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No customers yet</p>
        )}
      </div>
    </div>
  )
}

export default TopCustomersCard
