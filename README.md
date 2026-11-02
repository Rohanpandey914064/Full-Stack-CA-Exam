# Student Feedback Management System (Full Stack)

This is a Full Stack MERN (Node.js, Express.js, MongoDB, HTML/CSS/JS) practical assessment project for **Continuous Assessment (CA) - Backend Development**.

---

## 📁 Project Structure

```text
CA FSD EXAM/
├── backend/
│   ├── models/
│   │   └── Feedback.js          # Mongoose schema and model
│   ├── .env                     # Port and MongoDB Connection URI
│   ├── package.json             # Express, Mongoose, Cors, Dotenv
│   └── server.js                # Express app, routes, pagination, error handling
├── frontend/
│   ├── index.html               # Feedback form and paginated feedback viewer
│   ├── style.css                # Clean beginner styling
│   └── script.js                # API fetch calls (POST, GET with pagination, PATCH)
├── testcontent.md               # All test cases, step-by-step Thunder Client testing guide
└── thunder-collection_student_feedback_api.json # Thunder Client importable collection
```

---

## 🎯 Requirements & Subtasks Implemented

### 1. Subtask 1: Submit Student Feedback (3 Marks)
- Endpoint: `POST /api/feedback`
- Accepts: `studentName`, `courseName`, `message`, `rating` (1 to 5)
- Saves record with default status `'Pending'`
- Validations:
  - Required field check: Returns `400 Bad Request` if any field is missing.
  - Rating check: Returns `400 Bad Request` if rating is not between 1 and 5.
- Returns `201 Created` with saved document.

### 2. Subtask 2: Retrieve Feedback with Pagination (3 Marks)
- Endpoint: `GET /api/feedback?page=1&limit=5`
- Implements pagination using Mongoose `.skip()` and `.limit()`.
- Returns metadata: `page`, `limit`, `totalRecords`, `totalPages`, and feedback array `data`.
- Returns `200 OK`.

### 3. Subtask 3: Update Feedback Status (2 Marks)
- Endpoint: `PATCH /api/feedback/:id`
- Accepts new status (`Pending` or `Reviewed`) in request body.
- Updates record using MongoDB `_id` (`findByIdAndUpdate`).
- Validates ID and returns `404 Not Found` if record does not exist.
- Returns `200 OK` with updated feedback record.

---

## 🚀 Getting Started

### Backend Setup:
```bash
cd backend
npm install
npm start
```
The server will run on `http://localhost:5000`.

### Frontend Setup:
Open `frontend/index.html` in any browser or with VS Code Live Server.

### API Testing:
Follow [testcontent.md](file:///e:/CA%20FSD%20EXAM/testcontent.md) to run all test cases in Thunder Client or Postman and take required screenshots.

