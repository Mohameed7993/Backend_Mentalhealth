const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    Data: {
        type: Buffer,
        required: true
        
    },
    exerciseName: {
        type: String,
        required: true
    },
    how_to_do: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: true // Assuming description is optional; adjust as needed
    },
    level: {
        type: Number,
        required: [true, 'Level is required'],
        min: [1, 'Level must be at least 1'],
        max: [10, 'Level must be no more than 10']
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

const VideoModel = mongoose.model('Video', videoSchema);

module.exports = VideoModel;
