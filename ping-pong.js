function initializeorientation() {
	var myInitializingRandom = Math.random() + Math.random() + Math.random() + Math.random() + Math.random();
	var partnersInitializingRandom = Math.random() + Math.random() + Math.random() + Math.random() + Math.random();
	
// here we should send our number to the partner
// and recieve partners result

	sendMyMessage(myOrientation, ininMsg, 0, myInitializingRandom);
	
	if(partnersInitializingRandom > myInitializingRandom) { myOrientation = 1; }	// i am horizontal
		else { myOrientation = -1; }												// i am vertical
}

// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     ||  
			function( callback ){
				return window.setTimeout(callback, 1000 / fps);
			};
})();

window.cancelRequestAnimFrame = ( function() {
	return 	window.cancelAnimationFrame          ||
			window.webkitCancelRequestAnimationFrame    ||
			window.mozCancelRequestAnimationFrame       ||
			window.oCancelRequestAnimationFrame     ||
			window.msCancelRequestAnimationFrame        ||
			clearTimeout
} )();
	
	
// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", startBtnClick, true);

// Initialise the collision sound
collision = document.getElementById("collide");

// Set the canvas's height and width to full screen
canvas.width = W;
canvas.height = H;

// Function to paint canvas
function paintCanvas() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);
}

// Function for creating horizontal paddles
function hPaddle(pos) {
	// Height and width
	this.h = 5;
	this.w = Math.round(W * 0.25);
	
	// Paddle's position
	this.x = W/2 - this.w/2;
	this.y = (pos == "top") ? 0 : H - this.h;
	
}

// Function for creating vertical paddles
function vPaddle(pos) {
	// Height and width
	this.w = 5;
	this.h = Math.round(H * 0.25);
	
	// Paddle's position
	this.y = H/2 - this.h/2;
	this.x = (pos == "left") ? 0 : W - this.w;
	
}


// Push two new paddles into the horizontal paddles array
hpaddles.push(new hPaddle("bottom"));
hpaddles.push(new hPaddle("top"));

// Push two new paddles into the vertical paddles array
vpaddles.push(new vPaddle("left"));
vpaddles.push(new vPaddle("right"));

// Ball object
ball = {
	x: 50,
	y: 50, 
	r: 5,
	c: "white",
	vx: 6,
	vy: 6,
	
	// Function for drawing ball on canvas
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	}
};


// Start Button object
startBtn = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 25,
	
	draw: function() {
		initializeorientation();
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("Start", W/2, H/2 );
	}
};

// Restart Button object
restartBtn = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 50,
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("Restart", W/2, H/2 - 25 );
	}
};

// Function for creating particles object
function createParticles(x, y, m) {
	this.x = x || 0;
	this.y = y || 0;
	
	this.radius = 1.2;
	
	this.vx = -1.5 + Math.random() * 3;
	this.vy = m * Math.random() * 1.5;
}

// Draw everything on canvas
function draw() {
	paintCanvas();
	for(var i = 0; i < hpaddles.length; i++) {
		currentPaddle = hpaddles[i];
		
		ctx.fillStyle = "white";
		ctx.fillRect(currentPaddle.x, currentPaddle.y, currentPaddle.w, currentPaddle.h);
	}
	
	for(var i = 0; i < vpaddles.length; i++) {
		currentPaddle = vpaddles[i];
		
		ctx.fillStyle = "white";
		ctx.fillRect(currentPaddle.x, currentPaddle.y, currentPaddle.w, currentPaddle.h);
	}
	
	ball.draw();
	update();
}

// Function to increase speed after every 5 points
function increaseSpd() {
//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//	if(vpoints + hpoints % 4 == 0)
	if(points % 4 == 0) {
		if(Math.abs(ball.vx) < 15) {
			ball.vx += (ball.vx < 0) ? -1 : 1;
			ball.vy += (ball.vy < 0) ? -2 : 2;
		}
	}
}

// Track the position of mouse cursor
function trackPosition(e) {
	if(myOrientation > 0)	{	//horizontal sends X
		mouse.x = e.pageX; 
		sendMyMessage(myOrientation, mouseMoveMsg, 0, mouse.x);
	} else {					//vertical sends Y
		mouse.y = e.pageY; 
		sendMyMessage(myOrientation, mouseMoveMsg, 0, mouse.y);
	}
	checkMouseMovePattern(e.pageX, e.pageY); //check pattern to switch mode
}

