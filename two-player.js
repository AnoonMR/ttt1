// 2 Player Tic-Tac-Toe (no AI)

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");
const homeBtn = document.getElementById("home-btn");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameOver = false;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// add listeners
cells.forEach((cell) => {
  cell.addEventListener("click", onCellClick);
});

resetBtn.addEventListener("click", resetGame);
homeBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

function onCellClick(e) {
  const index = parseInt(e.target.getAttribute("data-index"), 10);

  if (isGameOver || board[index] !== "") {
    return;
  }

  board[index] = currentPlayer;
  updateBoardUI();

  const winner = checkWinner(board);
  if (winner) {
    endGame(winner);
    return;
  }

  if (isBoardFull(board)) {
    endGame(null);
    return;
  }

  // switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

function updateBoardUI() {
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
    if (board[index] !== "") {
      cell.classList.add("taken");
    }
  });
}

function updateStatus() {
  if (isGameOver) return;
  statusText.textContent = `Turn: ${currentPlayer}`;
}

function checkWinner(b) {
  for (let pattern of winPatterns) {
    const [a, c, d] = pattern;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      // highlight winning cells
      pattern.forEach((i) => cells[i].classList.add("win"));
      return b[a];
    }
  }
  return null;
}

function isBoardFull(b) {
  return b.every((cell) => cell !== "");
}

function endGame(winner) {
  isGameOver = true;
  if (winner) {
    statusText.textContent = `Game Over: ${winner} wins!`;
  } else {
    statusText.textContent = "Game Over: It's a draw!";
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameOver = false;

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken", "win");
  });

  statusText.textContent = "Turn: X";
}

// initial
updateStatus();
