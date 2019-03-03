const redis = require('redis');

const REDISHOST = process.env.REDISHOST || 'localhost';
const REDISPORT = process.env.REDISPORT || 6379;


var client = redis.createClient({
  host: REDISHOST,
  port: REDISPORT
});



["ping", "set", "get"].forEach(eta => {
  client["async_" + eta] = promisifyRedis(client, client[eta]);
});


var UserInfoFactory = (phoneNumber, roomID, message) => {
  var userInfo = {
    phoneNum: -1,
    roomID: -1,
    message: ''
  };

  return userInfo;
};

UserInfoFactory.isUserInfo = (maybe) => {
  return Boolean(maybe && maybe.phoneNum && maybe.roomID && maybe.message);
};

function IncomingRawSMS(message, twilioPhoneNum, senderPhoneNum) {
  console.log('IncomingRawSMS - ' + message);
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



async function userExists (phoneNum)
{
  var reply = await client.async_get(phoneNum);
  if (reply) return true;
  return false;
}


function validateData(inputData) {
  throw('validateData - Not implemented');
}

function sendMessage(userInfo) {
  if ( userInfo.message == '' )
    throw('sendMessage - No message supplied from "' + userInfo.phoneNum + '"');


  throw('sendMessage - Not implemented');
  // twilio - send message to other(s)
}

function addUser(userInfo) {
  if ( userExists(userInfo.phoneNum) )
      return true; // User already exists

  client.set(userInfo.phoneNum)
  // db - add user
}

function joinRoom(roomID) {
  if ( roomExists(roomID) == false )
      createRoom(roomID);

  // db - add user to the requested room
}

function createRoom(idRequest) {
  //var roomID = NaN;

  if ( roomExists(idRequest) )
      throw('RoomID "' + idRequest + '" Exists');
  
  // db - add idRequest to database and set roomID
  
  // db - check db result
}

function roomExists(roomID) {
  if ( roomID == -1 )
    return false;
  else
    throw('roomExists - Search not implemented yet');
  //Search database for roomID and return true if found
}
