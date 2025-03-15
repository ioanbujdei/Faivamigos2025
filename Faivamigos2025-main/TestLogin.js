
let users = []; 

function openModal() {
    if (!localStorage.getItem('signedIn')) {
        document.getElementById('loginModal').style.display = 'flex';
    } else {
        alert("You are already signed in!");
    }
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function toggleForm(formType) {
    if (formType === 'register') {
        document.getElementById('loginFormContainer').style.display = 'none';
        document.getElementById('registerFormContainer').style.display = 'block';
    } else {
        document.getElementById('loginFormContainer').style.display = 'block';
        document.getElementById('registerFormContainer').style.display = 'none';
    }
}

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

function validateLoginForm() {
    const emailOrUsername = document.getElementById('loginUsernameOrEmail').value;
    
    if (!emailPattern.test(emailOrUsername)) {
        document.getElementById('loginMessage').textContent = "Please enter a valid email address!";
        document.getElementById('loginMessage').style.color = "red";
        return false; 
    }
    
    return true; 
}


function validateRegisterForm() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !email || !password || !confirmPassword) {
        document.getElementById('registerMessage').textContent = "Please fill out all fields!";
        document.getElementById('registerMessage').style.color = "red";
        return false; // Prevent form submission
    }

    if (!emailPattern.test(email)) {
        document.getElementById('registerMessage').textContent = "Please enter a valid email address!";
        document.getElementById('registerMessage').style.color = "red";
        return false; 
    }

    if (password.length < 8) {
        document.getElementById('registerMessage').textContent = "Password must be at least 8 characters!";
        document.getElementById('registerMessage').style.color = "red";
        return false; 
    }

    if (password !== confirmPassword) {
        document.getElementById('registerMessage').textContent = "Passwords do not match!";
        document.getElementById('registerMessage').style.color = "red";
        return false;
    }

    if (users.some(u => u.username === username || u.email === email)) {
        document.getElementById('registerMessage').textContent = "Username or email already taken!";
        document.getElementById('registerMessage').style.color = "red";
        return false; 
    }

    users.push({ username, email, password });

    document.getElementById('registerMessage').textContent = "Registration successful! You can now log in.";
    document.getElementById('registerMessage').style.color = "green";

    setTimeout(function() {
        toggleForm('login'); 
    }, 2000);

    return false; 
}

function login() {
    const usernameOrEmail = document.getElementById('loginUsernameOrEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => 
        (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );

    if (user) {
        document.getElementById('loginMessage').textContent = "Login successful!";
        document.getElementById('loginMessage').style.color = "green";

        localStorage.setItem('signedIn', 'true');

        setTimeout(function() {
            window.location.href = "homepage.html"; 
        }, 2000);
    } else {
        document.getElementById('loginMessage').textContent = "Invalid credentials!";
        document.getElementById('loginMessage').style.color = "red";
    }
}
