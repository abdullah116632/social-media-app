const FRONTEND_URL = "http://localhost:3000"

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const status = urlParams.get("status");
const message = urlParams.get("message");

// Get elements
const body = document.body;
const container = document.querySelector(".container");
const statusTitle = document.getElementById("status-title");
const statusMessage = document.getElementById("status-message");
const actionLink = document.getElementById("action-link");

// Set message and styles based on status
if (status === "success") {
    body.classList.add("success");
    container.classList.add("success");
    statusTitle.textContent = "🎉 Email Verified Successfully!";
    statusMessage.textContent = message || "Your email has been successfully verified!";
    actionLink.textContent = "Proceed to Login";
    actionLink.href = `${FRONTEND_URL}/login`; // Redirect to login page
} else {
    body.classList.add("error");
    container.classList.add("error");
    statusTitle.textContent = "❌ Verification Failed!";
    statusMessage.textContent = message || "Something went wrong. Please try again.";
    actionLink.textContent = "Go to Register";
    actionLink.href = `${FRONTEND_URL}/register`; // Redirect to register page
}
