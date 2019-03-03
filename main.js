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
function sendOutgoingSMS(message, receiver, sender) {
    client.messages
      .create({
        body: message,
        from: sender,
        to: receiver
      })
    .then(message => console.log(message.sid))
    .catch(err => console.log(err));
};

app.post('/sms', (req, res) => {
  logic.IncomingRawSMS(req.body.Body, req.body.To, req.body.From);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end('');
});

app.listen(process.env.PORT || 8080, () => {
  console.log('server started');
});
