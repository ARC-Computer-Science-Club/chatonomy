const secrets = require('./secrets.js');

const client = require('twilio')(secrets.accountSid, secrets.authToken);
const express = require('express');
const bodyParser = require('body-parser');
const logic = require('./logic');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));


exports.sendOutgoingSMS =
async function (message, receiver, sender) {
  return client.messages
    .create({
      body: message,
      from: sender,
      to: receiver
    });
};

app.post('/sms', (req, res) => {
  logic.IncomingRawSMS(req.body.Body, req.body.To, req.body.From);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end('');
});


app.listen(3000, () => {
  console.log("Server started!");
});
