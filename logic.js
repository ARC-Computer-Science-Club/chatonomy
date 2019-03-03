var redis = require('redis');
const sms = require('./main');
const REDISHOST = process.env.REDIS_HOST;
const REDISPORT = process.env.REDIS_PORT;


var client = redis.createClient({
  host: REDISHOST,
  port: REDISPORT
});

client.on('error', err => console.error('ERR:REDIS:', err));
client.on('connect', reply => console.log(reply));



["ping", "set", "get", "del", "hmset", "hdel", "hmget", "expire", "hgetall", "lrange"].forEach(eta => {
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


const optOuts     = ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"];
const optIns      = ["START", "YES", "UNSTOP"];
const groupSpawns = ["NEW", "LFG", "GROUP"];


//async_hgetall(??)

exports.IncomingRawSMS =
  async function (message, twilioPhoneNum, senderPhoneNum) {
    var parced = message.match(/(\w+)(?:(?:\s+)(\w+)(?:(?:\s+)(\w+)|)|)/mg);

    if ( groupSpawns.includes( parced[0] )) {
      if( !parced[1] && !parced[2] ) 
      {
        var roomID = await createRoom(senderPhoneNum);
        await sms.sendOutgoingSMS('"' + roomID + '" created at ' + await getRoomNum(roomID));
      }
      var reqRoomID = parced[1].trim();
      //var existRoomID = async_hmget(twilioPhoneNum, senderPhoneNum);
      if (await roomExists(reqRoomID) ) {
        await sms.sendOutgoingSMS('"' + reqRoomID + '" is in use.');
        return;
      }

      if( parced[2] == senderPhoneNum ) {
        await sms.sendOutgoingSMS('Nickname cannot be your phonenumber.');
        return;
      }

      await sms.sendOutgoingSMS('Hi ' + nickname + '! Welcome to "' + reqRoomID + '"!');
      var nickname = parced[2];
      await addUser( senderPhoneNum, nickname, reqRoomID );
    }
    else if ( optOuts.includes( parced[0] )) {
      await killUser(senderPhoneNum);
    }
    else if ( optIns.includes( parced[0] )) {
      // do nothing intentionally
    }

    await sendMessage(await getRoomID(twilioPhoneNum, senderPhoneNum),senderPhoneNum, message);    
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
  if (members)
  {
    var roomNum = members.phonenumber;
    Object.keys(members)
      .filter(key => key != from && key != "phonenumber")
      .forEach(rho => sms.sendOutgoingSMS(message, rho, roomNum));
  }
}


async function getRoomNum(roomID)
{
  
  var members = await client.async_hgetall(roomID);
  var roomNum = members.phonenumber;
  return roomNum;
}


async function killUser (phone)
{
  // get roomNumbers client is connected to
  var connections = await client.async_lrange(phone, 0, -1);
  connections.forEach( async conn => {
    await removeUser(conn, phone);
  });
}


async function removeUser (roomNum, phone)
{
  // remove roomid entry from composite table
  const roomid = client.async_get(roomNum + phone);
  await client.async_del(roomNum + phone);

  // remove phonenumber: nickname from roomid table
  await client.async_hdel(roomid, phone);
}


const servicePool = [
  "+19166178309",
  "+19168350353",
  "+19166719472",
  "+19165381012"
];

async function addUser (phone, nickname, roomID)
{
  const roomNum = await client.async_hmget(roomID, "phonenumber");
  await client.async_hmset(roomID, [phone, nickname]);
  await client.async_set(roomNum + phone, roomID);
}


async function getRoomID (roomNum, phone)
{
  return await client.async_get(roomNum + phone);
}



async function createRoom(phone) {
  var roomID;

  console.log("Creating room");

  do
  {
    roomID = getRandomInt(10000000);
    console.log(`Generated room id: ${roomID}`);
  } while (await roomExists(roomID));

  if ( roomExists(roomID) )
    throw('RoomID "' + roomID + '" Exists');



  // get roomNumbers client is connected to
  var connections = await client.async_lrange(phone, 0, -1);
  console.log(`Open connections: ${connections}`);

  // Throw error if no room for a new connection
  if(connections)
  {
    if (connections.length >= servicePool.length)
      throw Error("Max number of rooms taken");
  }

  // Pick an unused connection
  var phoneNumCandidates = Array.from(servicePool);
  for (a in connections)
  {
    phoneNumCandidates = phoneNumCandidates.filter(b => {
      return a != b;
    });
  }

  // add new connection to list
  await client.async_lpush(phone, phoneNumCandidates[0]);

  // expire in 48 hours
  await client.async_hmset(roomID, ["phonenumber", phoneNumCandidates[0]]);
  await client.async_expire(roomID, 60 * 60 * 48);

  return roomID;
}


async function roomExists(roomID) {
  if ( await client.async_hmget(roomID, "phonenumber") )
  {
    return true;
  }
  return false;
}
