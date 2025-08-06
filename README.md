# Fullstack Docs

**Fullstack Docs** is a true full-stack documentation and reporting application designed for real-time collaboration, audit tracking, and scalable deployment.

## Features

### Frontend

- Built with **React**
- Uses `react-use-websocket` for persistent live data flow between client and server
- State is managed via **Jotai**, but primarily driven through backend socket signals
- Integrated with **Firebase Authentication**

  - User tokens are validated on the backend for access control

### Backend

- Written in **Go**
- Uses `ozzo-dbx` for database interaction and SQL statement building
- Automatically initializes all required PostgreSQL tables on startup
- Tracks system actions via an `events` table for full audit trail
- Authenticates users by validating Firebase ID tokens
- Maintains real-time client state via WebSocket broadcasting

### Database

- **PostgreSQL**
- Fully relational schema
- Core tables:

  - `documents`
  - `people`
  - `comments`
  - `reactions` (Not yet added)
  - `events` (audit trail of all document-based events: creation, edit, comment)

### DevOps

- Fully containerized application
- Single `compose.yml` file for complete deployment (frontend, backend, and database)
- Persistent volume setup for PostgreSQL data

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Firebase project set up for authentication
- (Optional) Node.js for local frontend development

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/fullstack-docs.git
   cd fullstack-docs
   ```

2. Create a `.env` file in the backend directory and define:

   ```env
   POSTGRE_DSN=host=db user=postgres password=example dbname=fullstack_docs port=5432 sslmode=disable
   ```

3. Build and start all services:

   ```bash
   docker-compose up --build
   ```

4. Access the application at `http://localhost:5173`

## Architecture Overview

- The **React frontend** sends and receives live data through sockets.
- **State updates** are handled by the Go backend and broadcasted to connected clients.
- All user actions (like document creation, edits, or comments) are logged as **events**.
- The **Go backend** handles Firebase token verification and database transactions.
- **PostgreSQL** acts as the central data store for documents, users, and change logs.
