# Note App API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require a JWT token. Include it in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### 🔐 Authentication

#### 1. Signup
Create a new user account.

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (409):**
```json
{
  "error": "User with this email already exists"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

#### 2. Login
Authenticate and receive a JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

#### 3. Logout
Logout endpoint (client-side token removal).

**Endpoint:** `POST /api/auth/logout`

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### 📝 Notes (Protected Routes)

All note endpoints require authentication. Include the JWT token in the Authorization header.

#### 1. Get All Notes
Retrieve all notes for the authenticated user.

**Endpoint:** `GET /api/notes`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "notes": [
    {
      "id": 1,
      "user_id": 1,
      "title": "My First Note",
      "content": "This is the content",
      "color": "#ffffff",
      "is_archived": false,
      "is_pinned": false,
      "created_at": "2024-12-08T12:00:00.000Z",
      "updated_at": "2024-12-08T12:00:00.000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

#### 2. Get Single Note
Retrieve a specific note by ID.

**Endpoint:** `GET /api/notes/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "note": {
    "id": 1,
    "user_id": 1,
    "title": "My First Note",
    "content": "This is the content",
    "color": "#ffffff",
    "is_archived": false,
    "is_pinned": false,
    "created_at": "2024-12-08T12:00:00.000Z",
    "updated_at": "2024-12-08T12:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": {
    "message": "Note not found",
    "status": 404
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

#### 3. Create Note
Create a new note.

**Endpoint:** `POST /api/notes`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Note Title",
  "content": "Note content goes here",
  "color": "#ffeb3b"
}
```

**Note:** All fields are optional. Default color is `#ffffff`.

**Success Response (201):**
```json
{
  "message": "Note created successfully",
  "note": {
    "id": 2,
    "user_id": 1,
    "title": "My Note Title",
    "content": "Note content goes here",
    "color": "#ffeb3b",
    "is_archived": false,
    "is_pinned": false,
    "created_at": "2024-12-08T12:30:00.000Z",
    "updated_at": "2024-12-08T12:30:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Shopping List","content":"Milk, Eggs, Bread","color":"#ffeb3b"}'
```

---

#### 4. Update Note
Update an existing note.

**Endpoint:** `PUT /api/notes/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "color": "#4caf50"
}
```

**Note:** You can update any combination of fields.

**Success Response (200):**
```json
{
  "message": "Note updated successfully",
  "note": {
    "id": 1,
    "user_id": 1,
    "title": "Updated Title",
    "content": "Updated content",
    "color": "#4caf50",
    "is_archived": false,
    "is_pinned": false,
    "created_at": "2024-12-08T12:00:00.000Z",
    "updated_at": "2024-12-08T13:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","content":"New content"}'
```

---

#### 5. Delete Note
Delete a note permanently.

**Endpoint:** `DELETE /api/notes/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Note deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/api/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

#### 6. Toggle Archive
Archive or unarchive a note.

**Endpoint:** `PATCH /api/notes/:id/archive`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Note archive status updated",
  "note": {
    "id": 1,
    "is_archived": true,
    ...
  }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:3000/api/notes/1/archive \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

#### 7. Toggle Pin
Pin or unpin a note.

**Endpoint:** `PATCH /api/notes/:id/pin`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Note pin status updated",
  "note": {
    "id": 1,
    "is_pinned": true,
    ...
  }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:3000/api/notes/1/pin \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 🏥 Health Check

#### Health Status
Check if the server is running.

**Endpoint:** `GET /health`

**Success Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

**cURL Example:**
```bash
curl http://localhost:3000/health
```

---

## Error Responses

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

### Error Response Format
```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

Or simplified:
```json
{
  "error": "Error message"
}
```

---

## Complete Workflow Example

### 1. Create a User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secure123"}'
```

**Save the token from the response!**

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secure123"}'
```

### 3. Create a Note
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Meeting Notes","content":"Discuss project timeline"}'
```

### 4. Get All Notes
```bash
curl -X GET http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Update a Note
```bash
curl -X PUT http://localhost:3000/api/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated: Discuss project timeline and budget"}'
```

### 6. Pin the Note
```bash
curl -X PATCH http://localhost:3000/api/notes/1/pin \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing with Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Base URL**: Use `http://localhost:3000`
3. **Add Token**: After login, copy the token and add it to Authorization → Bearer Token
4. **Test Endpoints**: Try each endpoint with the examples above

---

## Database Schema

### Users Table
```sql
id            INTEGER PRIMARY KEY
email         VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
created_at    TIMESTAMP
updated_at    TIMESTAMP
```

### Notes Table
```sql
id          INTEGER PRIMARY KEY
user_id     INTEGER FOREIGN KEY → users(id)
title       VARCHAR(255)
content     TEXT
color       VARCHAR(50) DEFAULT '#ffffff'
is_archived BOOLEAN DEFAULT false
is_pinned   BOOLEAN DEFAULT false
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

---

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- All note endpoints require authentication
- Users can only access their own notes
- Foreign key constraints ensure data integrity
