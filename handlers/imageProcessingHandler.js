const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const s3 = require('../awsConfig');

const downloadImage = async (url) => {
    // console.log("cool");

    // Add a check for empty urls to ensure inappropriate requests
    try {
        const response = await axios({
            url,
            responseType: 'arraybuffer'
        });
        return response.data;
    } catch (error) {
        console.error(`Error downloading image from ${url}:`, error);
        throw new Error('Error downloading image');
    }
};

const uploadToS3 = async (buffer, key) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
        // ACL: 'public-read'
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // Return the S3 URL of the uploaded image
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw new Error('Error uploading image to S3');
    }
};

const processImage = async (imageUrl) => {
    const imageBuffer = await downloadImage(imageUrl);

    if (!imageBuffer || imageBuffer.length === 0) {
        console.error(`Downloaded image buffer is empty for URL: ${imageUrl}`);
        throw new Error('Downloaded image buffer is empty');
    }

    const outputFileName = `${uuidv4()}.jpg`;
    // const outputPath = path.join(__dirname, '../tmp/processed/', outputFileName);

    // Ensure the directory exists
    // fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // try {
    //     await sharp(imageBuffer)
    //         .resize(800)
    //         .toFile(outputPath);
    //     return outputPath; // Return the local path of the processed image
    // }
    try {
        const resizedBuffer = await sharp(imageBuffer)
            .resize(800)
            .toBuffer();

        const s3Url = await uploadToS3(resizedBuffer, `processed/${outputFileName}`);
        return s3Url; // Return the S3 URL of the processed image
    }catch (error) {
        console.error(`Error processing image: ${outputPath}`, error);
        throw new Error('Error processing image');
    }
};

module.exports = { processImage };
