from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import csv
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Required for flash messages

# Path to the CSV files
USERS_CSV = 'users.csv'
PROJECTS_CSV = 'projects.csv'

# Folder to store uploaded images
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    # Fetch projects from the CSV file
    projects = []
    try:
        with open(PROJECTS_CSV, mode='r', newline='', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)  # Skip the header row
            for row in reader:
                if len(row) >= 3:  # Ensure the row has title, description, and image_path
                    projects.append({
                        'title': row[0],
                        'description': row[1],
                        'image_path': row[2]
                    })
    except FileNotFoundError:
        flash("No projects found.", "info")

    return render_template('index.html', projects=projects)

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    # Check if the username and password match a user in the CSV file
    try:
        with open(USERS_CSV, mode='r', newline='', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)  # Skip the header row
            for row in reader:
                if len(row) >= 2 and row[0] == username and row[1] == password:
                    # Login successful
                    return jsonify({
                        'success': True,
                        'message': 'Login successful!'
                    })

        # If no match is found
        return jsonify({
            'success': False,
            'message': 'Invalid username or password.'
        })

    except FileNotFoundError:
        return jsonify({
            'success': False,
            'message': 'User database not found. Please contact the administrator.'
        })

@app.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')

    # Check if the username already exists
    try:
        with open(USERS_CSV, mode='r', newline='', encoding='utf-8') as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) >= 1 and row[0] == username:
                    return jsonify({
                        'success': False,
                        'message': 'Username already exists. Please choose a different username.'
                    })
    except FileNotFoundError:
        pass  # If the file doesn't exist, we'll create it below

    # Append the new user to the CSV file
    with open(USERS_CSV, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow([username, password, email])

    return jsonify({
        'success': True,
        'message': 'Registration successful! You can now log in.'
    })

@app.route('/add_project', methods=['POST'])
def add_project():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        image = request.files['image']

        # Save the uploaded image
        if image:
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
            image.save(image_path)
        else:
            return jsonify({
                'success': False,
                'message': 'No image uploaded. Please upload an image.'
            })

        # Append the new project to the CSV file
        with open(PROJECTS_CSV, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([title, description, image_path])

        return jsonify({
            'success': True,
            'message': 'Project added successfully!'
        })

if __name__ == '__main__':
    app.run(debug=True)