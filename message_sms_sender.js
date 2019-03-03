const secrets = require('./secrets.js');

const client = require('twilio')(secrets.accountSid, secrets.authToken);
const express = require('express');
const bodyParser = require('body-parser');
const logic = require('./logic');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

/*function message(body1, from1, to1)
{
  return client.messages
  .create({
     body: body1 || 'Hello there',
     from: from1 || '+19168239140',
     to: to1 || '+19166178309'
   })
}*/

function getSID(message)
{
  return message.sid;
}

function processIncomingSMS(message, receiver, sender) {
  logic.IncomingRawSMS(message, receiver, sender);
}

exports.sendOutgoingSMS = 
function sendOutgoingSMS(message, receiver, sender) {
  app.post("/message", (req, res) => {
    client.messages
      .create({
        body: message,
        from: sender,
        to: receiver
      })
      .then(message => console.log(message.sid));
  })
}

app.post('/sms', (req, res) => {
  //console.log(req.body.Body);	//gets the message of sender
  //console.log(req.body.From);	//gets the phone number of sender

  processIncomingSMS(req.body.Body, req.body.To, req.body.From);

  //message(req.body.Body, '+19168239140', '+19168350353');	//sends the message
  
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