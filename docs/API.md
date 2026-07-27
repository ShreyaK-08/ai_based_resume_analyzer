# API Reference

Base URL (local): `http://localhost:5000`

All request/response bodies are JSON unless noted otherwise. Protected routes require:

```
Authorization: Bearer <jwt_token>
```

---

## Auth

### `POST /api/auth/signup`
Creates a new user account.

**Request Body**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "min 6 characters" }
```

**Response**
```json
{ "token": "<jwt>", "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" } }
```

### `POST /api/auth/login`
Authenticates a user and returns a JWT.

**Request Body**
```json
{ "email": "jane@example.com", "password": "..." }
```

### `GET /api/auth/me` 🔒
Returns the currently authenticated user.

---

## Analysis

### `POST /api/analyze` 🔒
Uploads a resume and job description (PDF) and runs an AI match analysis.

**Request**: `multipart/form-data`
| Field | Type | Description |
|---|---|---|
| `resume` | file (PDF, max 10MB) | The candidate's resume |
| `jobDescription` | file (PDF, max 10MB) | The target job description |

**Response**
```json
{
  "success": true,
  "analysis": {
    "jobTitle": "Software Engineer",
    "matchScore": 20,
    "atsScore": 40,
    "skillsMatch": 30,
    "experienceMatch": 10,
    "educationMatch": 50,
    "presentSkills": ["Python", "SQL", "HTML", "CSS", "JavaScript"],
    "missingSkills": ["ReactJS", "AngularJS", "ExpressJS", "NodeJS", "MongoDB", "Docker"],
    "suggestions": [
      "Gain experience in application development",
      "Improve skills in JavaScript frameworks",
      "Familiarize with containerization using Docker"
    ],
    "overallFeedback": "The candidate has a basic foundation in programming but lacks experience and skills required for the job."
  }
}
```

Uploaded files are deleted from `server/uploads/` immediately after processing.

### `POST /api/analyze/chat` 🔒
Sends a message to the AI Career Coach.

**Request Body**
```json
{ "message": "Top skills for software engineers in 2025?" }
```

**Response**
```json
{ "reply": "1. **Cloud Computing**: ..." }
```

---

## History

### `GET /api/history` 🔒
Lists all past analyses for the authenticated user.

### `GET /api/history/:id` 🔒
Fetches a single analysis by ID.

### `DELETE /api/history/:id` 🔒
Deletes a single analysis by ID.

---

## Report

### `GET /api/report/:id`
Generates and streams a PDF report for the given analysis ID.

> ⚠️ **Security note**: this route does **not** currently require authentication. Any analysis ID is fetchable by anyone who knows or guesses it. See [SECURITY.md](../SECURITY.md) before deploying publicly.

---

## Error Format

Most error responses follow this shape:

```json
{ "message": "Description of what went wrong" }
```
