const canvas = document.getElementById('game-canvas');
const canvasContext = canvas.getContext('2d');

/* ----- Gameboard ----- */
function drawGameBoard(color1, color2, boardWidth, boardHeight) {
  canvasContext.fillStyle = color1;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  let alternateRowColorPattern = true;
  for (let y = 0; y < canvas.height; y += boardHeight) {
    if (alternateRowColorPattern) {
      for (let x = 0; x < canvas.width; x += 2 * boardWidth) {
        canvasContext.fillStyle = color2;
        canvasContext.fillRect(x, y, boardWidth, boardHeight);
      }
      alternateRowColorPattern = false;
    } else {
      for (let x = boardWidth; x < canvas.width; x += 2 * boardWidth) {
        canvasContext.fillStyle = color2;
        canvasContext.fillRect(x, y, boardWidth, boardHeight);
      }
      alternateRowColorPattern = true;
    }
  }
}

/* ----- Snake ----- */
let snakeXPosition = canvas.width / 2;
let snakeYPosition = canvas.height / 2;
const snakeWidth = 20;
const snakeHeight = 20;
let pixelRate = 5; 

let snakeBody = [
  {x: snakeYPosition, y: snakeYPosition},
  {x: (snakeXPosition - snakeWidth), y: snakeYPosition},
  {x: (snakeXPosition - 2 * snakeWidth), y: snakeYPosition}
];

function drawSnake() {
  canvasContext.strokeStyle = '#000000';
  canvasContext.fillStyle = '#fbb104';
  for (let link of snakeBody) {
    canvasContext.fillRect(link.x, link.y, snakeWidth, snakeHeight);
    canvasContext.strokeRect(link.x, link.y, snakeWidth, snakeHeight);
  }
}

window.addEventListener('load', function() {
  drawGameBoard('#8ed728', '#7128d7', 20, 20);
  drawSnake();
});






/* Kinematic Equation of Motion */
// x_final = x_initial + v * t 

// /* game timestamp */
// let timeStamp = 0;

// /* snake positions */
// let x_initial = canvas.width / 2;
// let y_initial = canvas.height / 2;
// let x_final = null;
// let y_final = null;
// /* snake rate of movement */
// let pixelRate = 5;


// function drawSnake(x, y, width, height, color) {
//   canvasContext.fillStyle = color;
//   canvasContext.fillRect(x, y, width, height);
// }

// document.addEventListener('keydown', keyDownHandler, false);
// document.addEventListener('keyup', keyUpHandler, false);

// let rightPressed = false;
// let leftPressed = false;
// let upPressed = false;
// let downPressed = false; 

// function keyDownHandler(event) {
//   if (event.key === 'ArrowRight')
//     rightPressed = true;
//   else if (event.key === 'ArrowLeft')
//     leftPressed = true;
//   if (event.key === 'ArrowDown')
//     downPressed = true;
//   else if (event.key === 'ArrowUp')
//     upPressed = true;
// }

// function keyUpHandler(event) {
//   if (event.key === 'ArrowRight')
//     rightPressed = false;
//   else if (event.key === 'ArrowLeft')
//     leftPressed = false;
//   if (event.key === 'ArrowDown')
//     downPressed = false;
//   else if (event.key === 'ArrowUp')
//     upPressed = false; 
// }

// function drawFrame() {
//   canvasContext.clearRect(0, 0, canvas.width, canvas.height);
//   if (rightPressed)
//     snakeXPosition += pixelRate;
//   else if (leftPressed)
//     snakeXPosition -= pixelRate;
//   if (downPressed)
//     snakeYPosition += pixelRate;
//   else if (upPressed) 
//     snakeYPosition -= pixelRate;

//   generateCheckerboard('#44bb55', '#69c977', 20, 20);
//   drawSnake(snakeXPosition, snakeYPosition, 20, 20, 'blue');
//   requestAnimationFrame(drawFrame);
// }













// /* Snake */
// function drawSnake(x, y, width, height, color) {
//   canvasContext.fillStyle = color;
//   canvasContext.fillRect(x, y, width, height);
// }

// function drawFrame() {
//   canvasContext.clearRect(0, 0, canvas.width, canvas.height);
//   /* gameboard */
//   generateCheckerboard('#44bb55', '#69c977', 20, 20);
  
//   /* draw snake */
//   drawSnake(x_initial, y_initial, 20, 20, 'blue');
//   console.log(x_final);
// }

// function drawAnimation() {
//   // check if the game has just started, i.e. if timestamp is falsy
//   if (!timeStamp) {
//     drawFrame();
//     timeStamp++;
//   } else {
//     x_final = x_initial + pixelRate;
//     drawFrame();
//     timeStamp++;
//     x_initial = x_final;
//   }
// }

// function movement(keyEvent) {
//   switch (keyEvent.key) {
//     case 'ArrowUp':
//       // snake moves up on this keyEvent
//       break;
//     case 'ArrowDown':
//       // snake moves down on this keyEvent
//       break;
//     case 'ArrowRight':
//       // snake moves right on this keyEvent
//       // clearInterval(drawAnimation);
//       pixelRate = Math.abs(pixelRate);
//       setInterval(function() {
//         drawAnimation();
//       }, 1000 / 60);
//       // The current position should change at some rate (number of pixels per second)
      
//       // repeat until another keyEvent is invoked
//       break;
//     case 'ArrowLeft':
//       // snake moves left on this keyEvent
//       // clearInterval(drawAnimation);
//       pixelRate = -pixelRate;
//       // setInterval(function() {
//       //   currentSnakeXPosition -= changeInSnakePosition;
//       //   snakeAnimation();
//       // }, timeInterval/framesPerSecond);
//       break; 
//   }
// }





