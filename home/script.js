const handleLogout = ()=>{
    sessionStorage.removeItem("LoggedInUser")
    window.location.href = "/Auth/Login.html"
}

const checkLoginStatus = () =>{
    const LoggedInUser = sessionStorage.getItem("LoggedInUser")

    if(LoggedInUser){
        document.getElementById("logout-btn").style.display = "block"
        document.getElementById("login-button").style.display = "none"
    }
}
//function to get user name from local storage
const handleUserName = () =>{
    let users = JSON.parse(sessionStorage.getItem("LoggedInUser")) || []
    console.log(users)

    if(users.fullName){
        document.getElementById("user-fullName").textContent = `${users.fullName}`
    }else{
        document.getElementById("user-fullName").textContent = "Guest"
    }

}

const setOpponentMode = (mode) => {
    sessionStorage.setItem("opponentMode", mode);
    console.log("mode",mode);

    // Check if the opponentName element exists
    const opponentName = document.getElementById("opponentName");
    console.log("opponent name", opponentName)

    if (opponentName) {  // Ensure the element is available
        if (mode === "computer") {
            opponentName.textContent = "computer";
        } else if (mode === "player") {
            opponentName.textContent = "Player 2";
        }
    }
};

//function to check login before allowing the game mode to be selected
const checkUserLogin = (mode) =>{
    const LoggedInUser = sessionStorage.getItem("LoggedInUser")
    if(LoggedInUser){
        setOpponentMode(mode)
        window.location.href = "/gameplay/index.html"
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'You need to log in to play the game!',
            confirmButtonText: 'Ok',
        })
       }
}

// window onload
window.onload =() =>{
    handleUserName()
    checkLoginStatus()
}

//event listeners for the game mode buttons
document.getElementById("play-against-player").addEventListener("click", ()=>{
    checkUserLogin("player")
})
document.getElementById("play-against-computer").addEventListener("click", ()=>{
    checkUserLogin("computer")
})

//event listeners
document.getElementById("logout-btn").addEventListener("click", handleLogout)
