// More concise, to the point snake game
const canvas = document.querySelector('#game-canvas');
const canvasContext = canvas.getContext('2d');

/* ----- GameBoard ----- */
class GameBoard {
  constructor() {
    this.color1 = '#87c23d';
    this.color2 = '#9fce64';
    this.color3 = '#9364ce';
    this.boardWidth = 20;
    this.boardHeight = 20;

    this.checkeredPattern = function() {
      canvasContext.fillStyle = this.color1;
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      let alternateRowColorPattern = true;
      for (let y = 0; y < canvas.height; y += this.boardHeight) {
        if (alternateRowColorPattern) {
          for (let x = 0; x < canvas.width; x += (2 * this.boardWidth)) {
            canvasContext.fillStyle = this.color2;
            canvasContext.fillRect(x, y, this.boardWidth, this.boardHeight);
          }
          alternateRowColorPattern = false;
        } 
        else {
          for (let x = this.boardWidth; x < canvas.width; x += (2 * this.boardWidth)) {
            canvasContext.fillStyle = this.color2;
            canvasContext.fillRect(x, y, this.boardWidth, this.boardHeight);
          }
          alternateRowColorPattern = true;
        }
      }
    };

    this.border = function() {
      canvasContext.lineWidth = 3;
      canvasContext.strokeStyle = this.color3;
      canvasContext.strokeRect(0, 0, canvas.width, canvas.height);
    };
  }
}
const gameBoard = new GameBoard();
gameBoard.checkeredPattern();
gameBoard.border();


/* ----- Snake ----- */
let snakeDirection = null;
let snakeMovementAllowed = false;
let snakeBody = [];

class Snake {
  constructor() {
    this.snakeXPosition = canvas.width / 4;
    this.snakeYPosition = canvas.height / 2;
    this.snakeWidth = 20;
    this.snakeHeight = 20;

    this.createBody = function() {
      for (let index = 0; index <= 3; index++) {
        snakeBody.push({x: this.snakeXPosition - (index * this.snakeWidth), y: this.snakeYPosition});
      }
    };

    this.draw = function() {
      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = '#005bff';
      canvasContext.fillStyle = '#337cff';
      snakeBody.forEach((link) => {
        canvasContext.fillRect(link.x, link.y, this.snakeWidth, this.snakeHeight);
        canvasContext.strokeRect(link.x, link.y, this.snakeWidth, this.snakeHeight);
      });
    };

    this.move = function() {
      if (snakeMovementAllowed) {
        const speed = 20;
        const head = {x: snakeyBody[0].x, y: snakeBody[0].y};
        switch (snakeDirection) {
          case 'right':
            head.x += speed;
            break;
          case 'left':
            head.x -= speed;
            break;
          case 'up':
            head.y -= speed;
            break;
          case 'down':
            head.y += speed;
            break;
        }
        snakeBody.unshift(head);
        if (!foodConsumed) {
          snakeBody.pop();
        }
      }
    };
  }
}
const snake = new Snake();
snake.createBody();
snake.draw();

/* ----- Food ----- */
let foodConsumed = false;
let foodXCoordinate = 3 * (canvas.width / 4);
let foodYCoordinate = canvas.height / 2;

class Food {
  constructor() {
    const apple = document.createElement('img');
    apple.src = 'images/apple.png';
    this.foodWidth = 20;
    this.foodHeight = 20;

    this.foodLocation = function() {
      const snakeBodyX = [];
      const snakeBodyY = [];
      snakeBody.forEach((link) => {
        snakeBodyX.push(link.x);
        snakeBodyY.push(link.y);
      });

      const xCoordinateArray = [];
      for (let xCoordinate = 0; xCoordinate < canvas.width; xCoordinate += 20) {
        xCoordinateArray.push(xCoordinate);
      }
      const yCoordinateArray = [];
      for (let yCoordinate = 0; yCoordinate < canvas.height; yCoordinate += 20) {
        yCoordinateArray.push(yCoordinate);
      }

      // filtering out x and y snake coordinates as possible locations to place food
      snakeBodyX.forEach((xValue) => {
        if (xCoordinateArray.indexOf(xValue) !== -1) {
          xCoordinateArray.splice(xCoordinateArray.indexOf(xValue), 1);
        }
      });
      snakeBodyY.forEach((yValue) => {
        if (yCoordinateArray.indexOf(yValue) !== -1) {
          yCoordinateArray.splice(yCoordinateArray.indexOf(yValue), 1);
        }
      });
      foodXCoordinate = xCoordinateArray[Math.floor(Math.random() * xCoordinateArray.length)];
      foodYCoordinate = yCoordinateArray[Math.floor(Math.random() * yCoordinateArray.length)];
    };

    this.draw = function() {
      if (foodConsumed) {
        // food move to different random location
        this.foodLocation();
        canvasContext.drawImage(apple, foodXCoordinate, foodYCoordinate, this.foodWidth, this.foodHeight);
      } 
      else {
        // food stays in current location
        canvasContext.drawImage(apple, foodXCoordinate, foodYCoordinate, this.foodWidth, this.foodHeight);
      }
    };
  }
}
const food = new Food();

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

/* ----- Game Controls ----- */
class GameControls {
  constructor() {
    this.keyEventHandler = function(event) {
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

    this.snakeMotion = function(event) {
      switch (snakeDirection) {
        case null:
          if (event.key !== 'ArrowLeft') {
            this.keyEventHandler(event);
          }
          break;
        case 'right':
          if (event.key === 'ArrowLeft') {
            snakeDirection = 'right';
          }
          else {
            this.keyEventHandler(event);
          }
          break;
        case 'left':
          if (event.key === 'ArrowRight') {
            snakeDirection = 'left';
          } 
          else {
            this.keyEventHandler(event);
          }
          break;
        case 'up':
          if (event.key === 'ArrowDown') {
            snakeDirection = 'up';
          }
          else {
            this.keyEventHandler(event);
          }
          break;
        case 'down':
          if (event.key === 'ArrowUp') {
            snakeDirection = 'down';
          }
          else {
            this.keyEventHandler(event);
          }
          break;
      }
    };
  }
}


class SnakeGame {
  constructor() {

  }
}
// window.addEventListener('load', function() {
//   food.draw()
// });
