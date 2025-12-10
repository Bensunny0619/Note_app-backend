# Note App Backend

A RESTful API backend for a note-taking application similar to Google Keep, built with Node.js, Express, and PostgreSQL.

## Project Structure

```
/src
    /db             # Knex configuration and migrations
    /routes         # Defines API endpoints
    /controllers    # Handles incoming requests and calls services
    /services       # Contains the core business logic (DB calls)
    /middleware     # Custom middleware (e.g., JWT verification)
/index.js           # Entry point
```

## Features

- User authentication (signup, login) with JWT
- Create, read, update, delete notes
- Pin and archive notes
- Color-coded notes
- Secure password hashing with bcrypt
- PostgreSQL database with Knex.js ORM

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials and JWT secret.

4. Create the database:
```bash
createdb noteapp_dev
```

5. Run migrations:
```bash
npx knex migrate:latest --knexfile src/db/knexfile.js
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login and receive JWT token
- `POST /api/auth/logout` - Logout (client-side token removal)

### Notes (Protected - requires JWT)
- `GET /api/notes` - Get all notes for authenticated user
- `GET /api/notes/:id` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `PATCH /api/notes/:id/archive` - Toggle archive status
- `PATCH /api/notes/:id/pin` - Toggle pin status

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Users Table
- id (primary key)
- email (unique)
- password (hashed)
- name
- created_at
- updated_at

### Notes Table
- id (primary key)
- user_id (foreign key)
- title
- content
- color
- is_archived
- is_pinned
- created_at
- updated_at

## License

MIT
