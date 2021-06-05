const canvas = document.getElementById('game-canvas');
const canvasContext = canvas.getContext('2d');

/* ----- Gameboard ----- */
function drawGameBoard(color1, color2, color3, boardWidth, boardHeight) {
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
  // gameboard border
  canvasContext.strokeStyle = color3;
  canvasContext.strokeRect(0, 0, canvas.width, canvas.height);
}

/* ----- Snake ----- */
const snakeXPosition = canvas.width / 4;
const snakeYPosition = canvas.height / 2;
const snakeWidth = 20;
const snakeHeight = 20;
let snakeDirection = '';

// generating snake
let snake = [];
for (let currentLink = 0; currentLink < 4; currentLink++) {
  snake.push({x: snakeXPosition - (currentLink * snakeWidth), y: snakeYPosition});
}

function drawSnake() {
  canvasContext.strokeStyle = 'red';
  canvasContext.fillStyle = '#fbb104';
  snake.forEach((snakeLink) => {
    canvasContext.fillRect(snakeLink.x, snakeLink.y, snakeWidth, snakeHeight);
    canvasContext.strokeRect(snakeLink.x, snakeLink.y, snakeWidth, snakeHeight);
  });
}

function moveSnake() {
  const snakeSpeed = 20;
  const head = {x: snake[0].x, y: snake[0].y};
  switch (snakeDirection) {
    case 'right':
      head.x += snakeSpeed;
      break;
    case 'left':
      head.x -= snakeSpeed;
      break;
    case 'up':
      head.y -= snakeSpeed;
      break;
    case 'down':
      head.y += snakeSpeed;
      break;
  }
  snake.unshift(head);
  snake.pop();
}

function drawFrame() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  drawGameBoard('#8ed728', '#7128d7', '#000', 20, 20);
  moveSnake();
  drawSnake();
}

/* ----- Game Controls ----- */
function keyEventHandler(event) {
  switch (event.key) {
    case 'ArrowRight':
      snakeDirection = 'right';
      break;
    case 'ArrowLeft':
      snakeDirection = 'left';     
      break;
    case 'ArrowUp':
      snakeDirection = 'up';
      break;
    case 'ArrowDown':
      snakeDirection = 'down';
      break;
    case ' ':
      if (gameOn) {
        animation.pause();
        gameOn = false;
      } 
      else {
        animation.resume();
        gameOn = true;
      }
      break;
  }
};

/* ----- Pause/Play ----- */
class IntervalTimer {
  constructor(callback, delay) {
    let timerId;
    let start;
    let remaining = delay;

    this.pause = function () {
      window.clearTimeout(timerId);
      remaining -= new Date() - start;
    };

    let resume = function() {
      start = new Date();
      timerId = window.setTimeout(function() {
        remaining = delay;
        resume();
        callback();
      }, remaining);
    };
    
    this.resume = resume;
    this.resume();
  }
}
const animation = new IntervalTimer(drawFrame, 400);

/* ----- Animation ----- */
function drawFrame() {
  // canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  drawGameBoard('#8ed728', '#7128d7', '#000', 20, 20);
  drawSnake();
  moveSnake();
}

let gameOn = true;
window.addEventListener('load', function() {
  drawGameBoard('#8ed728', '#7128d7', '#000', 20, 20);
  drawSnake(); 

  document.addEventListener('keydown', keyEventHandler);
});









