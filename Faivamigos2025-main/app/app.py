# app.py
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Dummy user data (for illustration)
users = {
    "admin": "password123",
    "user": "mypassword"
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    # Check if the username and password match (using dummy data here)
    if username in users and users[username] == password:
        return f"Welcome, {username}!"  # You can redirect to another page if needed
    else:
        return "Invalid username or password, please try again."

if __name__ == '__main__':
    app.run(debug=True)