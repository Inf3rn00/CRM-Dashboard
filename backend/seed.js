const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dashboard_db',
});

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // --- CHANGE STARTS HERE ---
    // Instead of checking if data exists, we WIPE IT out.
    console.log('🗑️ Clearing old data...');
    // TRUNCATE wipes the tables clean so we can add fresh numbers
    await pool.query('TRUNCATE TABLE deals, tasks, customers RESTART IDENTITY CASCADE');
    // --- CHANGE ENDS HERE ---

    console.log('📝 Seeding customers...');
    await pool.query(`
      INSERT INTO customers (name, email, company, status) VALUES
      ('John Smith', 'john@techcorp.com', 'Tech Corp', 'Active'),
      ('Sarah Johnson', 'sarah@innovate.com', 'Innovate Labs', 'Active'),
      ('Michael Chen', 'michael@growth.io', 'Growth Inc', 'Active'),
      ('Emma Davis', 'emma@startupx.com', 'StartupX', 'Prospect'),
      ('David Wilson', 'david@enterprise.com', 'Enterprise Co', 'Active'),
      ('Lisa Anderson', 'lisa@creative.net', 'Creative Studios', 'Prospect')
    `);

    console.log('📝 Seeding deals...');
    // UPDATE YOUR NUMBERS HERE! 👇
    await pool.query(`
      INSERT INTO deals (title, amount, stage, customer_id) VALUES
      ('Enterprise License', 95000, 'Closed Won', 1),     <-- Changed to 95,000
      ('Implementation Services', 25000, 'Negotiation', 2),
      ('Annual Subscription', 15000, 'Proposal', 3),
      ('Consulting Package', 35000, 'Qualification', 4),
      ('Platform Setup', 20000, 'Closed Won', 5),
      ('Support Plan', 8000, 'Closed Won', 6),
      ('Custom Integration', 45000, 'Proposal', 1),
      ('Training Package', 12000, 'Negotiation', 2)
    `);

    console.log('📝 Seeding tasks...');
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

    console.log('✅ Database seeded successfully!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

seedDatabase();