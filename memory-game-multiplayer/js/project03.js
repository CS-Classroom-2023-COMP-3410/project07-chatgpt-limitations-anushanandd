const gameGrid = document.getElementById("gameGrid");
const moveCounter = document.getElementById("moveCounter");
const timer = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const startGameBtn = document.getElementById("startGameBtn");
const gridRowsInput = document.getElementById("gridRows");
const gridColsInput = document.getElementById("gridCols");
const welcomeContainer = document.querySelector(".welcome-container");
const gameContainer = document.querySelector(".game-container");
const turnInfo = document.getElementById("turnInfo");
const player1Matches = document.getElementById("player1Matches");
const player2Matches = document.getElementById("player2Matches");

let cards = [];
let flippedCards = [];
let moves = 0;
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let timerInterval = null;
let timeElapsed = 0;
let timerRunning = false; // New flag to track if the timer is running
let gridRows = 4;
let gridCols = 4;

const animalImages = [
  "cat.png", "dog.png", "elephant.png", "fox.png", "lion.png", 
  "monkey.png", "panda.png", "rabbit.png", "tiger.png", "zebra.png"
];

startGameBtn.addEventListener("click", () => {
  gridRows = parseInt(gridRowsInput.value);
  gridCols = parseInt(gridColsInput.value);
  const totalCards = gridRows * gridCols;

  if (gridRows >= 2 && gridRows <= 10 && gridCols >= 2 && gridCols <= 10 && totalCards % 2 === 0) {
    welcomeContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    initializeGame();
  } else {
    alert("Invalid grid size! Ensure the total number of cards is even and values are between 2 and 10.");
  }
});

function initializeGame() {
  const totalCards = gridRows * gridCols;
  const uniquePairs = totalCards / 2;

  const selectedImages = [];
  for (let i = 0; i < uniquePairs; i++) {
    selectedImages.push(animalImages[i % animalImages.length]);
  }

  const cardPairs = [...selectedImages, ...selectedImages];
  cards = shuffleArray(cardPairs);
  createGrid();
  resetGameInfo();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createGrid() {
  gameGrid.innerHTML = "";
  gameGrid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

  cards.forEach((image) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.symbol = image;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back"><img src="images/${image}" alt="Animal"></div>
      </div>
    `;
    card.addEventListener("click", handleCardClick);
    gameGrid.appendChild(card);
  });

  // Reset timer flag so it starts on the first card flip
  timerRunning = false;
}

function handleCardClick(e) {
  const clickedCard = e.currentTarget;

  if (clickedCard.classList.contains("flipped") || flippedCards.length === 2) {
    return;
  }

  // Start the timer when the first card is flipped
  if (!timerRunning) {
    startTimer();
    timerRunning = true;
  }

  flippedCards.push(clickedCard);
  clickedCard.classList.add("flipped");

  if (flippedCards.length === 2) {
    moves++;
    moveCounter.textContent = moves;
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.symbol === card2.dataset.symbol) {
    setTimeout(() => {
      card1.classList.add("matched");
      card2.classList.add("matched");
      flippedCards = [];
      updateScore();
      checkGameOver();
    }, 500);
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      switchTurn();
    }, 1000);
  }
}

function updateScore() {
  if (currentPlayer === 1) {
    player1Score++;
    player1Matches.textContent = player1Score;
  } else {
    player2Score++;
    player2Matches.textContent = player2Score;
  }
}

function switchTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  turnInfo.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkGameOver() {
  const totalMatches = document.querySelectorAll(".card.matched").length / 2;
  const totalCards = gridRows * gridCols / 2;
  
  if (totalMatches === totalCards) {
    clearInterval(timerInterval);
    setTimeout(() => {
      alert(`Game Over! Player 1: ${player1Score}, Player 2: ${player2Score}`);
    }, 500);
  }
}

function startTimer() {
  timeElapsed = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeElapsed++;
    timer.textContent = formatTime(timeElapsed);
  }, 1000);
}

function formatTime(seconds) {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
}

function resetGameInfo() {
  moves = 0;
  player1Score = 0;
  player2Score = 0;
  currentPlayer = 1;
  player1Matches.textContent = player1Score;
  player2Matches.textContent = player2Score;
  moveCounter.textContent = moves;
  clearInterval(timerInterval);
  timer.textContent = "00:00";
  turnInfo.textContent = "Player 1's Turn";
  timerRunning = false; // Reset timer flag
}

restartBtn.addEventListener("click", () => {
  gameContainer.classList.add("hidden");
  welcomeContainer.classList.remove("hidden");
  resetGameInfo();
});
