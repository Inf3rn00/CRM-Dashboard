# Dashboard App

Full-stack dashboard application with React+Vite frontend, Node.js backend API, and PostgreSQL database.

## Project Structure

```
dashboard-app/
├── docker-compose.yml          # Docker Compose configuration
├── backend/                    # Node.js API server
│   ├── Dockerfile
│   ├── index.js               # Express server entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
└── frontend/                  # React+Vite application
    ├── Dockerfile
    ├── vite.config.js
    ├── package.json
    ├── index.html
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   └── index.css
    └── .gitignore
```

## Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

### Using Docker Compose (Recommended)

1. Clone the repository and navigate to the project directory:
```bash
cd dashboard-app
```

2. Start all services:
```bash
docker-compose up
```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - PostgreSQL: localhost:5432

### Local Development

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dashboard_db
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/data` - Get sample data from database

## Technologies Used

- **Frontend**: React 18, Vite, CSS3
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Development Notes

- Frontend runs on port 5173
- Backend API runs on port 5000
- PostgreSQL runs on port 5432
- The frontend connects to the backend at http://localhost:5000
