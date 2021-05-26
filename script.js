let canvas = document.getElementById('gameCanvas');
let canvasContext = canvas.getContext('2d');

/* checkerboard */
class CheckerBoard {
  constructor(checkerColor1, checkerColor2, checkerWidth, checkerHeight) {
    this.checkerColor1 = checkerColor1;
    this.checkerColor2 = checkerColor2;
    this.checkerWidth = checkerWidth;
    this.checkerHeight = checkerHeight;
    this.generateCheckeredPattern = function() {
      canvasContext.fillStyle = checkerColor1;
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      let switchInitializer = true;
      for (let y = 0; y < canvas.height; y += checkerHeight) {
        if (switchInitializer) {
          for (let x = 0; x < canvas.width; x += 2 * checkerWidth) {
            canvasContext.fillStyle = checkerColor2;
            canvasContext.fillRect(x, y, checkerHeight, checkerWidth);
          }
          switchInitializer = false;
        } else {
          for (let x = checkerWidth; x < canvas.width; x += 2 * checkerWidth) {
            canvasContext.fillStyle = checkerColor2;
            canvasContext.fillRect(x, y, checkerHeight, checkerWidth);
          }
          switchInitializer = true;
        }
      }
    };
  }
}

/* gamepiece */
class GamePiece {
  constructor(x_position, y_position) {
    this.x_position = x_position;
    this.y_position = y_position;
    this.showGamePiece = function() {
      canvasContext.fillStyle = '#ffa100';
      canvasContext.fillRect(x_position, y_position, 10, 10);
    };
  }
}

const gameBoard = new CheckerBoard('#005eff','#337eff', 20, 20);
gameBoard.generateCheckeredPattern();
const gamePiece = new GamePiece(canvas.width / 2, canvas.height / 2);
gamePiece.showGamePiece();