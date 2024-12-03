document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');
    
    const title = document.getElementById("title");
    const messageElem = document.getElementById("message");
    const link = document.getElementById("link");
    const container = document.querySelector(".container");
    
    if (status === "success") {
        title.textContent = "Verification Successful!";
        messageElem.textContent = message || "Your email has been successfully verified!";
        container.classList.add("success");
        link.textContent = "Proceed";
        link.href = "/dashboard";  // Example of success link destination
    } else {
        title.textContent = "Verification Failed";
        messageElem.textContent = message || "There was an issue with your verification.";
        container.classList.add("error");
        link.textContent = "Back";
        link.href = "/";  // Link for error, which can take the user to the homepage or retry page
    }
});
