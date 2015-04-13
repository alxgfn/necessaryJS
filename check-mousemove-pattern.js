////////////////////////////////////////////////////////////////////////////
//  CHECK PATTERN
////////////////////////////////////////////////////////////////////////////
var whoAmI = 'sender';  //sender or reciever


// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}

//checking if mouse trace follows the pattern mouseMovePattern
function checkMouseMovePattern(mouseX, mouseY) {
	var discreteX = Math.round((mouseX - canv.offsetLeft) / horizontalStepInPixels),
		discreteY = Math.round((mouseY - canv.offsetTop)/ verticalStepInPixels);

	//if not just started...
	if(mouseMoveIndex > 0) {
		if(weAreHere[0] == discreteX && weAreHere[1] == discreteY) {
//			....do nothing!......
		} else {
			weAreHere = [discreteX, discreteY];
			if(weAreHere.equals(mouseMovePattern[mouseMoveIndex])) {
				mouseMoveIndex ++;
				if(mouseMoveIndex >= mouseMovePattern.length) {
						currentMode = !currentMode;
						updateHTML();
						mouseMoveIndex = 0;
					}
			} else {
				mouseMoveIndex = 0;
				weAreHere = [];
			}
		}
		//if just started...
		} else { 
			if(mouseMovePattern[0].equals([discreteX, discreteY])) {
				weAreHere = [discreteX, discreteY];
				mouseMoveIndex = 1;
			}
		}
}

//adding special elements to the main HTML document
function updateHTML()
{	
	sendMyMessage(myOrientation, specModeOn, 50, "special mode activated");
	if(currentMode) {
		document.getElementById('container').innerHTML = "<br><p>Select a file to send:<\/p><input type=\"file\" id=\"fileToLoad\"><button onclick=\"encodeFile()\" ID=\"sendfilebutton\" enabled>send file</button>";
		currentMode = -currentMode;
	} else {
		document.getElementById('container').innerHTML = "";
		currentMode = -currentMode;
	}
}