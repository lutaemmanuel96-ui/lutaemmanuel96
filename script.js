// Replace this with your actual Render URL when deployed
const BASE_URL = 'https://luta-backend.onrender.com';

// 1. Handle Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert('Unable to connect to the backend server.');
        }
    });
}

// 2. Handle Forgot Password (Triggers Real Email)
const forgotLink = document.getElementById('forgotPasswordLink');
if (forgotLink) {
    forgotLink.addEventListener('click', async function(e) {
        e.preventDefault();
        const email = prompt("Enter your registered email address:");
        if (email) {
            alert("Sending real email via backend server...");
            try {
                const response = await fetch(`${BASE_URL}/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                alert(data.message);
            } catch (error) {
                alert('Failed to reach the email service.');
            }
        }
    });
}