// Function to update positions, score and everything.
// Basically, the main game logic is defined here
function update() {
	
	// Update scores
	updateScore(); 

	// Move the paddles on mouse move

//FOR NOT REAL APP///////////////////////////////////////////////////////////////////////////////////////////	
	if(mouse.x && mouse.y) {
			for(var i = 1; i < hpaddles.length; i++) {
				currentPaddle = hpaddles[i];
				currentPaddle.x = mouse.x - currentPaddle.w/2;
			}		
			for(	i = 1; i < vpaddles.length; i++) {
				currentPaddle = vpaddles[i];
				currentPaddle.y = mouse.y - currentPaddle.h/2;
			}		
	}	
	
//FOR REAL APP///////////////////////////////////////////////////////////////////////////////////////////	
/*
	if(mouse.x && mouse.y) {
		if(myOrientation > 0) { //i am horizontal
			for(var i = 1; i < hpaddles.length; i++) {
				currentPaddle = hpaddles[i];
				currentPaddle.x = mouse.x - currentPaddle.w/2;
			}		
		} else { //i am vertical
			for(	i = 1; i < vpaddles.length; i++) {
				currentPaddle = vpaddles[i];
				currentPaddle.y = mouse.y - currentPaddle.h/2;
			}		
		}
	}
*/
	// Move the ball
	ball.x += ball.vx;
	ball.y += ball.vy;
	
	// Collision with paddles
	p1 = hpaddles[1];
	p2 = hpaddles[2];
	p3 = vpaddles[1];
	p4 = vpaddles[2];
	
	// If the ball strikes with paddles,
	// invert the y-velocity vector of ball,
	// increment the points, play the collision sound,
	// save collision's position so that sparks can be
	// emitted from that position, set the flag variable,
	// and change the multiplier
	if(collides(ball, p1, 'horizontal')) {
		collideAction(ball, p1, 'horizontal');
	}
	
	
	else if(collides(ball, p2, 'horizontal')) {
		collideAction(ball, p2, 'horizontal');
	} 
	
	else if(collides(ball, p3, 'vertical')) {
		collideAction(ball, p3, 'vertical');
	}
	
	else if(collides(ball, p4, 'vertical')) {
		collideAction(ball, p4, 'vertical');
	}
	
	else {
		// Collide with walls, If the ball hits the top/bottom,
		// walls, run gameOver() function
		if(ball.y + ball.r > H) {
			ball.y = H - ball.r;
			gameOver();
		} 
		
		else if(ball.y < 0) {
			ball.y = ball.r;
			gameOver();
		}
		
		// If ball strikes the vertical walls, invert the 
		// x-velocity vector of ball
		if(ball.x + ball.r > W) {
			ball.vx = -ball.vx;
			ball.x = W - ball.r;
		}
		
		else if(ball.x -ball.r < 0) {
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
	
	
	
	// If flag is set, push the particles
	if(flag == 1) { 
		for(var k = 0; k < particlesCount; k++) {
			particles.push(new createParticles(particlePos.x, particlePos.y, multiplier));
		}
	}	
	
	// Emit particles/sparks
	emitParticles();
	
	// reset flag
	flag = 0;
}

//Function to check collision between ball and one of
//the paddles
function collides(b, p, orientation) {
	if(orientation == 'horizontal') {
		if(b.x + ball.r >= p.x && b.x - ball.r <=p.x + p.w) {
			if(b.y >= (p.y - p.h) && p.y > 0){
				paddleHit = 1;
				return true;
			}
			else if(b.y <= p.h && p.y == 0) {
				paddleHit = 2;
				return true;
			}
			else return false;
		}
	} else {
		if(b.y + ball.r >= p.y && b.y - ball.r <= p.y + p.h) {
			if(b.x >= (p.x - p.w) && p.x > 0){
				paddleHit = 1;
				return true;
			}
			else if(b.x <= p.w && p.x == 0) {
				paddleHit = 2;
				return true;
			}
			else return false;
		}
	}
}

//Do this when collides == true
function collideAction(ball, p, orientation) {
	if(orientation == 'horizontal') {
		ball.vy = -ball.vy;
	
		if(paddleHit == 1) {
			ball.y = p.y - p.h;
			particlePos.y = ball.y + ball.r;
			multiplier = -1;	
		}
	
		else if(paddleHit == 2) {
			ball.y = p.h + ball.r;
			particlePos.y = ball.y - ball.r;
			multiplier = 1;	
		}

		hpoints ++;
		points++;
		increaseSpd();
	
		if(collision) {

			if(points > 0) 
				collision.pause();
		
			collision.currentTime = 0;
			collision.play();
		}
	
		particlePos.x = ball.x;
		flag = 1;
	} else {
		ball.vx = -ball.vx;
	
		if(paddleHit == 1) {
			ball.x = p.x - p.w;
			particlePos.x = ball.x + ball.r;
			multiplier = -1;	
		}
	
		else if(paddleHit == 2) {
			ball.x = p.w + ball.r;
			particlePos.x = ball.x - ball.r;
			multiplier = 1;	
		}

		vpoints ++;	
		points ++;
		increaseSpd();
	
		if(collision) {
			if(points > 0) 
				collision.pause();
		
			collision.currentTime = 0;
			collision.play();
		}
	
		particlePos.y = ball.y;
		flag = 1;
	}
}

// Function for emitting particles
function emitParticles() { 
	for(var j = 0; j < particles.length; j++) {
		par = particles[j];
		
		ctx.beginPath(); 
		ctx.fillStyle = "white";
		if (par.radius > 0) {
			ctx.arc(par.x, par.y, par.radius, 0, Math.PI*2, false);
		}
		ctx.fill();	 
		
		par.x += par.vx; 
		par.y += par.vy; 
		
		// Reduce radius so that the particles die after a few seconds
		par.radius = Math.max(par.radius - 0.05, 0.0); 
		
	} 
}

// Updating scores
function updateScore() {
	ctx.fillStlye = "white";
	ctx.font = "16px Arial, sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

	ctx.fillText("Scores: " + hpoints + " | " + vpoints, 20, 20 );
//	ctx.fillText("Score: " + points, 20, 20 );
}

// Function to run when the game overs
function gameOver() {
	ctx.fillStlye = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over!", W/2, H/2 + 25 );

	if(hpoints > vpoints) {ctx.fillText("\n Horizontal player wins: " + hpoints + ":" + vpoints, W/2, H/2 + 50 );}
	if(vpoints > hpoints) {ctx.fillText("\n Vertical player wins: " + vpoints + ":" + hpoints, W/2, H/2 + 50 );}
	if(vpoints == hpoints) {ctx.fillText("\n It's a draw: " + vpoints + ":" + hpoints, W/2, H/2 + 50 );}
	
	// Stop the Animation
	cancelRequestAnimFrame(init);
	
	// Set the over flag
	over = 1;
	
	// Show the restart button
	restartBtn.draw();
}

// Function for running the whole animation
function animloop() {
	init = requestAnimFrame(animloop);
	draw();
}

// Function to execute at startup
function startScreen() {
	draw();
	startBtn.draw();
}

// On button click (Restart and start)
function startBtnClick(e) {
	
	initializeorientation();
	
	// Variables for storing mouse position on click
	var mx = e.pageX,
		my = e.pageY;
	
	// Click start button
	if(mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
		animloop();
		sendMyMessage(myOrientation, startGameMsg, 0, 0);
		// Delete the start button after clicking
		startBtn = {};
	}
	
	// If the game is over, and the restart button is clicked
	if(over == 1) {
		if(mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w) {
			ball.x = 20;
			ball.y = 20;
			points = 0;
			hpoints = 0;
			vpoints = 0;
			ball.vx = 4;
			ball.vy = 8;
			animloop();
			sendMyMessage(myOrientation, startGameMsg, 0, 0);
			over = 0;
		}
	}
}

// Show the start screen
startScreen();


//if our partner starts the game
function passiveStart() {
	startBtn = {};
	if(over == 1){
		over = 0;		
		ball.x = 20;
		ball.y = 20;
		points = 0;
		hpoints = 0;
		vpoints = 0;
		ball.vx = 4;
		ball.vy = 8;
	}
	animloop();
}

var canvasWidth = document.getElementById('canvas').width, canvasHeight = document.getElementById('canvas').height, step =0.1;

var horizontalStepInPixels = canvasHeight * step,
	verticalStepInPixels = canvasWidth * step;
var approximateMouseMove = [];

//var mouseMovePattern = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]];
var mouseMovePattern = [[0,0],[0,1]];

var mouseMoveIndex = 0, weAreHere = [];

var currentMode = false;

var canv = document.getElementById('canvas');

function mouseMoveOnCanvas(){
	var ev = ev || window.event;
	checkMouseMovePattern(ev.clientX, ev.clientY);
}