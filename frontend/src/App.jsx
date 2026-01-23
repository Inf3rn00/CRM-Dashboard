import { useEffect, useState } from 'react'
import StatCard from './components/StatCard'
import RecentDealsCard from './components/RecentDealsCard'
import TopCustomersCard from './components/TopCustomersCard'
import PipelineCard from './components/PipelineCard'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

useEffect(() => {
    // CRITICAL FIX:
    // We are hardcoding the IP so your Phone knows exactly where to look.
    // Replace '192.168.88.132' with your ACTUAL CentOS IP Address.
    // (If using VPN/Tailscale, use the 100.x.x.x IP).
    
    const CENTOS_IP = '192.168.88.132'; // <--- CHANGE THIS to your server's IP
    const apiUrl = `http://${CENTOS_IP}:5001/api/dashboard`;
    
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to connect to Backend");
        return res.json();
      })
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error:', err)
        setError(err.message + ". Check if Port 5000 is open!")
        setLoading(false)
      })
  }, [])
  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner">
          <p>Loading your CRM dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-message">
          <p>❌ Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📊 CRM Dashboard</h1>
          <p className="header-subtitle">Welcome back! Here's your sales overview.</p>
        </div>
      </header>

      <main className="dashboard-content">
        {/* KPI Cards */}
        <section className="kpi-section">
          <StatCard
            icon="👥"
            title="Total Customers"
            value={data?.customers?.total || 0}
            subtitle={`${data?.customers?.active || 0} active`}
            color="blue"
          />
          <StatCard
            icon="💼"
            title="Total Pipeline"
            value={`$${(data?.deals?.total_amount || 0).toLocaleString()}`}
            subtitle={`${data?.deals?.total || 0} deals`}
            color="green"
          />
          <StatCard
            icon="✅"
            title="Won Deals"
            value={`$${(data?.deals?.won_amount || 0).toLocaleString()}`}
            subtitle={`${data?.deals?.closed_won || 0} closed`}
            color="orange"
          />
          <StatCard
            icon="📋"
            title="Tasks"
            value={data?.tasks?.total || 0}
            subtitle={`${data?.tasks?.open_tasks || 0} open`}
            color="purple"
          />
        </section>

        {/* Charts Section */}
        <section className="charts-section">
          <RecentDealsCard deals={data?.recentDeals} />
          <div className="charts-right">
            <TopCustomersCard customers={data?.topCustomers} />
            <PipelineCard stageBreakdown={data?.stageBreakdown} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
