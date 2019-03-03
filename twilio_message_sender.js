// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
const accountSid = 'AC61ac47ffa6fe410ccf2a4ad7cce903d8';
const authToken = '521522fdae843c2e87e264e92baf7f33';
const client = require('twilio')(accountSid, authToken);
const express = require('express');



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

const app = express();

app.post("/message", (req, res) => {
  message("Testing /message endpoint")
  .then(message => {
    res.send(message.sid);
  })
  .catch(err => {
    res.sendStatus(500);
  });
})

app.listen(3000, () => {
  console.log("Server started!");
})