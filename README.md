# Image Processor API

This project provides an API to efficiently process image data from CSV files. The system allows you to upload a CSV file containing product information and image URLs, processes the images by compressing them to 50% of their original quality, and stores the processed images along with the product information.

## Features

- Upload CSV files containing product information and image URLs.
- Validate the formatting of the CSV files.
- Asynchronously process images to compress them by 50%.
- Store processed image data and associated product information in a database.
- Provide API endpoints to upload CSV files and check the processing status.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Multer (for handling file uploads)
- Sharp (for image processing)
- AWS S3 (for storing processed images)

## Setup

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB installed and running
- AWS S3 bucket and credentials set up

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/image-processor-api.git
    cd image-processor-api
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/image-processor
    AWS_ACCESS_KEY_ID=your-aws-access-key-id
    AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
    AWS_BUCKET_NAME=your-s3-bucket-name
    ```

4. Start the server:

    ```bash
    npm start
    ```

## API Endpoints

### Upload CSV

- **URL**: `/api/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Description**: Accepts a CSV file, validates its formatting, and returns a unique request ID.
- **Request Example**:

    ```bash
    curl -X POST -F "file=@path/to/your/csvfile.csv" http://localhost:3000/api/upload
    ```

- **Response Example**:

    ```json
    {
        "requestId": "123e4567-e89b-12d3-a456-426614174000"
    }
    ```

### Check Status

- **URL**: `/api/status`
- **Method**: `GET`
- **Description**: Allows users to query the processing status using the request ID.
- **Query Parameters**:
    - `requestId`: The unique request ID returned from the upload endpoint.
- **Request Example**:

    ```bash
    curl http://localhost:3000/api/status?requestId=123e4567-e89b-12d3-a456-426614174000
    ```

- **Response Example**:

    ```json
    {
        "requestId": "123e4567-e89b-12d3-a456-426614174000",
        "status": "Completed",
        "products": [
            {
                "serialNumber": "1",
                "productName": "SKU1",
                "inputImageUrls": ["https://example.com/input1.jpg"],
                "outputImageUrls": ["https://example.com/output1.jpg"]
            }
        ]
    }
    ```
