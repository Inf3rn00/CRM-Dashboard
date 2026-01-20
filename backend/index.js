const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dashboard_db',
});

// Test database connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Initialize database with sample data
async function initializeDatabase() {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS deals (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2),
        stage VARCHAR(100),
        customer_id INT REFERENCES customers(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(50),
        priority VARCHAR(50),
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if data already exists
    const result = await pool.query('SELECT COUNT(*) FROM customers');
    if (result.rows[0].count === 0) {
      // Seed customers
      await pool.query(`
        INSERT INTO customers (name, email, company, status) VALUES
        ('John Smith', 'john@techcorp.com', 'Tech Corp', 'Active'),
        ('Sarah Johnson', 'sarah@innovate.com', 'Innovate Labs', 'Active'),
        ('Michael Chen', 'michael@growth.io', 'Growth Inc', 'Active'),
        ('Emma Davis', 'emma@startupx.com', 'StartupX', 'Prospect'),
        ('David Wilson', 'david@enterprise.com', 'Enterprise Co', 'Active'),
        ('Lisa Anderson', 'lisa@creative.net', 'Creative Studios', 'Prospect')
      `);

      // Seed deals
      await pool.query(`
        INSERT INTO deals (title, amount, stage, customer_id) VALUES
        ('Enterprise License', 50000, 'Closed Won', 1),
        ('Implementation Services', 25000, 'Negotiation', 2),
        ('Annual Subscription', 15000, 'Proposal', 3),
        ('Consulting Package', 35000, 'Qualification', 4),
        ('Platform Setup', 20000, 'Closed Won', 5),
        ('Support Plan', 8000, 'Closed Won', 6),
        ('Custom Integration', 45000, 'Proposal', 1),
        ('Training Package', 12000, 'Negotiation', 2)
      `);

      // Seed tasks
      await pool.query(`
        INSERT INTO tasks (title, status, priority, due_date) VALUES
        ('Follow up with Tech Corp', 'Open', 'High', '2026-01-25'),
        ('Prepare demo for Innovate Labs', 'Open', 'High', '2026-01-22'),
        ('Send contract to Growth Inc', 'In Progress', 'Medium', '2026-01-23'),
        ('Schedule meeting with Enterprise Co', 'Open', 'Medium', '2026-01-26'),
        ('Update proposal for StartupX', 'In Progress', 'High', '2026-01-21'),
        ('Review requirements - Enterprise', 'Completed', 'Low', '2026-01-20'),
        ('Send invoice to Tech Corp', 'Completed', 'Medium', '2026-01-19'),
        ('Call John Smith', 'Open', 'High', '2026-01-21')
      `);

      console.log('Database initialized with sample data');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Initialize on startup
initializeDatabase();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const customersResult = await pool.query(`
      SELECT COUNT(*) as total, 
             SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
             SUM(CASE WHEN status = 'Prospect' THEN 1 ELSE 0 END) as prospects
      FROM customers
    `);

    const dealsResult = await pool.query(`
      SELECT COUNT(*) as total,
             SUM(amount) as total_amount,
             COUNT(CASE WHEN stage = 'Closed Won' THEN 1 END) as closed_won,
             SUM(CASE WHEN stage = 'Closed Won' THEN amount ELSE 0 END) as won_amount
      FROM deals
    `);

    const tasksResult = await pool.query(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open_tasks,
             SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
             SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
      FROM tasks
    `);

    const recentDealsResult = await pool.query(`
      SELECT d.id, d.title, d.amount, d.stage, c.name as customer_name
      FROM deals d
      JOIN customers c ON d.customer_id = c.id
      ORDER BY d.created_at DESC
      LIMIT 5
    `);

    const topCustomersResult = await pool.query(`
      SELECT c.id, c.name, c.company, COUNT(d.id) as deal_count,
             SUM(d.amount) as total_deal_value
      FROM customers c
      LEFT JOIN deals d ON c.id = d.customer_id
      GROUP BY c.id, c.name, c.company
      ORDER BY total_deal_value DESC NULLS LAST
      LIMIT 5
    `);

    const stageBreakdownResult = await pool.query(`
      SELECT stage, COUNT(*) as count, SUM(amount) as total
      FROM deals
      GROUP BY stage
      ORDER BY total DESC NULLS LAST
    `);

    res.json({
      customers: customersResult.rows[0],
      deals: dealsResult.rows[0],
      tasks: tasksResult.rows[0],
      recentDeals: recentDealsResult.rows,
      topCustomers: topCustomersResult.rows,
      stageBreakdown: stageBreakdownResult.rows,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
