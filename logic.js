var userInfo = {
  phoneNum: -1,
  roomID: -1,
  message: ''
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