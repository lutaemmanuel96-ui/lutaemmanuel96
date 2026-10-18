const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

// Simple JSON file to store users (acts as our database for now)
const DB_FILE = './users.json';

function getUsers() {
    if (!fs.existsSync(DB_FILE)) return {};
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveUsers(users) {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

// Configure Nodemailer to send real emails via Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lutaemmanuel96@gmail.com', // Your Gmail
        pass: 'YOUR_GMAIL_APP_PASSWORD'  // Use a Google App Password, not your real password
    }
});

// 1. SIGNUP ROUTE
app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();

    if (users[email]) {
        return res.status(400).json({ message: 'User already exists!' });
    }

    users[email] = { password, isVerified: true }; // Simplified for now
    saveUsers(users);

    res.json({ message: 'Account created successfully!' });
});

// 2. LOGIN ROUTE
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();

    if (!users[email] || users[email].password !== password) {
        return res.status(400).json({ message: 'Invalid email or password!' });
    }

    res.json({ message: 'Login successful!' });
});

// 3. FORGOT PASSWORD ROUTE (Sends Real Email)
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const users = getUsers();

    if (!users[email]) {
        return res.status(400).json({ message: 'Email not found in our records!' });
    }

    const mailOptions = {
        from: 'lutaemmanuel96@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        text: 'Hello, you requested a password reset for your account. (Backend Server Integration Successful!)'
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Real email sent successfully to your inbox!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send email', error: error.toString() });
    }
});

app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});