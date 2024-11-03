let config = {
  rows: 4,
  cols: 4,
  images: [
    "image1.jpg",
    "image2.jpg",
    "image3.jpg",
    "image4.jpg",
    "image5.jpg",
    "image6.jpg",
    "image7.jpg",
    "image8.jpg"
  ]
};

let gameState = {
  board: [],
  flippedCards: [],
  currentPlayer: 1,
  scores: [0, 0],
  moveCount: 0
};

function startGame() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h1>Pexeso</h1>
    <div class="info">
      <p id="status"></p>
      <p>Skóre</p>
      <p id="score">Hráč 1: 0, Hráč 2: 0</p>
      <p id="moveCount">Počet tahů: 0</p>
    </div>
    <div class="game-board" id="gameBoard"></div>
    <button onclick="restartGame()">Restartovat hru</button>
  `;

  createBoard();
  updateStatus();
}

function createBoard() {
  const gameBoard = document.getElementById("gameBoard");
  const rows = config.rows;
  const cols = config.cols;
  const images = config.images;
  const totalCards = rows * cols;
  const deck = shuffle([...images, ...images]);

  gameState.board = deck.slice(0, totalCards);
  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 80px)`;

  gameBoard.innerHTML = '';
  for (let i = 0; i < gameState.board.length; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = i;
    card.onclick = function() { flipCard(i); };
    gameBoard.appendChild(card);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function flipCard(index) {
  if (gameState.flippedCards.length === 2) return;

  const card = document.querySelector(`.card[data-index='${index}']`);
  const imageSrc = gameState.board[index];

  if (!card.classList.contains("flipped")) {
    card.classList.add("flipped");

    // **Add an image element with the image source**
    const img = document.createElement("img");
    img.src = imageSrc;   // Sets the source of the image
    img.alt = "Card Image";
    card.appendChild(img); // Appends the image element to the card

    gameState.flippedCards.push({ index: index, imageSrc: imageSrc });

    if (gameState.flippedCards.length === 2) {
      checkMatch();
    }
  }
}

// Check if the two flipped cards match
function checkMatch() {
  const card1 = gameState.flippedCards[0];
  const card2 = gameState.flippedCards[1];
  const isMatch = card1.imageSrc === card2.imageSrc;  // **Check based on image source**

  gameState.moveCount++;
  if (isMatch) {
    gameState.scores[gameState.currentPlayer - 1]++;
    setTimeout(function() {
      document.querySelector(`.card[data-index='${card1.index}']`).style.visibility = "hidden";
      document.querySelector(`.card[data-index='${card2.index}']`).style.visibility = "hidden";
      gameState.flippedCards = [];
      updateStatus();
      if (checkGameOver()) alert(winningPlayer());
    }, 500);

  } else {
    setTimeout(function() {
      const cardElement1 = document.querySelector(`.card[data-index='${card1.index}']`);
      const cardElement2 = document.querySelector(`.card[data-index='${card2.index}']`);

      cardElement1.classList.remove("flipped");
      cardElement2.classList.remove("flipped");

      cardElement1.innerHTML = "";  // **Remove image when hiding card**
      cardElement2.innerHTML = "";

      gameState.flippedCards = [];
      gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
      updateStatus();
    }, 1000);
  }
}

function winningPlayer() {
  if (gameState.scores[0] > gameState.scores[1]) {
    return "Hráč 1 vítězí!";
  } else {
    return "Hráč 2 vítězí!";
  }
}

function updateStatus() {
  document.getElementById("status").textContent = "Na tahu hráč " + gameState.currentPlayer;
  document.getElementById("score").textContent = "Hráč 1: " + gameState.scores[0] + ", Hráč 2: " + gameState.scores[1];
  document.getElementById("moveCount").textContent = "Počet tahů: " + gameState.moveCount;
}

function checkGameOver() {
  return document.querySelectorAll(".card:not(.flipped)").length === 0;
}

function restartGame() {
  gameState = {
    board: [],
    flippedCards: [],
    currentPlayer: 1,
    scores: [0, 0],
    moveCount: 0
  };
  startGame();
}

window.onload = startGame;