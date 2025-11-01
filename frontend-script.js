        // Basic JavaScript to handle form submission
        document.getElementById('submitBtn').addEventListener('click', function() {
            const form = document.getElementById('feedbackForm');
            
            if (form.checkValidity()) {
                // Collect form data
                const formData = {
                    userName: document.getElementById('userName').value,
                    password: document.getElementById('userPassword').value,
                    userEmail: document.getElementById('userEmail').value,
                    userMessage: document.getElementById('userMessage').value
                };
                console.log('Form data:', formData);

                console.log("Sending data to backend:", formData); // Keep this for debugging

// Replace the old console.log and alert with this fetch call:
fetch('http://localhost:3000/api/submit-feedback', { // Use the correct server port
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', // Tell the server we're sending JSON
    },
    body: JSON.stringify(formData), // Convert the JavaScript object to a JSON string
})
.then(response => {
    if (!response.ok) {
        // If server response is not 2xx, throw an error to be caught by .catch()
        return response.json().then(errData => { throw new Error(errData.message || 'Server responded with an error') });
    }
    return response.json(); // Parse the JSON response from the server
})
.then(data => {
    console.log('Success response from server:', data);
    alert(data.message || 'Feedback submitted successfully!');
    // Optionally, clear the form fields:
    // userNameInput.value = '';
    // userEmailInput.value = '';
    // userMessageInput.value = '';
    // Or feedbackForm.reset(); if feedbackForm is your <form> element
})
.catch((error) => {
    console.error('Error sending data to server:', error);
    alert('Failed to submit feedback. ' + error.message);
});
                
                // Clear form after submission
                form.reset();
                alert('Thank you for your feedback!');
            }
            else {
                console.error('Form validation failed. Please fill out all required fields.');
            }
        });
