    let users = []; // Stores users as an array of objects

        function toggleForm(formType) {
            if (formType === 'register') {
                document.getElementById('loginFormContainer').style.display = 'none';
                document.getElementById('registerFormContainer').style.display = 'block';
            } else {
                document.getElementById('loginFormContainer').style.display = 'block';
                document.getElementById('registerFormContainer').style.display = 'none';
            }
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

                // Redirect to homepage 
                setTimeout(function() {
                    window.location.href = "homepage.html"; 
                }, 2000);
            } else {
                document.getElementById('loginMessage').textContent = "Invalid credentials!";
                document.getElementById('loginMessage').style.color = "red";
            }
        }

        function register() {
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Email format validation
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email)) {
                document.getElementById('registerMessage').textContent = "Please enter a valid email address!";
                document.getElementById('registerMessage').style.color = "red";
                return;
            }

            // Check if username or email already exists
            if (users.some(u => u.username === username || u.email === email)) {
                document.getElementById('registerMessage').textContent = "Username or email already taken!";
                document.getElementById('registerMessage').style.color = "red";
                return;
            }

            // Check if passwords match
            if (password !== confirmPassword) {
                document.getElementById('registerMessage').textContent = "Passwords do not match!";
                document.getElementById('registerMessage').style.color = "red";
                return;
            }

            // Add user to users array (you can save it to a server in real applications)
            users.push({ username, email, password });

            document.getElementById('registerMessage').textContent = "Registration successful! You can now log in.";
            document.getElementById('registerMessage').style.color = "green";

            setTimeout(function() {
                toggleForm('login'); 
            }, 2000);
        }