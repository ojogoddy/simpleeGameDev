// Utility function for safe JSON parsing with fallback
const safeParse = (value, fallback = null) => {
    try {
        return JSON.parse(value) || fallback;
    } catch {
        return fallback;
    }
};

// Fetch scores and winner message from sessionStorage
const scores = safeParse(sessionStorage.getItem("GameScores"));
console.log("scores", scores)
const winnerMessage = sessionStorage.getItem("gameOverMessage");

// Select score elements in the HTML
const playerScoreElement = document.getElementById("winnerscore");
const opponentScoreElement = document.getElementById("loserScore");
const winnerMessageElement = document.getElementById("winnerMessage");

// Update displayed scores and winner message if available
if (scores && playerScoreElement && opponentScoreElement) {
    const { mainPlayerScore, opponentScore } = scores; // Destructure scores
    playerScoreElement.textContent = mainPlayerScore || 0;
    opponentScoreElement.textContent = opponentScore || 0;
}

if (winnerMessage && winnerMessageElement) {
    winnerMessageElement.textContent = winnerMessage;
}

// Fetch logged-in user from sessionStorage
const loggedInUser = safeParse(sessionStorage.getItem("LoggedInUser"), []);
const userEmail = loggedInUser?.email || "";

// Log user information for debugging
console.log("Logged in user's email:", userEmail);
console.log("Logged in user data:", loggedInUser);

// Retrieve high score from localStorage
let users = safeParse(localStorage.getItem("users"), []);
const currentUser = users.find(user => user.email === userEmail);
const highScore = currentUser ? currentUser.highScore : 0;

// Update the best score element
const bestScoreElement = document.getElementById("bestScoreValue");
if (bestScoreElement) {
    bestScoreElement.textContent = `Best Score: ${highScore}`;
}

// Function to update the user's high score if the new score is higher
const updateHighScore = (email, newScore) => {
    const users = safeParse(localStorage.getItem("users"), []);
    const userIndex = users.findIndex(user => user.email === email);

    if (userIndex !== -1 && newScore > users[userIndex].highScore) {
        users[userIndex].highScore = newScore;
        localStorage.setItem("users", JSON.stringify(users));
        console.log("High score updated for:", email);
    }
};

// Update the high score if necessary
window.onload =()=>{
    if (scores && userEmail) {
        updateHighScore(userEmail, scores.mainPlayerScore);
    }
    updateHighScore()
}
