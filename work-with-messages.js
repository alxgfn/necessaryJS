const	ininMsg = 0, 
		startGameMsg = 1, 
		mouseMoveMsg = 3, 
		pieceOfFileMsg = 4, 
		EOFMsg = 5, 
		specModeOn = 6,
		fileNameMsg = 7,
		EOFileNameMSG = 8;

//Sending message through hangouts
function sendMyMessage(senderID, messageType, messageID, messageText) {

//	var dataToSend = JSON.stringify([senderID, messageType, messageID, messageText]);
	var dataToSend = Aes.Ctr.encrypt(JSON.stringify([senderID, messageType, messageID, messageText]), verySecurePassword, 256);
	console.log("Sending: ", dataToSend);
	gapi.hangout.data.sendMessage(dataToSend);
//	recieveMessage(dataToSend);
}

//Recieving message through hangouts
function onMessageReceived(event) {
  try {
	recieveMessage(event.message);
  } catch (e) {
    console.log("Something was wrong:", e);
  }
}

//Processing recieved message
function recieveMessage(dataAsString) {
//	var recievedData = dataAsString;
	var recievedData = Aes.Ctr.decrypt(dataAsString, verySecurePassword, 256);
	var parsedData = JSON.parse(recievedData);
	var senderID = parsedData[0],
		messageType = parsedData[1],
		messageID = parsedData[2],
		messageText = parsedData[3];
	switch (messageType) {
		case ininMsg: 				//initializing
			break
		case mouseMoveMsg: 			//mouse update
			if(senderID == 1) {	//horizontal
				mouse.x = parseInt(messageText);
			} else {			//vertical
				mouse.y = parseInt(messageText);
			}
			break
		case startGameMsg:					//partner initiates a game
			passiveStart();
			break
		case pieceOfFileMsg:				//a piece of file
			if(fileRecievingInProgress) {	//already started
				addPieceToFile(messageText);
			} else {
				startToRecieveFile(messageText);
			}
			break
		case EOFMsg:		//EOF
			completeFileRecieving(messageText);
			break
		case fileNameMsg:
			addPieceToFileName(messageText);
			break
		case EOFileNameMSG:	
			break
		default:
			console.log("Error! Incorrect message type:", messageType)
	}
}