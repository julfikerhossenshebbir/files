// DOM Elements
const menu = document.getElementById('menu');
const singlePlayerBtn = document.getElementById('singlePlayer');
const doublePlayerBtn = document.getElementById('doublePlayer');
const difficultyMenu = document.getElementById('difficulty-menu');
const normalModeBtn = document.getElementById('normalMode');
const mediumModeBtn = document.getElementById('mediumMode');
const hardModeBtn = document.getElementById('hardMode');
const game = document.getElementById('game');
const backToMenuBtn = document.getElementById('backToMenu');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const player1ScoreEl = document.getElementById('player1-score');
const player2ScoreEl = document.getElementById('player2-score');

// Game Variables
let currentPlayer = 'X';
let gameActive = true;
let gameBoard = Array(9).fill(null);
let player1Score = 0;
let player2Score = 0;
let isSinglePlayer = false;
let aiDifficulty = 'normal';

// Navigation Functions
function showMenu() {
  menu.style.display = 'block';
  game.style.display = 'none';
  difficultyMenu.style.display = 'none';
  resetGame();
}

function showGame(singlePlayer = false, difficulty = 'normal') {
  isSinglePlayer = singlePlayer;
  aiDifficulty = difficulty;
  menu.style.display = 'none';
  difficultyMenu.style.display = 'none';
  game.style.display = 'block';
  resetGame();
}

function showDifficultyMenu() {
  menu.style.display = 'none';
  difficultyMenu.style.display = 'block';
}

// Game Functions
function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (!gameActive || gameBoard[index]) return;

  gameBoard[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.style.color = currentPlayer === 'X' ? '#007bff' : '#ff5722';

  if (checkWinner()) {
    gameActive = false;
    statusDisplay.textContent = `${currentPlayer} wins!`;
    updateScore(currentPlayer);
    setTimeout(resetGame, 2000); // Auto reset after 2 seconds
  } else if (gameBoard.every(cell => cell)) {
    gameActive = false;
    statusDisplay.textContent = 'It\'s a draw!';
    setTimeout(resetGame, 2000); // Auto reset after 2 seconds
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    if (isSinglePlayer && currentPlayer === 'O') {
      setTimeout(aiMove, 500); // AI delay for natural gameplay
    }
  }
}

function aiMove() {
  if (!gameActive) return;

  let availableMoves = gameBoard.map((val, idx) => (val === null ? idx : null)).filter(idx => idx !== null);

  let chosenMove;
  if (aiDifficulty === 'hard') {
    chosenMove = bestMove('O'); // Strong AI
  } else if (aiDifficulty === 'medium') {
    if (Math.random() > 0.3) { 
      // 70% সময় strong AI, 30% random
      chosenMove = bestMove('O');
    } else {
      chosenMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  } else {
    chosenMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]; // Random AI
  }

  gameBoard[chosenMove] = 'O';
  cells[chosenMove].textContent = 'O';
  cells[chosenMove].style.color = '#ff5722';

  if (checkWinner()) {
    gameActive = false;
    statusDisplay.textContent = 'AI wins!';
    updateScore('O');
    setTimeout(resetGame, 2000); // Auto reset after 2 seconds
  } else if (gameBoard.every(cell => cell)) {
    gameActive = false;
    statusDisplay.textContent = 'It\'s a draw!';
    setTimeout(resetGame, 2000); // Auto reset after 2 seconds
  } else {
    currentPlayer = 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
  });
}

function bestMove(player) {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === null) {
      gameBoard[i] = player;
      let score = minimax(gameBoard, 0, false);
      gameBoard[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner()) return isMaximizing ? -1 : 1;
  if (board.every(cell => cell)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function updateScore(winner) {
  if (winner === 'X') {
    player1Score += 1;
    player1ScoreEl.textContent = player1Score;
  } else {
    player2Score += 1;
    player2ScoreEl.textContent = player2Score;
  }
}

function resetGame() {
  gameBoard = Array(9).fill(null);
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.color = '';
  });
  currentPlayer = 'X';
  gameActive = true;
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

// Event Listeners
singlePlayerBtn.addEventListener('click', () => showDifficultyMenu());
doublePlayerBtn.addEventListener('click', () => showGame(false));
normalModeBtn.addEventListener('click', () => showGame(true, 'normal'));
mediumModeBtn.addEventListener('click', () => showGame(true, 'medium'));
hardModeBtn.addEventListener('click', () => showGame(true, 'hard'));
backToMenuBtn.addEventListener('click', showMenu);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
