// --- Game State Variables ---
let score = 0;
let highScore = localStorage.getItem('popHighScore') || 0;
let isGameRunning = false;
let balloonInterval;
const gameDuration = 5000; // Balloon rise time in ms (must match CSS transition: 5s)

// --- DOM Elements ---
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const startButton = document.getElementById('start-button');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Initial setup: Display high score
highScoreDisplay.textContent = highScore;

const colors = ['#ff6f69', '#ffcc5c', '#88d8b0', '#6aa2d8', '#cc99ff'];

/**
 * Creates a new balloon element, positions it, and sets it to rise.
 */
function createBalloon() {
    if (!isGameRunning) return;

    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    
    // Set color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.backgroundColor = randomColor;

    // Set horizontal position
    const balloonWidth = 70; // Matches CSS width
    const maxLeft = gameContainer.clientWidth - balloonWidth;
    const randomLeft = Math.floor(Math.random() * maxLeft);
    balloon.style.left = `${randomLeft}px`;

    // Attach pop handler
    balloon.addEventListener('click', popBalloon);

    gameContainer.appendChild(balloon);
    
    // Start the rising animation using CSS transition
    setTimeout(() => {
        // The target position is above the game container's height
        balloon.style.bottom = `${gameContainer.clientHeight + 100}px`;
    }, 50);

    // Set a timeout for when the balloon should escape (Game Over condition)
    setTimeout(() => {
        if (balloon.parentNode && !balloon.classList.contains('pop')) {
            balloonEscaped(balloon);
        }
    }, gameDuration + 100); // 100ms grace period after transition ends
}

/**
 * Executes when a balloon reaches the top line (escapes).
 * @param {HTMLElement} balloon - The escaped balloon element.
 */
function balloonEscaped(balloon) {
    if (!isGameRunning) return;

    // Remove the balloon
    if (balloon.parentNode) {
        balloon.remove();
    }
    
    stopGame(); // Game Over!
}

/**
 * Handles the click event for popping a balloon.
 * @param {MouseEvent} event - The click event.
 */
function popBalloon(event) {
    if (!isGameRunning) return;

    const balloon = event.currentTarget;
    
    if (balloon.classList.contains('pop')) return;
    
    balloon.classList.add('pop');
    score++;
    scoreDisplay.textContent = score;

    // Remove the balloon from the DOM after the pop animation
    setTimeout(() => {
        if (balloon.parentNode) {
            balloon.remove();
        }
    }, 200);
}

/**
 * Starts the game.
 */
function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    score = 0;
    scoreDisplay.textContent = score;
    startButton.classList.add('hidden'); // Hide start button
    gameOverModal.classList.add('hidden'); // Hide modal

    // Clear any existing balloons
    document.querySelectorAll('.balloon').forEach(b => b.remove());

    // Start creating new balloons every 1.2 seconds (slightly faster)
    createBalloon(); 
    balloonInterval = setInterval(createBalloon, 1200); 
}

/**
 * Stops the game and handles the Game Over state.
 */
function stopGame() {
    if (!isGameRunning) return;

    isGameRunning = false;
    clearInterval(balloonInterval);
    
    // 1. Update High Score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('popHighScore', highScore);
        highScoreDisplay.textContent = highScore;
    }

    // 2. Show Game Over Modal
    finalScoreDisplay.textContent = score;
    gameOverModal.classList.remove('hidden');
}


// --- Event Listeners ---
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);