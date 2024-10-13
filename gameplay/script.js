//function to get user name from local storage
const handleUserName = () =>{
    let users = JSON.parse(sessionStorage.getItem("LoggedInUser")) || []
    if(users.fullName){
        let firstName = users.fullName.split(" ")[0]
        const animalEmoji = ["🐶", "🐱", "🐼", "🦊", "🐨", "🐵", "🐯", "🦁", "🐻", "🐹"]
        const randomEmoji = animalEmoji[Math.floor(Math.random() * animalEmoji.length)]
        document.getElementById("user-fullName").textContent = `${firstName} ${randomEmoji}`
    }
}
//function to get opponent name from and display
const handleOpponentName = () =>{
    let users = sessionStorage.getItem("opponentMode") || []
    if(users === "computer"){
        document.getElementById("opponentName").textContent = "Computer"
    }else{
        document.getElementById("opponentName").textContent = "Player"
    }
}

// timer and switching active players
let activePlayer = "main-player"
let timerElement = document.getElementById("timer")
let mainPlayerElement = document.querySelector(".main-player")
let opponentElement = document.querySelector(".opponent")
let countdown = 10
let totalBoxes = 0
let revealedBoxes = 0

//score for each player
let mainPlayerScore = 0
let opponentScore = 0

//update scores in the game
const updateGameScore = () =>{
    mainPlayerElement.querySelector("p").textContent = `score: ${mainPlayerScore}`
    opponentElement.querySelector("p").textContent = `score: ${opponentScore}`
}

//save the score to sessionStorage
const saveScoresToStorage = () =>{
    sessionStorage.setItem("GameScores", JSON.stringify({
        mainPlayerScore: mainPlayerScore,
        opponentScore : opponentScore
    }))
}

let isPlayingComputer = false

//retrive the game mode from the sessionstorage
const opponentMode = sessionStorage.getItem("opponentMode")
//set whether u are playing against a player or a computer
if(opponentMode === "computer"){
    isPlayingComputer = true
}else{
    isPlayingComputer = false
}

// switching between players function
const switchPlayer = () =>{
    if(activePlayer === "main-player"){
        activePlayer = "opponent"
        mainPlayerElement.style.backgroundColor = ""
        opponentElement.style.backgroundColor = "#f4a"

        // If playing against the computer
        if (isPlayingComputer) {
            console.log("isplaying4", isPlayingComputer)
            setTimeout(() => {
                computerPlay();
            }, 3000); // Delay of 3 second for the computer to "think"
        }
    }else {
        activePlayer = 'main-player';
        opponentElement.style.backgroundColor = '';
        mainPlayerElement.style.backgroundColor = '#f4a';
    }
    countdown = 10 //reset the timer for the new player
}



// function to handle computer play
const computerPlay = () => {
    const boxes = document.querySelectorAll(".box");

    // Filter out the revealed boxes
    const availableBoxes = Array.from(boxes).filter(box => !box.classList.contains("revealed"));

    // If no available boxes left, return early
    if (availableBoxes.length === 0) {
        return;
    }

    // Randomly pick one of the available boxes
    const randomIndex = Math.floor(Math.random() * availableBoxes.length);
    const randomBox = availableBoxes[randomIndex];

    // Simulate a click on the chosen box for the computer's turn
    randomBox.click();
};

//function to end the game and determine the winner
const endGame = () =>{
    clearInterval(countdownInterval)  //stop the timer
    saveScoresToStorage() // save the final sscores to sessionStorage

    //determine the winner
    let winnerMessage = ""
    if(mainPlayerScore > opponentScore){
        winnerMessage = "You Win!"
    }else if(opponentScore > mainPlayerScore){
        winnerMessage = "You lose!"
    }else {
        winnerMessage = "It's a tie"
    }

    //redirect to game over page and pass the winner message via sessionstorage
    sessionStorage.setItem("gameOverMessage", winnerMessage)
    window.location.href = "/gameover/index.html"
}

//start the timer function
let countdownInterval = null

const startTimer = () =>{
     countdownInterval = setInterval(() =>{
        timerElement.textContent = `${countdown} secs`
        countdown--
        if(countdown < 0){
            //when the countdown reaches zero, it resets to 10 secs and switch active player
            countdown = 10
            switchPlayer()
        }
    }, 1000) //runs every one seconds
}
const images = ["/public/asset/Tiger.png", "/public/asset/Turtle.png", "/public/asset/BabyChick.png", "/public/asset/Bear.png", "/public/asset/Cat.png", "/public/asset/Chicken.png", "/public/asset/Cow.png", "/public/asset/Dog.png", "/public/asset/Koala.png", "/public/asset/LadyBeetle.png", "/public/asset/Monkey.png", "/public/asset/Octopus.png", "/public/asset/Panda.png", "/public/asset/Penguin.png", "/public/asset/Rabbit.png", "/public/asset/Sheep.png", "/public/asset/Snake.png", "/public/asset/SpiralShell.png"]

let shuffledImages = [];

// Function to shuffle the images array
const shuffleImages = () => {
  shuffledImages = [...images];
  for (let i = shuffledImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
  }
};

// Initialize the shuffled array
shuffleImages();

let currentIndex = 0;

// Function to get the next image
const getRandomImage = () => {
  if (currentIndex >= shuffledImages.length) {
    // Reshuffle if all images have been used
    shuffleImages();
    currentIndex = 0;
  }
  return shuffledImages[currentIndex++];
};

const getRandomNumber = () =>{
    return Math.floor(Math.random() * 90) + 10
}

//function to add random number to all the boxes
const populateBoxes = () =>{
    const boxes = document.querySelectorAll(".box")
    totalBoxes = boxes.length //set the total number of boxes

    boxes.forEach(box => {
        const randomNumber = getRandomNumber()
        const randomImage = getRandomImage()

        //create a number element
        const numberElement = document.createElement("div")
        numberElement.classList.add("number")
        numberElement.textContent = randomNumber

        //create an image element
        const imageElement = document.createElement("img")
        imageElement.src = randomImage

        //append the number and image to the box
        box.appendChild(numberElement)
        box.appendChild(imageElement)

        //add click event to reveal the number and hide the image
        box.addEventListener("click", ()=>{

            if(box.classList.contains("revealed") || activePlayer === null){
                return // if the box is already revealed or the game has ended, do nothing
            }

            if(!box.classList.contains("revealed") && activePlayer === "main-player"){
                box.classList.add("revealed")
                mainPlayerScore += randomNumber //add to main players score
                updateGameScore()
                switchPlayer() // switch to opponents turn after click
            }else if(!box.classList.contains("revealed") && activePlayer === "opponent"){
                box.classList.add("revealed")
                opponentScore += randomNumber // add to opponents score
                updateGameScore()
                switchPlayer() //switch to main players turn after click
            }

            revealedBoxes++

            //check if all boxes are revealed
            if(revealedBoxes === totalBoxes){
                endGame()
            }
        })
    })
}



// window onload
window.onload =() =>{
    handleUserName()
    handleOpponentName()
    mainPlayerElement.style.backgroundColor = "#f4a"
    startTimer()
    populateBoxes()

}
