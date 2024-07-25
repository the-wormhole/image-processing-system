const csv = require('csv-parser');
const fs = require('fs');

const validateCSV = (filePath) =>{
    return new Promise((resolve, reject) =>{
        const requiredHeaders = ['serial number', 'product name', 'input image urls'];
        const errors = [];
        let headersValidated = false;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('headers', (headers) =>{

                headersValidated = headers.every(header => {
                    // console.log("here");
                    // console.log(requiredHeaders,header.toLowerCase());
                    // console.log("here");
                    return requiredHeaders.includes(header.toLowerCase())
                    // header.trim().toLowerCase()
                });
                if (!headersValidated){
                    reject(new Error('CSV headers are not correctly formatted(make sure to have no leading or trailing spaces and the headers are strings'));
                }
            })
            .on('data', (row) =>{
                if (!headersValidated) return;

                // Validate Serial Number
                // console.log(row['Serial Number'],row);
                if (!row['Serial Number'] || isNaN(parseInt(row['Serial Number']))){
                    // console.log(row['Serial Number'])
                    errors.push(`Invalid Serial Number at row ${JSON.stringify(row)}(check if the value is a number or not)`);
                }

                // Validate Product Name
                if (!row['Product Name'] || typeof row['Product Name'] !== 'string'){
                    errors.push(`Invalid Product Name at row ${JSON.stringify(row)}`);
                }

                // Validate Input Image Urls
                if (!row['Input Image Urls'] || typeof row['Input Image Urls'] !== 'string' || row['Input Image Urls'].length <= 1){
                    errors.push(`Invalid Input Image Urls at row ${JSON.stringify(row)}`);
                }
            })
            .on('end', () =>{
                if (errors.length > 0) {
                    reject(new Error(errors.join(', ')));
                } else {
                    resolve(true);
                }
            })
            .on('error', (error) =>{
                reject(error);
            });
    });
};

module.exports = validateCSV;