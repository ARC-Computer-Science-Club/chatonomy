const accountSid = 'AC61ac47ffa6fe410ccf2a4ad7cce903d8';
const authToken = '521522fdae843c2e87e264e92baf7f33';
const client = require('twilio')(accountSid, authToken);
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

function message(body1, from1, to1)
{
  return client.messages
  .create({
     body: body1 || 'Hello there',
     from: from1 || '+19168239140',
     to: to1 || '+19166178309'
   })
}

function getSID(message)
{
  return message.sid;
}

app.post('/sms', (req, res) => {
  console.log(req.body.Body);
  console.log(req.body.From);

  message(req.body.Body, '+19168239140', '+19168350353');
  
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end('');
});

app.post("/message", (req, res) => {
  message("Testing /message endpoint")
  .then(message => {
    res.send(message.sid);
  })
  .catch(err => {
    res.sendStatus(500);
  });
});

app.listen(3000, () => {
  console.log("Server started!");
});

console.log('dfsfs');