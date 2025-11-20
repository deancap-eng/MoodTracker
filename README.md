# Mood Tracker

An employee mood tracking application with an iOS-inspired interface.

## Features

- 7-stage mood selector ranging from "I think this is going to fall apart" to "We're going to change the world"
- User authentication with username/password
- Dashboard showing last 7 days of team mood data
- Custom date range filtering
- Employee-specific views
- Average mood visualization
- Clean iOS-style UI

## Setup

1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

3. Update the `JWT_SECRET` in `.env` with a secure random string

4. Run the application:
   ```bash
   npm run dev
   ```

5. Access the app at `http://localhost:5173`

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite
- Authentication: JWT
