const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const { dbUri, port } = require('./config');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(process.env.MONGODB_URI);
        console.error('Failed to connect to MongoDB', err);
    });
