// Function to open the profile modal
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'flex';
    modal.classList.add('fadeIn'); // Add fadeIn animation
}

// Function to close the profile modal
function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.classList.remove('fadeIn'); // Remove fadeIn animation
    modal.classList.add('fadeOut'); // Add fadeOut animation

    // Wait for the animation to finish before hiding the modal
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('fadeOut'); // Remove fadeOut animation
    }, 300); // Match the duration of the fadeOut animation
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('profileModal');
    if (event.target === modal) {
        closeProfileModal();
    }
}