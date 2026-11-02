# 📋 Student Feedback Management API - Test Cases & Screenshot Guide

> **Continuous Assessment (CA) - Backend Development**  
> **Total Marks:** 8  
> **Duration:** 1 Hour  
> **Technology Stack:** Node.js, Express.js, MongoDB (Mongoose)

---

## 🚀 How to Run the Project

### 1. Start Backend Server
1. Open terminal inside the `backend` folder:
   ```bash
   cd "backend"
   ```
2. Make sure dependencies are installed (already installed, but if needed):
   ```bash
   npm install
   ```
3. Ensure your MongoDB service is running (or update `MONGO_URI` in `.env` if using MongoDB Atlas).
4. Start the server:
   ```bash
   npm start
   ```
   *Terminal Output should show:*
   ```text
   Server is running on port 5000
   Connected to MongoDB successfully
   ```

### 2. Run React Frontend (Optional / Extra Presentation)
1. Open a new terminal:
   ```bash
   cd "frontend"
   ```
2. Start the Vite React development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## 🧪 Thunder Client / Postman Test Cases

Base URL: `http://localhost:5000`

---

### Test Case 1: Submit Feedback (Success) — Subtask 1 [3 Marks]
* **Description:** Add a new student feedback with valid inputs.
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/feedback`
* **Headers:**
  - `Content-Type`: `application/json`
* **Request Body (JSON):**
  ```json
  {
    "studentName": "Rahul Sharma",
    "courseName": "Full Stack Development",
    "message": "Excellent teaching and practical examples!",
    "rating": 5
  }
  ```
* **Expected Status Code:** `201 Created`
* **Expected Response Body:**
  ```json
  {
    "success": true,
    "message": "Feedback submitted successfully",
    "data": {
      "_id": "6725ba...",
      "studentName": "Rahul Sharma",
      "courseName": "Full Stack Development",
      "message": "Excellent teaching and practical examples!",
      "rating": 5,
      "status": "Pending",
      "createdAt": "2026-11-02T...",
      "updatedAt": "2026-11-02T..."
    }
  }
  ```
* 📸 **Screenshot 1:** Take screenshot of Thunder Client showing status **201 Created** and the returned feedback data. Save as `screenshot_1_post_feedback_success.png`.
* 💡 **Note:** Copy the `_id` from this response for Test Case 5.

---

### Test Case 2: Validation Check - Missing Fields — Subtask 1 [3 Marks]
* **Description:** Test error handling when required fields are missing.
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/feedback`
* **Headers:**
  - `Content-Type`: `application/json`
* **Request Body (JSON):**
  ```json
  {
    "studentName": "Amit Kumar",
    "rating": 4
  }
  ```
* **Expected Status Code:** `400 Bad Request`
* **Expected Response Body:**
  ```json
  {
    "success": false,
    "message": "All fields (studentName, courseName, message, rating) are required"
  }
  ```
* 📸 **Screenshot 2:** Take screenshot showing status **400 Bad Request**.

---

### Test Case 3: Validation Check - Rating Range (Must be 1 to 5) — Subtask 1 [3 Marks]
* **Description:** Test rating validation when rating is greater than 5 or less than 1.
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/feedback`
* **Headers:**
  - `Content-Type`: `application/json`
* **Request Body (JSON):**
  ```json
  {
    "studentName": "Pooja Verma",
    "courseName": "Node.js Basics",
    "message": "Very detailed explanations",
    "rating": 7
  }
  ```
* **Expected Status Code:** `400 Bad Request`
* **Expected Response Body:**
  ```json
  {
    "success": false,
    "message": "Rating must be a number between 1 and 5"
  }
  ```
* 📸 **Screenshot 3:** Take screenshot showing status **400 Bad Request**.

---

### Insert Multiple Records for Pagination Test
Before running Test Case 4, run `POST /api/feedback` 2-3 more times with sample data so pagination shows clearly:
- Student: `"Sneha Patel"`, Course: `"Database Systems"`, Message: `"Loved MongoDB queries"`, Rating: `4`
- Student: `"Vikram Singh"`, Course: `"Web Development"`, Message: `"Hands on coding was helpful"`, Rating: `5`
- Student: `"Ananya Roy"`, Course: `"Cloud Computing"`, Message: `"Good session"`, Rating: `3`

---

### Test Case 4: Retrieve Feedback with Pagination — Subtask 2 [3 Marks]
* **Description:** Fetch feedbacks with `page` and `limit` query parameters using `skip()` and `limit()`.
* **Method:** `GET`
* **URL:** `http://localhost:5000/api/feedback?page=1&limit=2`
* **Query Parameters:**
  - `page`: `1`
  - `limit`: `2`
