# Note App Backend - API Quick Reference

## Base URL
```
http://localhost:3000
```

## Authentication Header
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication

### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 📝 Notes

### Get All Notes (with filters)
```http
GET /api/notes?page=1&limit=50&archived=false&pinned=true&labelId=1&search=query
Authorization: Bearer <token>
```

### Create Note
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Note",
  "content": "Note content",
  "color": "#ffeb3b"
}
```

### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <token>
```

### Toggle Archive
```http
PATCH /api/notes/:id/archive
Authorization: Bearer <token>
```

### Toggle Pin
```http
PATCH /api/notes/:id/pin
Authorization: Bearer <token>
```

---

## ✅ Checklist Items

### Get Checklist Items
```http
GET /api/notes/:noteId/checklist
Authorization: Bearer <token>
```

### Add Checklist Item
```http
POST /api/notes/:noteId/checklist
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Buy milk",
  "position": 0
}
```

### Toggle Checklist Item
```http
PATCH /api/notes/:noteId/checklist/:itemId/toggle
Authorization: Bearer <token>
```

### Update Checklist Item
```http
PUT /api/notes/:noteId/checklist/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Updated text",
  "position": 1
}
```

### Delete Checklist Item
```http
DELETE /api/notes/:noteId/checklist/:itemId
Authorization: Bearer <token>
```

---

## 🏷️ Labels

### Get All Labels
```http
GET /api/labels
Authorization: Bearer <token>
```

### Create Label
```http
POST /api/labels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Work",
  "color": "#4caf50"
}
```

### Update Label
```http
PUT /api/labels/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Personal",
  "color": "#2196f3"
}
```

### Delete Label
```http
DELETE /api/labels/:id
Authorization: Bearer <token>
```

### Add Label to Note
```http
POST /api/notes/:noteId/labels
Authorization: Bearer <token>
Content-Type: application/json

{
  "labelId": 1
}
```

### Remove Label from Note
```http
DELETE /api/notes/:noteId/labels/:labelId
Authorization: Bearer <token>
```

### Get Note's Labels
```http
GET /api/notes/:noteId/labels
Authorization: Bearer <token>
```

---

## ⏰ Reminders

### Set Reminder
```http
POST /api/notes/:noteId/reminder
Authorization: Bearer <token>
Content-Type: application/json

{
  "reminderTime": "2025-12-15T10:00:00Z"
}
```

### Delete Reminder
```http
DELETE /api/notes/:noteId/reminder
Authorization: Bearer <token>
```

### Get Upcoming Reminders
```http
GET /api/reminders/upcoming?limit=10
Authorization: Bearer <token>
```

---

## 👥 Sharing

### Share Note
```http
POST /api/notes/:id/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "friend@example.com",
  "permission": "write"
}
```
*Permission: "read" or "write"*

### Get Notes Shared With Me
```http
GET /api/notes/shared/with-me
Authorization: Bearer <token>
```

### Get Note Collaborators
```http
GET /api/notes/:id/shares
Authorization: Bearer <token>
```

### Unshare Note
```http
DELETE /api/notes/:noteId/share/:sharedUserId
Authorization: Bearer <token>
```

---

## 👤 User Profile

### Get Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

### Update Preferences (Dark Mode, etc.)
```http
PUT /api/user/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "darkMode": true,
  "defaultColor": "#ffeb3b",
  "language": "en"
}
```

### Change Password
```http
PUT /api/user/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

---

## 🔍 Search Examples

### Search Notes
```http
GET /api/notes?search=meeting&page=1&limit=20
Authorization: Bearer <token>
```

### Get Archived Notes
```http
GET /api/notes?archived=true
Authorization: Bearer <token>
```

### Get Pinned Notes
```http
GET /api/notes?pinned=true
Authorization: Bearer <token>
```

### Filter by Label
```http
GET /api/notes?labelId=1
Authorization: Bearer <token>
```

---

## 📊 Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "notes": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

---

## 🚀 Quick Start

1. **Signup**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

2. **Save the token from response**

3. **Create a note**
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"First Note","content":"Hello!","color":"#ffeb3b"}'
```

4. **Get all notes**
```bash
curl -X GET http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Colors should be valid hex codes (e.g., #ffffff)
- Reminder times must be in the future
- Email addresses must be valid and registered for sharing
- Pagination defaults: page=1, limit=50
