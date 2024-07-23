const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    dbUri: process.env.MONGODB_URI,
    port: process.env.PORT,
};