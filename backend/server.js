import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Feedback from './models/Feedback.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_feedback';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Student Feedback Management API is running');
});

app.post('/api/feedback', async (req, res) => {
    try {
        const { studentName, courseName, message, rating } = req.body;

        if (!studentName || !courseName || !message || rating === undefined || rating === null) {
            return res.status(400).json({
                success: false,
                message: 'All fields (studentName, courseName, message, rating) are required'
            });
        }

        const numericRating = Number(rating);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be a number between 1 and 5'
            });
        }

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

app.get('/api/feedback', async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;

        if (page < 1) page = 1;
        if (limit < 1) limit = 5;

        const skip = (page - 1) * limit;

        const totalRecords = await Feedback.countDocuments();

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

app.patch('/api/feedback/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required in request body'
            });
        }

        const allowedStatuses = ['Pending', 'Reviewed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 'Pending' or 'Reviewed'"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Feedback ID format'
            });
        }

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            id,
            { status: status },
            { new: true, runValidators: true }
        );

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
