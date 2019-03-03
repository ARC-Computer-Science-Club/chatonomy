const redis = require('redis');
const sms = require('./main');
const REDISHOST = process.env.REDISHOST || 'localhost';
const REDISPORT = process.env.REDISPORT || 6379;


var client = redis.createClient({
  host: REDISHOST,
  port: REDISPORT
});



["ping", "set", "get", "hmset", "hmget", "expire"].forEach(eta => {
  client["async_" + eta] = promisifyRedis(client, client[eta]);
});


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function promisifyRedis (client, func)
{
  return function newFunction ()
  {
    return new Promise((resolve, reject) => {
      var params = Array.from(arguments);
      params.push((err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
      console.log(params);
      func.apply(client, params);
    });
  };
}



exports.IncomingRawSMS =
  function IncomingRawSMS(message, twilioPhoneNum, senderPhoneNum) {
    //message = text that user inputs
  };


async function userExists (phone, roomID)
{
  var reply = await client.async_hmget(roomID, phone);
  if (reply) return true;
  return false;
}


function sendMessage(userInfo) {
  if ( userInfo.message == '' )
    throw('sendMessage - No message supplied from "' + userInfo.phoneNum + '"');


  throw('sendMessage - Not implemented');
  // twilio - send message to other(s)
}


async function addUser(phone, nickname, roomID) {
  if ( userExists(phone, roomID) )
    throw Error("User already exists");

  await client.async_hmset(roomID, [phone, nickname]);
};


async function createRoom() {
  var roomID;

  do
  {
    roomID = getRandomInt(10000000);
  } while (await roomExists(roomID))

  if ( roomExists(roomID) )
    throw('RoomID "' + roomID + '" Exists');

  // expire in 48 hours
  await client.async_hmset(roomID);
  await client.async_expire(roomID, 60 * 60 * 48);
}


async function roomExists(roomID) {
  if ( await client.async_hmget(roomID) )
    return true;
  else
    throw('roomExists - Search not implemented yet');
}

