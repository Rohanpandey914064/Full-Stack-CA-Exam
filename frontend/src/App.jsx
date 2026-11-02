import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api/feedback';

function App() {
  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [rating, setRating] = useState('5');
  const [message, setMessage] = useState('');

  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [alert, setAlert] = useState(null);

  const showAlert = (text, type) => {
    setAlert({ text, type });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${API_BASE}?page=${page}&limit=${limit}`);
      const result = await res.json();

      if (res.ok) {
        setFeedbacks(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalRecords(result.totalRecords || 0);
      } else {
        showAlert(result.message || 'Error fetching feedbacks', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Could not connect to backend server on port 5000', 'error');
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [page, limit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentName || !courseName || !message || !rating) {
      showAlert('Please fill in all fields', 'error');
      return;
    }

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentName,
          courseName,
          rating: Number(rating),
          message
        })
      });

      const data = await res.json();

      if (res.status === 201) {
        showAlert('Feedback submitted successfully!', 'success');
        setStudentName('');
        setCourseName('');
        setMessage('');
        setRating('5');
        setPage(1);
        fetchFeedbacks();
      } else {
        showAlert(data.message || 'Failed to submit feedback', 'error');
      }
    } catch (err) {
      showAlert('Network error while submitting feedback', 'error');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Reviewed' ? 'Pending' : 'Reviewed';

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();

      if (res.ok) {
        showAlert(`Status updated to "${newStatus}"`, 'success');
        fetchFeedbacks();
      } else {
        showAlert(data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      showAlert('Network error while updating status', 'error');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Student Feedback Management System</h1>
        <p>CA Assessment - Full Stack React & Express Application</p>
      </header>

      <section className="card">
        <h2>Submit Student Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student Name *</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Course Name *</label>
            <input
              type="text"
              placeholder="e.g. Full Stack Development"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Rating (1 to 5) *</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)} required>
              <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
              <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
              <option value="3">⭐⭐⭐ (3 - Good)</option>
              <option value="2">⭐⭐ (2 - Fair)</option>
              <option value="1">⭐ (1 - Poor)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Feedback Message *</label>
            <textarea
              rows="3"
              placeholder="Write feedback message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Feedback
          </button>
        </form>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.text}
          </div>
        )}
      </section>

      <section className="card">
        <div className="list-header">
          <h2>All Feedback Records</h2>
          <div className="controls">
            <label>Per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <button className="btn btn-secondary btn-sm" onClick={fetchFeedbacks}>
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No feedback records found. Submit one above!
                  </td>
                </tr>
              ) : (
                feedbacks.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.studentName}</strong></td>
                    <td>{item.courseName}</td>
                    <td>{'⭐'.repeat(item.rating)} ({item.rating}/5)</td>
                    <td>{item.message}</td>
                    <td>
                      <span
                        className={`badge ${item.status === 'Reviewed' ? 'badge-reviewed' : 'badge-pending'
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleStatusToggle(item._id, item.status)}
                      >
                        {item.status === 'Reviewed' ? 'Mark Pending' : 'Mark Reviewed'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <div>
            Total Records: {totalRecords} (Showing page {page} of {totalPages})
          </div>
          <div className="pagination-buttons">
            <button
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              ⬅ Previous
            </button>
            <span className="page-indicator">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next ➡
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
