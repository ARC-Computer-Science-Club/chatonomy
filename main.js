const secrets = require('./secrets.js');

const client = require('twilio')(secrets.accountSid, secrets.authToken);
const express = require('express');
const bodyParser = require('body-parser');
const logic = require('./logic');

const app = express();
app.enable("trust proxy");

app.get('/', (req, res) => {
  res.send('Hello Express app!');
});

app.use(bodyParser.urlencoded({extended: false}));


exports.sendOutgoingSMS =
async function sendOutgoingSMS(message, receiver, sender) {
  console.log("Made it to outgoing sms");
  return await client.messages
    .create({
      body: message,
      from: sender,
      to: receiver
    });
};

app.post('/sms', async (req, res) => {
  await logic.IncomingRawSMS(req.body.Body, req.body.To, req.body.From);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end('');
});

app.listen(process.env.PORT || 8080, () => {
  console.log('server started');
});
