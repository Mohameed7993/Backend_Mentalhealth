const mongoose = require('mongoose');
const pdfSchema = new mongoose.Schema({
    filename: String, // the name of the file
    contentType: String, // MIME of the file
    buffer: Buffer, // Buffer contain file data
    documentName: String,
    description: String, // Description of the document
    level: String // Level of the document
});
const PdfModel = mongoose.model('Pdf', pdfSchema);
module.exports = PdfModel;
