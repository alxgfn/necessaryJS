////////////////////////////////////////////////////////////////////////////
//  SEND FILES
////////////////////////////////////////////////////////////////////////////

var textFromFileLoaded = "";
var myTextArray = [];
var myFileNameArray = [];
var thereIsSomethingToSend = false;

function encodeFile()
{
	var fileToLoad = document.getElementById("fileToLoad").files[0];
	var fileReader = new FileReader();
	myFileNameArray = fileToLoad.name.split("");
	fileReader.onload = function(fileLoadedEvent) 
	{
		textFromFileLoaded = fileLoadedEvent.target.result;
		if (textFromFileLoaded.length > 0) {
			myTextArray = textFromFileLoaded.split("");
			thereIsSomethingToSend = true; 
			document.getElementById("sendfilebutton").disabled = true;
		}
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
}


//sending file byte by byte on random moments
(function loop() {
    var rand = Math.round(Math.random() * 50) + 20;
    setTimeout(function() {
			if(myFileNameArray.length > 0) {
				var toSend = myFileNameArray.shift();
				if(myFileNameArray.length == 0) {
					thereIsSomethingToSend = false;
					sendMyMessage(myOrientation, EOFileNameMSG, Math.round(Math.random() * 256), toSend);	//send "EOFilename"
				}
				sendMyMessage(myOrientation, fileNameMsg, Math.round(Math.random() * 256), toSend);		//send byte
			} else {
				if(myTextArray.length > 0) {
					var toSend = myTextArray.shift();
					if(myTextArray.length == 0) {
						thereIsSomethingToSend = false;
						document.getElementById("sendfilebutton").disabled = false;	
						sendMyMessage(myOrientation, EOFMsg, Math.round(Math.random() * 256), toSend);	//send "EOF"
						myFileNameArray = [];
					}
					sendMyMessage(myOrientation, pieceOfFileMsg, Math.round(Math.random() * 256), toSend);
				}
			}
			loop();			
    }, rand);
}());	
////////////////////////////////////////////////////////////////////////////
// RECIEVE FILES
////////////////////////////////////////////////////////////////////////////


var fileRecievingInProgress = false;
var recievingFileName = "recievedfile";
var textToWrite = "";
var recFileName = "";

//starting to recieve file
function startToRecieveFile(pieceOfData) {
	fileRecievingInProgress = true;
	console.log("There is a file");
	addPieceToFile(pieceOfData);
}

//accumulating text to save
function addPieceToFile(pieceOfData) {
	console.log("Another piece of file:", pieceOfData);
	textToWrite += pieceOfData;
}

function addPieceToFileName(pieceOfData) {
	console.log("Another piece of filename:", pieceOfData);
	recFileName += pieceOfData;
}

//downloading complete file
function completeFileRecieving(pieceOfData) {
	console.log("EOF!", pieceOfData);
	fileRecievingInProgress = false;
	textToWrite += pieceOfData;
	var fileToSaveAsBlob = new Blob([textToWrite], {type:'text/plain'});
	textToWrite = "";

	var downloadLink = document.createElement("a");
	downloadLink.download = recievingFileName;
	if(recFileName) {downloadLink.download = recFileName;}
	
	console.log("Filename:", recFileName);
	
	if (window.webkitURL != null)
	{
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(fileToSaveAsBlob);
	}
	else
	{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(fileToSaveAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}
	console.log(downloadLink);
	downloadLink.click();
	recFileName = "";
}