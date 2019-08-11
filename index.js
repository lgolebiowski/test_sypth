const express = require('express');
const request = require('request');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');


const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
const access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik1FVTBOalpGTmpNM1FqTXpOek00TURWR1JFTTJNREk1TXpFeFJUazVNVGxEUkRZMk1rRkJPUSJ9.eyJodHRwczovL2FwaS5zeXBodC5jb20vY29tcGFueUlkIjoiNzZiNzdjZjYtMTU5OS00ZTBjLWJmMzYtM2JkODMwNjY2ZWQxIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5zeXBodC5jb20vIiwic3ViIjoiTEhoa0NNdUpzTjIyS2h6bkN5MEhRZ0dkakxRWDRFV0lAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYXBpLnN5cGh0LmNvbSIsImlhdCI6MTU2NTUxNTI2MSwiZXhwIjoxNTY1NjAxNjYxLCJhenAiOiJMSGhrQ011SnNOMjJLaHpuQ3kwSFFnR2RqTFFYNEVXSSIsInNjb3BlIjoicmVzdWx0OmFsbCBmaWxldXBsb2FkOmFsbCBhZG1pbmlzdHJhdGlvbjpjb21wYW55IiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.dah8cTx6rll6IndWomSeD_Y6MGL6s8M-5YLJ8CPzO51eYO1dqn3Ex1T-OaqjSpwLrmQGWrJzrG3IOpHUzRH0BlWQ_6R6J3C3LjwkRPzazbqUMLJtp-pkk2MlhTokA3xbqU_fHixa2uu2jk5DyedERVE90QXT_sqk2aEKXR5MormxG_w7XgmhsH42rpQogtgSn2DxzC01GWGkN3Ew_xR6WI-BEQ5byQndncWtC02ennj1vyJa4zP7ruOq81fZ5IyteYH00Z7LrpF80uu5azCapq_BKxfZCGTklMS-bHin8mscAXI2ZL2WX3TWtdC2Wc4lQf5PnMD11POmm6aYh5KrLg'

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
      'Authorization' : `Bearer ${access_token}`
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
