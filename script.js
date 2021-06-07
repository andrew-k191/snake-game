const canvas = document.getElementById('game-canvas');
const canvasContext = canvas.getContext('2d');

/* ----- Gameboard ----- */
class GameBoard {
  constructor(color1, color2, color3, boardWidth, boardHeight) {
    this.color1 = color1;
    this.color2 = color2;
    this.color3 = color3;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;

    this.checkerBoardPattern = function() {
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
    };
    
    this.gameBoardBorder = function() {
      canvasContext.strokeStyle = color3;
      canvasContext.strokeRect(0, 0, canvas.width, canvas.height);
    };
  }
}
const gameBoard = new GameBoard('#8ed728', '#7128d7', '#000', 20, 20);

/* ----- Snake ----- */
let snakeDirection = null;
let snakeBody = [];

class Snake {
  constructor() {
    const snakeXPosition = canvas.width / 4;
    const snakeYPosition = canvas.height / 2;
    const snakeWidth = 20;
    const snakeHeight = 20;

    this.generateSnakeBody = function() {
      for(let currentLink = 0; currentLink < 4; currentLink++) {
        snakeBody.push({x: snakeXPosition - (currentLink * snakeWidth), y: snakeYPosition});
      }
    };

    this.drawSnake = function() {
      canvasContext.strokeStyle = 'red';
      canvasContext.fillStyle = '#fbb104';
      snakeBody.forEach((snakeBodyLink) => {
        canvasContext.fillRect(snakeBodyLink.x, snakeBodyLink.y, snakeWidth, snakeHeight);
        canvasContext.strokeRect(snakeBodyLink.x, snakeBodyLink.y, snakeWidth, snakeHeight);
      });
    };

    this.moveSnake = function() {
      const snakeSpeed = 20;
      const head = {x: snakeBody[0].x, y: snakeBody[0].y};
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
      snakeBody.unshift(head);
      snakeBody.pop();
    };
  }
}
const snake = new Snake();
snake.generateSnakeBody();

/* ----- Apple ----- */



/* ----- Game Controls ----- */
function keyEventHandler(event) {
  const pausePlay = document.querySelector('[data-play-pause]');
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
        pausePlay.textContent = 'PAUSED';
      } 
      else {
        animation.resume();
        gameOn = true;
        pausePlay.textContent = 'PLAYING';
      }
      break;
  }
};

/* ----- disabling snake moving backwards ----- */
function disableReverseMotion(event) {
  switch (snakeDirection) {
    case null:
      if (event.key !== 'ArrowLeft') {
        keyEventHandler(event);
      }
      break;
    case 'right':
      if (event.key === 'ArrowLeft') {
        snakeDirection = 'right';
      } else {
        keyEventHandler(event);
      }
      break;
    case 'left':
      if (event.key === 'ArrowRight') {
        snakeDirection = 'left';
      } else {
        keyEventHandler(event);
      }
      break;
    case 'up':
      if (event.key === 'ArrowDown') {
        snakeDirection = 'up';
      } else {
        keyEventHandler(event);
      }
      break;
    case 'down':
      if (event.key === 'ArrowUp') {
        snakeDirection = 'down';
      } else {
        keyEventHandler(event);
      }
      break;
  }
}

// function keyEventHandler(event) {
//   const eventKey = event.key;
//   if (eventKey === 'ArrowRight' || eventKey === 'ArrowLeft') {

//   }
// }


// /* ----- Pause/Play ----- */
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

/* ----- game at each frame ----- */
function drawFrame() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  gameBoard.checkerBoardPattern();
  gameBoard.gameBoardBorder();

  snake.drawSnake();
  snake.moveSnake();
}

/* ----- Animation ----- */
const animation = new IntervalTimer(drawFrame, 400);

let gameOn = true;
window.addEventListener('load', function() {
  drawFrame(gameBoard, snake);
  document.addEventListener('keydown', disableReverseMotion);
});













/* ----- Gameboard ----- */
// function drawGameBoard(color1, color2, color3, boardWidth, boardHeight) {
//   canvasContext.fillStyle = color1;
//   canvasContext.fillRect(0, 0, canvas.width, canvas.height);
//   let alternateRowColorPattern = true;
//   for (let y = 0; y < canvas.height; y += boardHeight) {
//     if (alternateRowColorPattern) {
//       for (let x = 0; x < canvas.width; x += 2 * boardWidth) {
//         canvasContext.fillStyle = color2;
//         canvasContext.fillRect(x, y, boardWidth, boardHeight);
//       }
//       alternateRowColorPattern = false;
//     } else {
//       for (let x = boardWidth; x < canvas.width; x += 2 * boardWidth) {
//         canvasContext.fillStyle = color2;
//         canvasContext.fillRect(x, y, boardWidth, boardHeight);
//       }
//       alternateRowColorPattern = true;
//     }
//   }
//   canvasContext.strokeStyle = color3;
//   canvasContext.strokeRect(0, 0, canvas.width, canvas.height);
// }

/* ----- Snake ----- */
// const snakeXPosition = canvas.width / 4;
// const snakeYPosition = canvas.height / 2;
// const snakeWidth = 20;
// const snakeHeight = 20;
// let snakeDirection = '';

// let snake = [];
// for (let currentLink = 0; currentLink < 4; currentLink++) {
//   snake.push({x: snakeXPosition - (currentLink * snakeWidth), y: snakeYPosition});
// }

// function drawSnake() {
//   canvasContext.strokeStyle = 'red';
//   canvasContext.fillStyle = '#fbb104';
//   snake.forEach((snakeLink) => {
//     canvasContext.fillRect(snakeLink.x, snakeLink.y, snakeWidth, snakeHeight);
//     canvasContext.strokeRect(snakeLink.x, snakeLink.y, snakeWidth, snakeHeight);
//   });
// }

// function moveSnake() {
//   const snakeSpeed = 20;
//   const head = {x: snake[0].x, y: snake[0].y};
//   switch (snakeDirection) {
//     case 'right':
//       head.x += snakeSpeed;
//       break;
//     case 'left':
//       head.x -= snakeSpeed;
//       break;
//     case 'up':
//       head.y -= snakeSpeed;
//       break;
//     case 'down':
//       head.y += snakeSpeed;
//       break;
//   }
//   snake.unshift(head);
//   snake.pop();
// }

// function drawFrame() {
//   canvasContext.clearRect(0, 0, canvas.width, canvas.height);
//   gameBoard('#8ed728', '#7128d7', '#000', 20, 20);

//   moveSnake();
//   drawSnake();
// }



/* ----- Animation ----- */
// function drawFrame() {
//   // canvasContext.clearRect(0, 0, canvas.width, canvas.height);
//   drawGameBoard('#8ed728', '#7128d7', '#000', 20, 20);
//   drawSnake();
//   moveSnake();
// }

