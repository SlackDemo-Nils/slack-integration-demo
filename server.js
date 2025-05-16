require('dotenv').config(); // Load .env variables first
const express = require('express');
const { WebClient } = require('@slack/web-api'); // We'll need this

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000; // Use port from .env or default
const slackToken = process.env.SLACK_BOT_TOKEN;
const slackChannelId = process.env.SLACK_TEST_CHANNEL_ID;

if (!slackToken || !slackChannelId) {
    console.error("CRITICAL ERROR: Slack token or channel ID is missing from .env file.");
    process.exit(1); // Stop the server if config is missing
}
const slackClient = new WebClient(slackToken);
// Middleware to parse incoming JSON requests (IMPORTANT!)
app.use(express.json());
// A simple test route to see if the server is running
app.get('/', (req, res) => {
    res.send('Hello from the Feedback Server! The server is alive.');
});

app.post('/api/submit-feedback', (req, res) => {
    const formData = req.body; // Thanks to app.use(express.json())!
    console.log('Received feedback data on backend:', formData);
    // For now, just acknowledge receipt
    // In a real app, you'd do validation here
    if (formData && formData.userName && formData.userMessage) {
        res.status(200).json({ success: true, message: 'Feedback data received by server.' });
    } else {
        res.status(400).json({ success: false, message: 'Missing required form data.' });
    }
});

// We will add our POST route for feedback here soon
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Slack Bot Token Loaded: ${slackToken ? 'Yes' : 'NO!'}`);
    console.log(`Target Slack Channel ID: ${slackChannelId}`);
});