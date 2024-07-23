const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Request = require('../models/request');
const { processImage } = require('../handlers/imageProcessingHandler');

const router = express.Router();
const upload = multer({ dest: 'tmp/uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    const requestId = uuidv4();
    const fileRows = [];

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = req.file.path;
    
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            fileRows.push(row);
        })
        .on('end', async () => {
            try {
                const products = fileRows.map((row) => ({
                    serialNumber: row['Serial Number'],
                    productName: row['Product Name'],
                    inputImageUrls: row['Input Image Urls'].split(','),
                    outputImageUrls: []
                }));

                await Request.create({ requestId, status: 'Processing', products });

                res.status(200).json({ requestId });
                processImages(requestId, products);
            } catch (processError) {
                console.error('Error processing images - ', processError);
                res.status(500).json({ error: 'Error processing images' });
            } finally {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting temporary file - ', err);
                });
            }
        })
        .on('error', (err) => {
            console.error('CSV Parsing Error - ', err);
            res.status(500).json({ error: 'Error reading CSV file' });
        });
});

async function processImages(requestId, products) {
    for (const product of products) {
        const outputUrls = [];
        for (const url of product.inputImageUrls) {
            const outputPath = await processImage(url);
            outputUrls.push(outputPath); // Save local path or upload to a storage service and save URL
        }
        product.outputImageUrls = outputUrls;
    }

    await Request.updateOne({ requestId }, { status: 'Completed', products });
    // Optionally trigger webhook here
}

router.get('/status/:requestId', async (req, res) => {
    const request = await Request.findOne({ requestId: req.params.requestId });
    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
});

module.exports = router;