* **Expected Status Code:** `200 OK`
* **Expected Response Body:**
  ```json
  {
    "success": true,
    "page": 1,
    "limit": 2,
    "totalRecords": 4,
    "totalPages": 2,
    "data": [
      {
        "_id": "...",
        "studentName": "...",
        "courseName": "...",
        "message": "...",
        "rating": 5,
        "status": "Pending"
      },
      {
        "_id": "...",
        "studentName": "...",
        "courseName": "...",
        "message": "...",
        "rating": 4,
        "status": "Pending"
      }
    ]
  }
  ```
* 📸 **Screenshot 4:** Take screenshot showing query parameters `page=1&limit=2`, status **200 OK**, `totalRecords`, and `totalPages`. Save as `screenshot_2_get_pagination.png`.

---

### Test Case 5: Update Feedback Status (Success) — Subtask 3 [2 Marks]
* **Description:** Update review status of feedback using its MongoDB ID.
* **Method:** `PATCH`
* **URL:** `http://localhost:5000/api/feedback/<REPLACE_WITH_ACTUAL_ID>`
  *(Example: `http://localhost:5000/api/feedback/6725ba1234567890abcdef12`)*
* **Headers:**
  - `Content-Type`: `application/json`
* **Request Body (JSON):**
  ```json
  {
    "status": "Reviewed"
  }
  ```
* **Expected Status Code:** `200 OK`
* **Expected Response Body:**
  ```json
  {
    "success": true,
    "message": "Feedback status updated successfully",
    "data": {
      "_id": "...",
      "studentName": "Rahul Sharma",
      "courseName": "Full Stack Development",
      "message": "Excellent teaching and practical examples!",
      "rating": 5,
      "status": "Reviewed",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```
* 📸 **Screenshot 5:** Take screenshot showing status **200 OK** and `"status": "Reviewed"`. Save as `screenshot_3_patch_status_update.png`.

---

### Test Case 6: Update Feedback Status - Invalid/Non-Existent ID — Subtask 3 [2 Marks]
* **Description:** Test error response when record does not exist.
* **Method:** `PATCH`
* **URL:** `http://localhost:5000/api/feedback/507f1f77bcf86cd799439011`
* **Headers:**
  - `Content-Type`: `application/json`
* **Request Body (JSON):**
  ```json
  {
    "status": "Reviewed"
  }
  ```
* **Expected Status Code:** `404 Not Found`
* **Expected Response Body:**
  ```json
  {
    "success": false,
    "message": "Feedback record not found"
  }
  ```
* 📸 **Screenshot 6:** Take screenshot showing status **404 Not Found**.

---

## 📝 Summary of Submission Screenshots Required

| Screenshot File Name | Subtask | Description | Expected Status |
| :--- | :--- | :--- | :--- |
| `1_post_feedback_success.png` | Subtask 1 | POST `/api/feedback` with valid fields | `201 Created` |
| `2_post_validation_error.png` | Subtask 1 | POST with missing fields or invalid rating | `400 Bad Request` |
| `3_get_feedback_pagination.png` | Subtask 2 | GET `/api/feedback?page=1&limit=2` | `200 OK` |
| `4_patch_status_success.png` | Subtask 3 | PATCH `/api/feedback/:id` updating to `Reviewed` | `200 OK` |
| `5_patch_status_not_found.png` | Subtask 3 | PATCH with non-existent MongoDB ID | `404 Not Found` |

---

## 💯 Evaluation Rubric Checklist

- [x] **Subtask 1 (3 Marks):** Mongoose schema/model and feedback submission API (`POST /api/feedback`). Required field validation and rating (1 to 5) validation included.
- [x] **Subtask 2 (2 Marks):** Pagination using query parameters `page` & `limit`, using Mongoose `skip()` and `limit()`.
- [x] **Subtask 2 (1 Mark):** Pagination metadata returned: `page`, `limit`, `totalRecords`, `totalPages`.
- [x] **Subtask 3 (1 Mark):** Correct status update API using feedback ID (`PATCH /api/feedback/:id`).
- [x] **Rubric (1 Mark):** Appropriate HTTP status codes (`201`, `200`, `400`, `404`, `500`) and comprehensive error handling.

