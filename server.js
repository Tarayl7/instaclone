const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const fileupload = require('express-fileupload');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true 
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connected');  
});

const userRouter = require('./routers/userRouter');
const postRouter = require('./routers/postRouter');

server.use('/user', userRouter);
server.use('/posts', postRouter);

server.use(fileupload({
  useTempFiles: true
}))

 
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
})

server.post('/upload/image', (req, res) => {
  const file = req.files.file;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    return res.send(result);
  })
});

server.post('/upload/video', (req, res) => {
  const file = req.files.file;
  cloudinary.uploader.upload(file.tempFilePath, { resource_type: 'video', duration: 60 }, (err, result) => {
    return res.send(result);
  })
});

server.post('/delete/image', (req, res) => {
  cloudinary.uploader.destroy(public_id = req.body.public_id)
});

server.post('/delete/video', (req, res) => {
  cloudinary.uploader.destroy(public_id = req.body.public_id, { resource_type: 'video' })
});

if (process.env.NODE_ENV === 'production') {
  server.use(express.static('frontend/build'));

  server.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
} 

const Port = process.env.Port || 4000;

server.listen(Port, () => console.log(`Server is running on port ${Port}`));