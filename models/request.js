const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requestId: { type: String, required: true, unique: true },
    status: { type: String, required: true, enum: ['Processing', 'Completed'], default: 'Processing' },
    products: [
        {
            serialNumber: Number,
            productName: String,
            inputImageUrls: [String],
            outputImageUrls: [String]
        }
    ]
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
