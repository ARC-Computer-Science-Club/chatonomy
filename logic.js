const redis = require('redis');
const sms = require('./message_sms_sender');
const REDISHOST = process.env.REDISHOST || 'localhost';
const REDISPORT = process.env.REDISPORT || 6379;


var client = redis.createClient({
  host: REDISHOST,
  port: REDISPORT
});



["ping", "set", "get", "hmset", "hmget", "expire", "hgetall"].forEach(eta => {
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


const optIns = ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"];
const optOuts = ["START", "YES", "UNSTOP"];
const groupSpawns = ["NEW", "LFG", "GROUP"];


exports.IncomingRawSMS =
  function (message, twilioPhoneNum, senderPhoneNum) {

  };


async function userExists (phone, roomID)
{
  var reply = await client.async_hmget(roomID, phone);
  if (reply) return true;
  return false;
}


async function sendMessage(roomID, from, message) {

  message = client.async_hmget(roomID, from) + ": " + message;
  var members = await client.async_hgetall(roomID);
  var roomNum = members.phonenumber;
  Object.keys(members)
    .filter(key => key != from && key != "phonenumber")
    .forEach(rho => sms.sendOutgoingSMS(message, rho, roomNum));
}


async function addUser(phone, nickname, roomID) {
  if ( userExists(phone, roomID) )
    throw Error("User already exists");

  await client.async_hmset(roomID, [phone, nickname]);
};


const servicePool = [""];

async function createRoom() {
  var roomID;

  do
  {
    roomID = getRandomInt(10000000);
  } while (await roomExists(roomID))

  if ( roomExists(roomID) )
    throw('RoomID "' + roomID + '" Exists');

  // expire in 48 hours
  await client.async_hmset(roomID, ["phonenumber", servicePool[servicePool.length]]);
  await client.async_expire(roomID, 60 * 60 * 48);
  //await client.async_set(twilioPhoneNum + senderPhoneNum, roomID);
}


async function roomExists(roomID) {
  if ( await client.async_hmget(roomID) )
    return true;
  else
    throw('roomExists - Search not implemented yet');
}

var members = {123: "Nick", 456: "Tot", 789: "jimbooo", 145: "boi" };
var filtered = Object.filter(members, (key => key != 123));
console.log(filtered);
