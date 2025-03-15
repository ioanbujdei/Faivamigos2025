// Suggestion Page Voting Logic
let voteCount = localStorage.getItem("voteCount") ? parseInt(localStorage.getItem("voteCount")) : 0;
let currentVote = localStorage.getItem("currentVote") || null; // 'up', 'down', or null

function updateVoteCount() {
    document.getElementById("voteCount").innerText = voteCount;
    localStorage.setItem("voteCount", voteCount);
}

function handleVote(type) {
    if (currentVote === type) {
        // If the user clicks the same button again, remove their vote
        voteCount -= (type === 'up' ? 1 : -1);
        currentVote = null;
    } else {
        // If the user switches their vote
        if (currentVote === 'up') {
            voteCount--; // Remove the previous upvote
        } else if (currentVote === 'down') {
            voteCount++; // Remove the previous downvote
        }

        // Add the new vote
        if (type === 'up') {
            voteCount++;
        } else if (type === 'down') {
            voteCount--;
        }

        currentVote = type;
    }

    // Save the updated vote count and current vote
    localStorage.setItem("voteCount", voteCount);
    localStorage.setItem("currentVote", currentVote);
    updateVoteCount();
}

// Initialize vote count and current vote
document.addEventListener("DOMContentLoaded", function () {
    updateVoteCount();
    initializeProjects();

    // Attach event listeners
    document.getElementById("upvoteBtn").addEventListener("click", () => handleVote('up'));
    document.getElementById("downvoteBtn").addEventListener("click", () => handleVote('down'));
    document.getElementById("showMoreBtn").addEventListener("click", toggleDescription);
    document.getElementById("postCommentBtn").addEventListener("click", addComment);
});

// Popular Projects Voting Logic
let projects = [
    { id: 0, name: "Project 1", voteCount: 0, currentVote: null, image: "https://picsum.photos/100/70" },
    { id: 1, name: "Project 2", voteCount: 0, currentVote: null, image: "https://picsum.photos/100/70?random=1" },
    { id: 2, name: "Project 3", voteCount: 0, currentVote: null, image: "https://picsum.photos/100/70?random=2" }
];

function initializeProjects() {
    let storedProjects = JSON.parse(localStorage.getItem("projects"));
    if (storedProjects) {
        projects = storedProjects;
    }
    renderProjects();
}

function handleProjectVote(index, type) {
    let project = projects[index];

    if (project.currentVote === type) {
        // If the user clicks the same button again, remove their vote
        project.voteCount -= (type === 'up' ? 1 : -1);
        project.currentVote = null;
    } else {
        // If the user switches their vote
        if (project.currentVote === 'up') {
            project.voteCount--; // Remove the previous upvote
        } else if (project.currentVote === 'down') {
            project.voteCount++; // Remove the previous downvote
        }

        // Add the new vote
        if (type === 'up') {
            project.voteCount++;
        } else if (type === 'down') {
            project.voteCount--;
        }

        project.currentVote = type;
    }

    // Save the updated projects
    localStorage.setItem("projects", JSON.stringify(projects));

    // Re-render the projects in sorted order with animations
    animateAndRenderProjects();
}

function animateAndRenderProjects() {
    // Sort projects by voteCount in descending order
    projects.sort((a, b) => b.voteCount - a.voteCount);

    // Get the current project elements
    let projectElements = document.querySelectorAll(".popular-project");

    // Add animation classes based on their new positions
    projectElements.forEach((element, index) => {
        let projectId = parseInt(element.dataset.id);
        let oldIndex = projects.findIndex(p => p.id === projectId);
        if (index < oldIndex) {
            element.classList.add("animate-up");
        } else if (index > oldIndex) {
            element.classList.add("animate-down");
        }
    });

    // Wait for the animations to finish, then re-render
    setTimeout(() => {
        renderProjects();
    }, 500); // Match the duration of the CSS transition
}

function renderProjects() {
    // Clear the projects container
    let projectsContainer = document.getElementById("projectsContainer");
    projectsContainer.innerHTML = "";

    // Render each project
    projects.forEach((project) => {
        let projectDiv = document.createElement("div");
        projectDiv.classList.add("popular-project");
        projectDiv.dataset.id = project.id; // Add a data attribute for tracking
        projectDiv.innerHTML = `
            <h3>${project.name}</h3>
            <div class="project-content">
                <button class="vote-button" onclick="handleProjectVote(${project.id}, 'up')">⬆</button>
                <span id="projectVote${project.id}">${project.voteCount}</span>
                <img src="${project.image}" alt="${project.name}">
                <button class="vote-button" onclick="handleProjectVote(${project.id}, 'down')">⬇</button>
            </div>
        `;
        projectsContainer.appendChild(projectDiv);
    });

    // Reattach event listeners for project voting buttons
    document.querySelectorAll(".vote-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            let projectId = parseInt(e.target.closest(".popular-project").dataset.id);
            let type = e.target.textContent === "⬆" ? "up" : "down";
            handleProjectVote(projectId, type);
        });
    });
}

