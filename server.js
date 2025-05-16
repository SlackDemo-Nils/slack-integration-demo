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

app.post('/api/submit-feedback', async (req, res) => {
    const formData = req.body;
    console.log('Received feedback for Slack:', formData);
    if (!formData || !formData.userName || !formData.userMessage) {
        return res.status(400).json({ success: false, message: 'Missing required form data for Slack.' });
    }
    // Construct a dynamic message for Slack using the form data
    const slackMessageText = `🚀 New Feedback Submitted! 🚀\n
    👤 Name: ${formData.userName}\n
    📧 Email: ${formData.userEmail || 'Not provided'}\n
    💬 Message: ${formData.userMessage}`;
    try {
        console.log(`Attempting to send to Slack channel: ${slackChannelId}`);
        const result = await slackClient.chat.postMessage({
            channel: slackChannelId,
            text: slackMessageText
            // You could add Block Kit here for richer messages later!
        });
        if (result.ok) {
            console.log('Message successfully sent to Slack. Timestamp:', result.ts);
            res.status(200).json({ success: true, message: 'Feedback received and sent to Slack!' });
        } else {
            console.error('Slack API returned an error:', result.error);
            // Don't send detailed Slack errors to the client for security
            res.status(500).json({ success: false, message: 'Server received data, but failed to send to Slack.' });
        }
    } catch (error) {
        console.error('Error sending message via Slack SDK:', error);
        res.status(500).json({ success: false, message: 'Internal server error while trying to contact Slack.' });
    }
});

// We will add our POST route for feedback here soon
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Slack Bot Token Loaded: ${slackToken ? 'Yes' : 'NO!'}`);
    console.log(`Target Slack Channel ID: ${slackChannelId}`);
});