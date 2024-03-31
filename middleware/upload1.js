const path = require('path');
const multer = require('multer');

// Set storage engine
const storage = multer.memoryStorage();

// Initialize upload variable
const upload1 = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // Example limit to 100MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('video'); // Change 'file' to 'video' to match the input field name

// Middleware to check file type for videos
function checkFileType(file, cb) {
    // Adjusted for common video file types
    const filetypes = /mp4|mov|wmv|avi/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Videos Only!'); // Updated error message for clarity
    }
}

module.exports = upload1;
