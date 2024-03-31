const path =require('path');
const multer = require('multer');

// Set storage engine
const storage = multer.memoryStorage();

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 16000000 }, // Example limit to 16MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');

// Middleware to check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: PDFs Only!');
    }
}

module.exports = upload;
