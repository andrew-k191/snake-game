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
const gameBoard = new GameBoard('#87c23d', '#9fce64', '#000', 20, 20);
gameBoard.checkerBoardPattern();
gameBoard.gameBoardBorder();

/* ----- Snake ----- */
let snakeDirection = null;
let snakeMovementPermitted = false;
let snakeBody = [];

class Snake {
  constructor() {
    const snakeXPosition = canvas.width / 4;
    const snakeYPosition = canvas.height / 2;
    const snakeWidth = 20;
    const snakeHeight = 20;

    this.generateSnakeBody = function() {
      for(let currentLink = 0; currentLink <= 3; currentLink++) {
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
      // canvasContext.strokeRect(snakeBody[0].x, snakeBody[0].y, (snakeWidth * snakeBody.length), snakeHeight);
    };

    this.moveSnake = function() {
      if (snakeMovementPermitted) {
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
        if (!appleConsumed) {
          snakeBody.pop();
        }
      }
    }
  }
}
const snake = new Snake();
snake.generateSnakeBody();
snake.drawSnake();

/* ----- Apple ----- */
let appleConsumed = false;
let appleXCoordinate = 3 * (canvas.width / 4);
let appleYCoordinate = canvas.height / 2;

class Apple {
  constructor() {
    const appleImg = document.createElement('img');
    appleImg.src = 'images/black_spade.png';
    const appleWidth = 20;
    const appleHeight = 20;
    
    this.generateAppleCoordinates = function() {
      const snakeBodyXCopy = [];
      const snakeBodyYCopy = [];
      snakeBody.forEach((snakeBodyLink) => {
        snakeBodyXCopy.push(snakeBodyLink.x);
        snakeBodyYCopy.push(snakeBodyLink.y);
      });

      const xArray = [];
      for (let coordinate = 0; coordinate < canvas.width; coordinate += 20) {
        xArray.push(coordinate);
      }
      const yArray = [];
      for (let coordinate = 0; coordinate < canvas.height; coordinate += 20) {
        yArray.push(coordinate);
      }
      // filtering x and y snake coordinates out as possible locations to place apple
      snakeBodyXCopy.forEach((xValue) => {
        if (xArray.indexOf(xValue) !== -1) {
          xArray.splice(xArray.indexOf(xValue), 1);
        }
      });
      snakeBodyYCopy.forEach((yValue) => {
        if (yArray.indexOf(yValue) !== -1) {
          yArray.splice(yArray.indexOf(yValue), 1);
        }
      });
      appleXCoordinate = xArray[Math.floor(Math.random() * xArray.length)];
      appleYCoordinate = yArray[Math.floor(Math.random() * yArray.length)];
      // const randomXPosition = xArray[Math.floor(Math.random() * xArray.length)];
      // const randomYPosition = yArray[Math.floor(Math.random() * yArray.length)];

    };
    
    this.drawApple = function() {
      if (appleConsumed) {
        // apple's x and y coordinates are allowed to change
        this.generateAppleCoordinates();
        canvasContext.drawImage(appleImg, appleXCoordinate, appleYCoordinate, appleWidth, appleHeight);
        // appleConsumed = false;
      } else {
        // apple's x and y coordinates are to remain the same
        canvasContext.drawImage(appleImg, appleXCoordinate, appleYCoordinate, appleWidth, appleHeight);
      }
    }

    this.checkIfAppleConsumed = function() {
      // when apple is consumed by snake
      if ((snakeBody[0].x === appleXCoordinate) && (snakeBody[0].y === appleYCoordinate)) {
        const scoreBoard = document.querySelector('[data-score-board]');
        appleConsumed = true;
        score += 1;
        scoreBoard.textContent = score;
        this.drawApple();
      } else {
        this.drawApple();
      }
    }
  };
}
const apple = new Apple();


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



// if snake touches itself
// function checkIfSnakeTouchesItself() {
//   if (snakeBody.length >= 5) {
//     // snake needs to be at minimum 5 links long before it can touch itself 
//     const snakeHead = [snakeBody[0].x, snakeBody[0].y];
//     const remainingSnakeBody = [];
//     let snakeTouchesItself = false;
//     for (let link = 4; link < snakeBody.length; link++) {
//       remainingSnakeBody.push([snakeBody[link].x, snakeBody[link].y]);
//     }
//     remainingSnakeBody.forEach((link) => {
//       if ((link[0] === snakeHead[0]) && (link[1] === snakeHead[1])) {
//         snakeTouchesItself = true;
//       }
//     });
//     if (snakeTouchesItself) {
//       console.log('Snake touches itself!!!');
//     }
//   }
  // const snakeHead = {x: snakeBody[0].x, y: snakeBody[0].y};

  // const remainingSnakeBody = [];
  // for (let link = 1; link < snakeBody.length; link++) {
  //   remainingSnakeBody.unshift(snakeBody[link]);
  // }
  // // check if any of the remaining links of snakeBody equals snakeHead
  // let duplicateXCount = 0;
  // let duplicateYCount = 0;
  // remainingSnakeBody.forEach(remainingSnakeBodyLink => {
  //   if (remainingSnakeBodyLink.x === snakeHead.x) {
  //     duplicateXCount++;
  //   } 
  //   if (remainingSnakeBodyLink.y === snakeHead.y) {
  //     duplicateYCount++;
  //   }
  // });
  // if (duplicateXValue >= 5) duplicateYValue) {
  //   console.log('Snake touches wall! Game Over!');
  // }  
// }


/* ----- game at each frame ----- */
// function drawFrame() {
//   canvasContext.clearRect(0, 0, canvas.width, canvas.height);
//   gameBoard.checkerBoardPattern();
//   gameBoard.gameBoardBorder();
  
//   apple.drawApple();
//   // apple.checkIfAppleConsumed();
//   snake.drawSnake();
//   // snake.moveSnake();
//   // checkIfSnakeTouchesItself();
//   if (appleConsumed) {
//     appleConsumed = false;
//   }
// }

/* ----- Animation ----- */
// const animation = new IntervalTimer(drawFrame, 300);

// let gameOn = true;
// let score = 0;
// window.addEventListener('load', function() {
//   drawFrame();
//   // document.addEventListener('keydown', function(e) {
//   //   snakeMovementPermitted = true;
//   //   disableReverseMotion(e);
//   // });
// });

