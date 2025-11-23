// Tic-Tac-Toe vs AI using Minimax

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");
const homeBtn = document.getElementById("home-btn");
const aiDetails = document.getElementById("ai-details");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // human always starts
let isGameOver = false;

const humanPlayer = "X";
const aiPlayer = "O";

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

// event listeners
cells.forEach((cell) => {
  cell.addEventListener("click", onCellClick);
});

resetBtn.addEventListener("click", resetGame);
homeBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

function onCellClick(e) {
  const index = parseInt(e.target.getAttribute("data-index"), 10);

  if (isGameOver || board[index] !== "") return;

  // human can play only when it's X's turn
  if (currentPlayer !== humanPlayer) return;

  // Human move
  makeMove(index, humanPlayer);

  const winner = checkWinner(board);
  if (winner) {
    endGame(winner);
    return;
  }

  if (isBoardFull(board)) {
    endGame(null);
    return;
  }

  currentPlayer = aiPlayer;
  updateStatus("AI is thinking (Minimax)...");
  
  // small delay so it looks more natural
  setTimeout(aiMove, 300);
}

function makeMove(index, player) {
  board[index] = player;
  updateBoardUI();
}

function updateBoardUI() {
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
    if (board[index] !== "") {
      cell.classList.add("taken");
    }
  });
}

function updateStatus(message) {
  if (message) {
    statusText.textContent = message;
    return;
  }
  if (!isGameOver) {
    statusText.textContent =
      currentPlayer === humanPlayer ? "Your turn (X)" : "AI's turn (O)";
  }
}

function checkWinner(b) {
  for (let pattern of winPatterns) {
    const [a, c, d] = pattern;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      // highlight
      pattern.forEach((i) => cells[i].classList.add("win"));
      return b[a]; // "X" or "O"
    }
  }
  return null;
}

function isBoardFull(b) {
  return b.every((cell) => cell !== "");
}

function endGame(winner) {
  isGameOver = true;
  if (winner === humanPlayer) {
    statusText.textContent = "Game Over: You win! 🎉";
  } else if (winner === aiPlayer) {
    statusText.textContent = "Game Over: AI wins using Minimax! 🤖";
  } else {
    statusText.textContent = "Game Over: It's a draw.";
  }
}

// ---------- MINIMAX PART ----------

function aiMove() {
  const result = getBestMove(board);
  const bestIndex = result.index;

  if (bestIndex === -1) {
    // no moves left
    endGame(checkWinner(board));
    return;
  }

  makeMove(bestIndex, aiPlayer);

  // show Minimax explanation
  aiDetails.textContent =
    `AI evaluated ${result.nodesExplored} possible board states using Minimax. ` +
    `The chosen move has a score of ${result.bestScore}. ` +
    `Positive score means good for AI (O), negative means good for you (X).`;

  const winner = checkWinner(board);
  if (winner) {
    endGame(winner);
    return;
  }

  if (isBoardFull(board)) {
    endGame(null);
    return;
  }

  currentPlayer = humanPlayer;
  updateStatus();
}

// chooses the best move for AI
function getBestMove(b) {
  let bestScore = -Infinity;
  let bestIndex = -1;
  const nodesCounter = { count: 0 };

  for (let i = 0; i < 9; i++) {
    if (b[i] === "") {
      b[i] = aiPlayer;
      const score = minimax(b, 0, false, nodesCounter); //b, depth, isMaximizing, nodesCounter
      b[i] = "";

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
  }

  return {
    index: bestIndex,
    bestScore: bestScore,
    nodesExplored: nodesCounter.count,
  };
}

/**
 * Minimax recursive function
 * b: board
 * depth: how deep in the game tree we are
 * isMaximizing: true -> AI's turn, false -> human's turn
 * nodesCounter: counts how many states are visited
 */
function minimax(b, depth, isMaximizing, nodesCounter) {
  nodesCounter.count++;

  const winner = checkWinnerSimple(b); // simple version without highlighting
  if (winner === aiPlayer) {
    return 10 - depth; // earlier win is better
  } else if (winner === humanPlayer) {
    return depth - 10; // later loss is slightly better
  } else if (isBoardFull(b)) {
    return 0; // draw
  }

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === "") {
        b[i] = aiPlayer;
        const value = minimax(b, depth + 1, false, nodesCounter);
        b[i] = "";
        best = Math.max(best, value);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === "") {
        b[i] = humanPlayer;
        const value = minimax(b, depth + 1, true, nodesCounter);
        b[i] = "";
        best = Math.min(best, value);
      }
    }
    return best;
  }
}

// simplified winner check (no UI changes)
function checkWinnerSimple(b) {
  for (let pattern of winPatterns) {
    const [a, c, d] = pattern;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      return b[a];
    }
  }
  return null;
}

// ---------- RESET ----------

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = humanPlayer;
  isGameOver = false;

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken", "win");
  });

  statusText.textContent = "Your turn (X)";

  aiDetails.textContent =
    "When you play as X, the AI (O) will respond using the Minimax algorithm. " +
    "This panel will show how many board states were checked and the score of its move.";
}

// initial
resetGame();
