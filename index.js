const express = require('express');
const request = require('request');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');


const app = express();
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// const upload = multer({
//   dest: 'images',
//   limits: {
//     fileSize: 1000000
//   }
// })
const dateNow = Date.now();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/')
  },
  filename: function (req, file, cb) {
    cb(null, dateNow + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({ storage: storage });

app.post('/upload', upload.single('upload'), (req, res) => {
  debugger;
  let options = {
    url:'https://api.sypht.com/fileupload',
    formData: {
      fileToUpload:fs.createReadStream(__dirname + `/images/${dateNow}.png`),
      fieldSets:JSON.stringify(['sypht.invoice','sypht.document'])
    },
    headers: {
      'Authorization' : `Bearer ${process.env.access_token}`
    },
    json:true
  }

  request.post(options, (error, response, body) => {
  if (error) {
    console.log(error);
  }
    console.log({body, response});
    res.send(response.body);
  })
  
});


// create a GET route
app.post('/getFields', (req, res) => {
  const fileId = req.body.fileId
  let options = {
    url:`https://api.sypht.com/result/final/${fileId}`,
    headers:{
      'Authorization': `Bearer ${access_token}`
    },
    json:true
  }
  console.log(`https://api.sypht.com/result/final/${fileId}`);
  request.get(options, (error, response, body) => {
    console.log(response.body.results);
    res.send(response.body.results);
  })
});
