
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const config = require('./config');



const s3 = new AWS.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region
});

const app = express();
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
  
    const params = {
      Bucket: config.bucketName,
      Key: file.originalname,
      Body: file.buffer
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send('Failed to upload file');
      } else {
        console.log(data);
        res.send('File uploaded to S3');
      }
    });
  });



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});