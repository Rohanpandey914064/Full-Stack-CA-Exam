// Base API URL
const API_URL = 'http://localhost:5000/api/feedback';

// Current pagination state
let currentPage = 1;
let currentLimit = 5;
let totalPages = 1;

// DOM Elements
const feedbackForm = document.getElementById('feedbackForm');
const formAlert = document.getElementById('formAlert');
const feedbackTableBody = document.getElementById('feedbackTableBody');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');
const paginationInfo = document.getElementById('paginationInfo');
const limitSelect = document.getElementById('limitSelect');
const refreshBtn = document.getElementById('refreshBtn');

// Helper to show alert banner
function showAlert(message, type) {
    formAlert.textContent = message;
    formAlert.className = `alert alert-${type}`;
    formAlert.style.display = 'block';

    setTimeout(() => {
        formAlert.style.display = 'none';
    }, 4000);
}

// Subtask 2: Fetch feedback records with pagination
async function fetchFeedbacks(page = 1) {
    try {
        currentLimit = parseInt(limitSelect.value) || 5;
        const response = await fetch(`${API_URL}?page=${page}&limit=${currentLimit}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch feedback records');
        }

        currentPage = result.page;
        totalPages = result.totalPages || 1;

        // Render records in table
        renderTable(result.data);

        // Update pagination UI
        pageIndicator.textContent = `Page ${result.page} of ${result.totalPages || 1}`;
        paginationInfo.textContent = `Total Records: ${result.totalRecords} (Showing ${result.data.length})`;
        
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;

    } catch (error) {
        feedbackTableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: red;">Error: ${error.message} (Is backend running on port 5000?)</td></tr>`;
    }
}

// Render data rows in table
function renderTable(feedbacks) {
    if (!feedbacks || feedbacks.length === 0) {
        feedbackTableBody.innerHTML = `<tr><td colspan="6" class="text-center">No feedback records found. Submit one above!</td></tr>`;
        return;
    }

    feedbackTableBody.innerHTML = feedbacks.map(item => {
        const isReviewed = item.status === 'Reviewed';
        const badgeClass = isReviewed ? 'badge-reviewed' : 'badge-pending';
        const nextStatus = isReviewed ? 'Pending' : 'Reviewed';
        const btnLabel = isReviewed ? 'Mark Pending' : 'Mark Reviewed';

        return `
            <tr>
                <td><strong>${escapeHtml(item.studentName)}</strong></td>
                <td>${escapeHtml(item.courseName)}</td>
                <td>${'⭐'.repeat(item.rating)} (${item.rating}/5)</td>
                <td>${escapeHtml(item.message)}</td>
                <td><span class="badge ${badgeClass}">${item.status}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="updateStatus('${item._id}', '${nextStatus}')">
                        ${btnLabel}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Subtask 1: Handle form submission (POST /api/feedback)
feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value.trim();
    const courseName = document.getElementById('courseName').value.trim();
    const rating = Number(document.getElementById('rating').value);
    const message = document.getElementById('message').value.trim();

    if (!studentName || !courseName || !message || !rating) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentName,
                courseName,
                rating,
                message
            })
        });

        const data = await response.json();

        if (response.status === 201) {
            showAlert('Feedback submitted successfully!', 'success');
            feedbackForm.reset();
            // Refresh feedback list
            fetchFeedbacks(1);
        } else {
            showAlert(data.message || 'Error submitting feedback', 'error');
        }
    } catch (error) {
        showAlert('Network error: Could not connect to backend server.', 'error');
    }
});

// Subtask 3: Update feedback review status (PATCH /api/feedback/:id)
window.updateStatus = async function(id, newStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (response.ok) {
            // Refresh current page
            fetchFeedbacks(currentPage);
        } else {
            alert(data.message || 'Failed to update status');
        }
    } catch (error) {
        alert('Network error while updating feedback status');
    }
};

// Pagination Event Listeners
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchFeedbacks(currentPage - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        fetchFeedbacks(currentPage + 1);
    }
});

limitSelect.addEventListener('change', () => {
    fetchFeedbacks(1);
});

refreshBtn.addEventListener('click', () => {
    fetchFeedbacks(currentPage);
});

// Utility to escape HTML and prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initial load
fetchFeedbacks(1);

