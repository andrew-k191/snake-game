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

    this.checkeredPattern = function () {
      canvasContext.fillStyle = this.color1;
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      let alternateRowColorPattern = true;
      for (let y = 0; y < canvas.height; y += this.boardHeight) {
        if (alternateRowColorPattern) {
          for (let x = 0; x < canvas.width; x += 2 * this.boardWidth) {
            canvasContext.fillStyle = this.color2;
            canvasContext.fillRect(x, y, this.boardWidth, this.boardHeight);
          }
          alternateRowColorPattern = false;
        } else {
          for (
            let x = this.boardWidth;
            x < canvas.width;
            x += 2 * this.boardWidth
          ) {
            canvasContext.fillStyle = this.color2;
            canvasContext.fillRect(x, y, this.boardWidth, this.boardHeight);
          }
          alternateRowColorPattern = true;
        }
      }
    };

    this.border = function () {
      canvasContext.lineWidth = 3;
      canvasContext.strokeStyle = this.color3;
      canvasContext.strokeRect(0, 0, canvas.width, canvas.height);
    };
  }
}
const gameBoard = new GameBoard();

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

    this.createBody = function () {
      for (let index = 0; index <= 3; index++) {
        snakeBody.push({
          x: this.snakeXPosition - index * this.snakeWidth,
          y: this.snakeYPosition,
        });
      }
    };

    this.face = function () {
      const head = { x: snakeBody[0].x, y: snakeBody[0].y };
      canvasContext.lineWidth = 1;
      // snake mouth
      canvasContext.beginPath();
      canvasContext.strokeStyle = '#000';
      canvasContext.moveTo(
        head.x + this.snakeWidth / 2,
        head.y + this.snakeHeight / 2
      );
      canvasContext.lineTo(
        head.x + this.snakeWidth,
        head.y + this.snakeHeight / 2
      );
      canvasContext.stroke();

      canvasContext.beginPath();
      canvasContext.strokeStyle = '#000';
      canvasContext.moveTo(
        head.x + this.snakeWidth / 2,
        head.y + this.snakeHeight / 3
      );
      canvasContext.lineTo(
        head.x + this.snakeWidth / 2,
        head.y + (2 * this.snakeHeight) / 3
      );
      canvasContext.stroke();
      // snake eye
      canvasContext.lineWidth = 2;
      canvasContext.beginPath();
      canvasContext.strokeStyle = '#000';
      canvasContext.moveTo(head.x + (3 * this.snakeWidth) / 4, head.y + 3);
      canvasContext.lineTo(head.x + (3 * this.snakeWidth) / 4, head.y + 5);
      canvasContext.stroke();
    };

    this.draw = function () {
      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = '#005bff';
      canvasContext.fillStyle = '#337cff';
      snakeBody.forEach((link) => {
        canvasContext.fillRect(
          link.x,
          link.y,
          this.snakeWidth,
          this.snakeHeight
        );
        canvasContext.strokeRect(
          link.x,
          link.y,
          this.snakeWidth,
          this.snakeHeight
        );
      });
      this.face();
    };

    this.move = function () {
      if (snakeMovementAllowed) {
        const status = document.querySelector('.status');
        status.classList.add('playing');
        status.textContent = 'PLAYING';
        const speed = 20;
        const head = { x: snakeBody[0].x, y: snakeBody[0].y };
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

    this.foodLocation = function () {
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
      for (
        let yCoordinate = 0;
        yCoordinate < canvas.height;
        yCoordinate += 20
      ) {
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
      foodXCoordinate =
        xCoordinateArray[Math.floor(Math.random() * xCoordinateArray.length)];
      foodYCoordinate =
        yCoordinateArray[Math.floor(Math.random() * yCoordinateArray.length)];
    };

    this.draw = function () {
      if (foodConsumed) {
        // food move to different random location
        this.foodLocation();
        canvasContext.drawImage(
          apple,
          foodXCoordinate,
          foodYCoordinate,
          this.foodWidth,
          this.foodHeight
        );
      } else {
        // food stays in current location
        canvasContext.drawImage(
          apple,
          foodXCoordinate,
          foodYCoordinate,
          this.foodWidth,
          this.foodHeight
        );
      }
    };

    this.checkFood = function () {
      if (
        snakeBody[0].x === foodXCoordinate &&
        snakeBody[0].y === foodYCoordinate
      ) {
        const gameScore = document.querySelector('.game-score');
        foodConsumed = true;
        score++;
        gameScore.textContent = score;
        this.draw();
      } else {
        this.draw();
      }
    };
  }
}
const food = new Food();

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
  }
}

function snakeMotion(event) {
  switch (snakeDirection) {
    case null:
      if (event.key !== 'ArrowLeft') {
        keyEventHandler(event);
        snakeMovementAllowed = true;
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

/* ----- Game Over Scenarios ----- */
function checkIfSnakeTouchesItself() {
  if (snakeBody.length >= 5) {
    // snake needs to be at minimum 5 links long before it can touch itself
    const snakeHead = [snakeBody[0].x, snakeBody[0].y];
    const remainingSnakeBody = [];
    let snakeTouchesItself = false;
    for (let link = 4; link < snakeBody.length; link++) {
      remainingSnakeBody.push([snakeBody[link].x, snakeBody[link].y]);
    }
    remainingSnakeBody.forEach((link) => {
      if (link[0] === snakeHead[0] && link[1] === snakeHead[1]) {
        snakeTouchesItself = true;
      }
    });
    if (snakeTouchesItself) {
      const status = document.querySelector('.status');
      status.classList.add('game-over');
      status.textContent = 'GAME OVER!!';
      clearInterval(animation);
    }
  }
}

function checkIfSnakeHitsWall() {
  const snakeHead = [snakeBody[0].x, snakeBody[0].y];
  const status = document.querySelector('.status');
  if (snakeHead[0] < 0 || snakeHead[0] >= canvas.width) {
    status.classList.add('game-over');
    status.textContent = 'GAME OVER!!';
    clearInterval(animation);
  }
  if (snakeHead[1] < 0 || snakeHead[1] >= canvas.height) {
    status.classList.add('game-over');
    status.textContent = 'GAME OVER!!';
    clearInterval(animation);
  }
}

/* ----- frame by frame snapshot of game ----- */
function drawFrame() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  gameBoard.checkeredPattern();
  gameBoard.border();
  food.checkFood();
  snake.move();
  snake.draw();
}

/* ----- Snake Game ----- */
function snakeGame() {
  drawFrame();
  checkIfSnakeTouchesItself();
  checkIfSnakeHitsWall();
  if (foodConsumed) {
    foodConsumed = false;
  }
}

/* ----- Animation ----- */
const animation = setInterval(snakeGame, 125);

let score = 0;
window.addEventListener('load', function () {
  snakeGame();
  document.addEventListener('keydown', snakeMotion);
});
