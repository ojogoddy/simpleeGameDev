// password view
const handlePasswordView = () =>{
    const passwordInput = document.getElementById("signupPassword")
    const passwordIcon = document.getElementById("passwordEyePassword")

    if(passwordInput.type === "password"){
        passwordInput.type = "text"
        passwordIcon.src = "/public/asset/eye.svg"
    }else{
        passwordInput.type = "password"
        passwordIcon.src = "/public/asset/eye-closed.svg"
    }
}

const handleConfirmView = () =>{
    const passwordInput = document.getElementById("confirmPassword")
    const passwordIcon = document.getElementById("passwordEyeConfirm")

    if(passwordInput.type === "password"){
        passwordInput.type = "text"
        passwordIcon.src = "/public/asset/eye.svg"
    }else{
        passwordInput.type = "password"
        passwordIcon.src = "/public/asset/eye-closed.svg"
    }
}
const handleLoginPassView = () =>{
    const passwordInput = document.getElementById("SigninPassword")
    const passwordIcon = document.getElementById("passwordEyePassword")

    if(passwordInput.type === "password"){
        passwordInput.type = "text"
        passwordIcon.src = "/public/asset/eye.svg"
    }else{
        passwordInput.type = "password"
        passwordIcon.src = "/public/asset/eye-closed.svg"
    }
}
// Utility function to display error messages in the DOM
const displayRegisterErrorMessage = (message) => {
    const errorDiv = document.getElementById('signUpError');
    errorDiv.innerHTML = `<p style="color:red;">${message}</p>`;
  };

// Utility function to display error messages in the DOM
const displayLoginErrorMessage = (message) => {
    const errorDiv = document.getElementById('LoginError');
    errorDiv.innerHTML = `<p style="color:red;">${message}</p>`;
  };

  // Clear error messages from the DOM
const clearErrorMessage = () => {
    const errorDiv = document.getElementById('errorMessages');
    if (errorDiv) {
        errorDiv.innerHTML = '';
    }
};

// function to validate email format
const validateEmail = (email) =>{
    const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailpattern.test(email)){
        throw new Error("Invalid email format. Please enter a valid email")
    }
}

const validatePassword = (password) => {
    const passwordPattern = /^[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
        throw new Error("Password must be at least 8 characters long and contain only letters and numbers.");
    }
};

// function to check password and confirm password matches
const validateConfirmPassword = (password, confirmPassword)=>{
    if(password !== confirmPassword){
        throw new Error("password do not match, please try again")
    }
}


// function to login and retrieve user data
const loginUser =(email, password) =>{
    let users = JSON.parse(localStorage.getItem("users")) || []

    // find the user by email and check password
    const user = users.find(user => user.email === email && user.password === password)
    if(user){
        Swal.fire({
            title: "Login Successful!",
            icon: "success",
            confirmButtonText: 'OK'
          });
          return user
    }else{
        throw new Error ("Invalid email or password")
    }
}

//function to save user data to localStorage
const saveUserData = (fullName, email, password) =>{
    let users = JSON.parse(localStorage.getItem("users")) || []

    //check if the user already exists
    const existingUser = users.find(user => user.email === email)
    if(existingUser){
        throw new Error("User already exist with this email.")
    }

    // creating a new user object
    const newUser = {
        fullName, email, password, highScore : 0, coinBalance: 0
    }
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
}

// function to handle signUp
const handleSignUp = (event) =>{
    event.preventDefault()
    clearErrorMessage();

    const fullName = document.getElementById("signupName").value
    const userEmail = document.getElementById("signupEmail").value
    const userPassword = document.getElementById("signupPassword").value
    const confirmPassword = document.getElementById("confirmPassword").value

    try{
        validateEmail(userEmail)
        validatePassword(userPassword)
        validateConfirmPassword(userPassword, confirmPassword)

        //save user data to local storage
        saveUserData(fullName, userEmail, userPassword)

        Swal.fire({
            title: "Registration Successful!",
            icon: "success",
            confirmButtonText: 'OK'
          });

          // redirect to login page
        window.location.href = "Login.html"

    }catch(error){
        displayRegisterErrorMessage(error)
    }
}

//get the user's high score upon login
const getUserHighScore = (email) =>{
    let users = JSON.parse(localStorage.getItem("users")) || []
    const user = users.find(user => user.email === email)
    if(user){
        return user.highScore
    }else{
        throw new Error("User not found.")
    }
}

// function to handle signin with validation
const handleSignin =(event)=>{
    event.preventDefault()
    clearErrorMessage();

    const userEmail = document.getElementById("SigninEmail").value
    const userPassword = document.getElementById("SigninPassword").value

    try{
        validateEmail(userEmail)
        const user = loginUser(userEmail, userPassword)

        //storing the logged-in  user in sessionStorage to track the current session
        sessionStorage.setItem("LoggedInUser", JSON.stringify(user))

        // redirect to next page
        window.location.href = "/index.html"

    }catch(error){
        displayLoginErrorMessage(error)
    }
}

const signupForm = document.getElementById("signup")
if(signupForm){
    signupForm.addEventListener("submit", handleSignUp)
}
const signinForm = document.getElementById("signin")
if(signinForm){
    signinForm.addEventListener("submit", handleSignin)
}
