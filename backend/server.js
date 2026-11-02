import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Feedback from './models/Feedback.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_feedback';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
    res.send('Student Feedback Management API is running');
});

// Subtask 1: Submit Student Feedback
// POST /api/feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const { studentName, courseName, message, rating } = req.body;

        // Validation for required fields
        if (!studentName || !courseName || !message || rating === undefined || rating === null) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields (studentName, courseName, message, rating) are required' 
            });
        }

        // Validate rating between 1 and 5
        const numericRating = Number(rating);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be a number between 1 and 5' 
            });
        }

        // Create new feedback document
        const newFeedback = new Feedback({
            studentName: studentName.trim(),
            courseName: courseName.trim(),
            message: message.trim(),
            rating: numericRating,
            status: 'Pending'
        });

        const savedFeedback = await newFeedback.save();

        return res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: savedFeedback
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error while submitting feedback', 
            error: error.message 
        });
    }
});

// Subtask 2: Retrieve Feedback with Pagination
// GET /api/feedback?page=1&limit=5
app.get('/api/feedback', async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;

        // Ensure page and limit are positive integers
        if (page < 1) page = 1;
        if (limit < 1) limit = 5;

        const skip = (page - 1) * limit;

        // Count total records in database
        const totalRecords = await Feedback.countDocuments();

        // Fetch records using skip() and limit()
        const feedbackList = await Feedback.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            page: page,
            limit: limit,
            totalRecords: totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            data: feedbackList
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching feedback', 
            error: error.message 
        });
    }
});

// Subtask 3: Update Feedback Status
// PATCH /api/feedback/:id
app.patch('/api/feedback/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status presence
        if (!status) {
            return res.status(400).json({ 
                success: false, 
                message: 'Status is required in request body' 
            });
        }

        // Validate status value
        const allowedStatuses = ['Pending', 'Reviewed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Status must be either 'Pending' or 'Reviewed'" 
            });
        }

        // Check if id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid Feedback ID format' 
            });
        }

        // Update the feedback record
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            id,
            { status: status },
            { new: true, runValidators: true }
        );

        // If record not found
        if (!updatedFeedback) {
            return res.status(404).json({ 
                success: false, 
                message: 'Feedback record not found' 
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Feedback status updated successfully',
            data: updatedFeedback
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error while updating feedback status', 
            error: error.message 
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