// Comment Section Logic
function addComment() {
    let commentInput = document.getElementById("commentInput");
    let commentText = commentInput.value.trim();
    if (commentText === "") return;
    
    // Get the current comments from localStorage, or an empty array if none exist
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push(commentText); // Add the new comment to the list

    // Save updated comments to localStorage
    localStorage.setItem("comments", JSON.stringify(comments));

    // Clear the input field
    commentInput.value = "";

    // Display the updated comments
    displayComments();
}

function displayComments() {
    let commentList = document.getElementById("commentList");
    commentList.innerHTML = ""; // Clear the current comment list
    let comments = JSON.parse(localStorage.getItem("comments")) || [];

    // Create a div for each comment
    comments.forEach((comment, index) => {
        let commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.innerHTML = `
            <p>${comment}</p>
            <button class="delete-btn" onclick="deleteComment(${index})">Delete</button>
        `;
        commentList.appendChild(commentDiv);
    });

    // Reattach event listeners for delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
            let index = parseInt(e.target.getAttribute("onclick").match(/\d+/)[0]);
            deleteComment(index);
        });
    });
}

function deleteComment(index) {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.splice(index, 1); // Remove the comment at the given index
    localStorage.setItem("comments", JSON.stringify(comments)); // Save updated comments
    displayComments(); // Re-render the comment list
}

// Show More Button Logic
function toggleDescription() {
    let fullDescription = document.getElementById("fullDescription");
    let shortDescription = document.getElementById("shortDescription");
    let showMoreBtn = document.getElementById("showMoreBtn");

    if (fullDescription.style.display === "none" || fullDescription.style.display === "") {
        fullDescription.style.display = "block";
        shortDescription.style.display = "none";
        showMoreBtn.innerText = "Show Less";
    } else {
        fullDescription.style.display = "none";
        shortDescription.style.display = "block";
        showMoreBtn.innerText = "Show More";
    }
}

// Get elements
let newPostBtn = document.getElementById("newPostBtn");
let newPostModal = document.getElementById("newPostModal");
let closeModal = document.getElementById("closeModal");
let newPostForm = document.getElementById("newPostForm");
let submitPostBtn = document.getElementById("submitPostBtn");

// Open modal when "New Post" button is clicked
newPostBtn.addEventListener("click", function() {
    newPostModal.style.display = "flex";
});

// Close modal when "X" button is clicked
closeModal.addEventListener("click", function() {
    newPostModal.style.display = "none";
});

// Close modal if clicked outside of the modal content
window.addEventListener("click", function(event) {
    if (event.target === newPostModal) {
        newPostModal.style.display = "none";
    }
});

// Handle form submission
newPostForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get input values
    let title = document.getElementById("postTitle").value;
    let description = document.getElementById("postDescription").value;
    let image = document.getElementById("postImage").files[0];

    // Create a new post object
    let newPost = {
        title: title,
        description: description,
        image: image ? URL.createObjectURL(image) : null,
    };

    // You can store this new post in an array, or display it on the page
    console.log(newPost); // This will log the new post object to the console

    // Clear form
    newPostForm.reset();

    // Close the modal
    newPostModal.style.display = "none";

    // Optionally, display the new post in the UI
    // For example, you could create a new div for the post and append it to a section
    // This part is for displaying the post immediately after submission, you can adjust it according to your design.
    let postsContainer = document.getElementById("postsContainer"); // Assuming you have a container for posts
    let postDiv = document.createElement("div");
    postDiv.classList.add("post");
    postDiv.innerHTML = `
        <h3>${newPost.title}</h3>
        <p>${newPost.description}</p>
        ${newPost.image ? `<img src="${newPost.image}" alt="Post Image" />` : ""}
    `;
    postsContainer.appendChild(postDiv);
});




// Get the modal elements
let bookmarksModal = document.getElementById("bookmarksModal");
let closeBookmarksModal = document.getElementById("closeBookmarksModal");
let bookmarksButton = document.querySelector("a[href='bookmarks.html']"); // Select the Bookmarks button

// Show the modal when the "Bookmarks" button is clicked
bookmarksButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default link behavior
    bookmarksModal.style.display = "flex"; // Show the modal
});

// Close the modal when the "X" button is clicked
closeBookmarksModal.addEventListener("click", function() {
    bookmarksModal.style.display = "none"; // Hide the modal
});

// Close the modal if the user clicks outside of the modal content
window.addEventListener("click", function(event) {
    if (event.target === bookmarksModal) {
        bookmarksModal.style.display = "none"; // Hide the modal
    }
});


// Get the modal elements for Notifications
let notificationsModal = document.getElementById("notificationsModal");
let closeNotificationsModal = document.getElementById("closeNotificationsModal");
let notificationsButton = document.querySelector("a[href='notifications.html']"); // Select the Notifications button

// Show the modal when the "Notifications" button is clicked
notificationsButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default link behavior
    notificationsModal.style.display = "flex"; // Show the modal
});

// Close the modal when the "X" button is clicked
closeNotificationsModal.addEventListener("click", function() {
    notificationsModal.style.display = "none"; // Hide the modal
});

// Close the modal if the user clicks outside of the modal content
window.addEventListener("click", function(event) {
    if (event.target === notificationsModal) {
        notificationsModal.style.display = "none"; // Hide the modal
    }
});


