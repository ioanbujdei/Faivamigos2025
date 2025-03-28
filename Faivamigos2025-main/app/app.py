import csv
import os
from flask import Flask, render_template, request, redirect, url_for, flash

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

# Ensure CSV files exist with headers
if not os.path.exists(USERS_CSV):
    with open(USERS_CSV, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['username', 'password', 'email'])

if not os.path.exists(PROJECTS_CSV):
    with open(PROJECTS_CSV, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['title', 'description', 'image_path'])

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
                        'image_path': f"../static/{row[2]}"  # Ensure the path is correct for HTML
                    })
    except FileNotFoundError:
        flash("No projects found.", "info")

    # Debugging: Print projects to the console
    print("Projects fetched from CSV:", projects)

    return render_template('index.html', projects=projects)

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    # Open the CSV file and check for matching username and password
    try:
        with open(USERS_CSV, mode='r', newline='', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)  # Skip the header row

            # Iterate through rows and check for a match
            for row in reader:
                if len(row) >= 2 and row[0] == username and row[1] == password:
                    flash("Login successful!", "success")
                    return redirect(url_for('home'))
    except FileNotFoundError:
        flash("User database not found. Please contact the administrator.", "error")
        return redirect(url_for('home'))

    # If no match is found
    flash("Invalid username or password, please try again.", "error")
    return redirect(url_for('home'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')

        # Check if the username already exists
        try:
            with open(USERS_CSV, mode='r', newline='', encoding='utf-8') as file:
                reader = csv.reader(file)
                for row in reader:
                    if len(row) >= 1 and row[0] == username:
                        flash("Username already exists. Please choose a different username.", "error")
                        return redirect(url_for('register'))
        except FileNotFoundError:
            pass  # If the file doesn't exist, we'll create it below

        # Append the new user to the CSV file on a new line
        with open(USERS_CSV, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([username, password, email])  # This ensures a new line is added

        flash("Registration successful! You can now log in.", "success")
        return redirect(url_for('home'))  # Redirect to the home page after successful registration

    return render_template('index.html')  # Render the registration form (if GET request)

@app.route('/add_project', methods=['POST'])
def add_project():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        image = request.files['image']

        # Save the uploaded image
        if image:
            image_path = os.path.join('uploads', image.filename)  # Relative path for HTML
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], image.filename))
        else:
            flash("No image uploaded. Please upload an image.", "error")
            return redirect(url_for('home'))

        # Append the new project to the CSV file
        with open(PROJECTS_CSV, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([title, description, image_path])  # Save project data

        flash("Project added successfully!", "success")
        return redirect(url_for('home'))  # Redirect to the home page after adding the project

if __name__ == '__main__':
    app.run(debug=True)