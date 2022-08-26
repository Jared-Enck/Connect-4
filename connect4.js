/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const pP1 = document.getElementById("pP1");
const pP2 = document.getElementById("pP2");
const startBtn = document.querySelector("#start")

class Game {
  constructor(height, width) {
    this.board = [];
    this.height = height;
    this.width = width;
    startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.startGame();
      this.p1 = new Player(document.getElementById("p1").value);
      this.p2 = new Player(document.getElementById("p2").value);
      this.currPlayer = this.p1;
    });
  }
  startGame() {
    pP1.classList.add("currPlayer");
    startBtn.addEventListener('click', ()=>{
      window.location.reload();
    })
    this.makeBoard();
    this.makeHtmlBoard();
  }
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }
  makeHtmlBoard() {
    const game = document.createElement("div");
    game.setAttribute("id", "game");
    document.body.appendChild(game);
    const table = document.createElement("table");
    table.setAttribute("id", "board");
    game.appendChild(table);
    const board = document.getElementById("board");
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener("click", this.handleGameClick);
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    board.append(top);
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add("drop-in");
    piece.style.backgroundColor = this.currPlayer.color;
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg) {
    const end = document.createElement("div");
    const endGameBanner = document.querySelector("section");
    end.classList.add("end");
    endGameBanner.appendChild(end);
    const winMsg = document.createElement("h1");
    winMsg.setAttribute("id", "winMsg");
    winMsg.innerHTML = msg;
    end.prepend(winMsg);
    const restart = document.createElement("button");
    restart.classList.add("restart");
    restart.innerHTML = "New Game";
    restart.addEventListener("click", () => {
      window.location.reload();
    });
    end.appendChild(restart);
  }
  togglePlayer() {
    if (this.currPlayer === this.p1) {
      pP1.classList.remove("currPlayer");
      pP2.classList.add("currPlayer");
    } else {
      pP2.classList.remove("currPlayer");
      pP1.classList.add("currPlayer");
    }
  }
  handleClick(evt) {
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    if (this.checkForWin()) {
      this.currPlayer === this.p1 ?
       this.endGame(`Player 1 wins!`): this.endGame(`Player 2 wins!`);
    }
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }
    if (!this.checkForWin()){
    this.togglePlayer();
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
    }
  }
  checkForWin() {
    const _win = (cells) => {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

new Game(6, 7);
