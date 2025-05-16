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

/**
 * API endpoint for submitting feedback 
 */
app.post('/api/submit-feedback', async (req, res) => {
    const formData = req.body;
    console.log('Received feedback for Slack:', formData);
    if (!formData || !formData.userName || !formData.userMessage) {
        return res.status(400).json({ success: false, message: 'Missing required form data for Slack.' });
    }

    // 1. Define fallback text (for notifications)
const fallbackText = `New Feedback from ${formData.userName || 'User'}: ${formData.userMessage ? formData.userMessage.substring(0,50) : 'No message content'}...`;

// 2. Construct your Blocks payload dynamically
// (This is where you'd paste and then modify the JSON from Block Kit Builder)
const blocksPayload = [
    {
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "🚀 New Feedback Received!",
				"emoji": true
			}
		},
		{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            // Dynamically insert formData here:
            "text": `👤 *Name:* ${formData.userName}\n\n📧 *Email:* ${formData.userEmail}\n\n💬 *Message:* ${formData.userMessage}`
        }
    }, 
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Test Button",
						"emoji": true
					},
					"style": "primary",
					"value": "click_me_123",
					"action_id": "actionId-0"
				},
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Acknowledge",
                    "emoji": true
                },
                "style": "primary",
                "value": `ack_feedback_for_${formData.userName.replace(/\s+/g, '_')}`, // Example dynamic value
                "action_id": "acknowledge_feedback_button" // Must match your intended action_id
            }
            // You could add another button, e.g., a "View Details" button that links somewhere
        ]
    }
];



try {
    console.log(`Attempting to send Block Kit message to Slack channel: ${slackChannelId}`);
    const result = await slackClient.chat.postMessage({
        channel: slackChannelId,
        text: fallbackText,    // Fallback text
        blocks: blocksPayload  // The rich Block Kit message
    });
    if (result.ok) {
        console.log('Block Kit Message successfully sent to Slack. Timestamp:', result.ts);
        // It's useful to store or log result.ts, it's the ID of the message
        res.status(200).json({ success: true, message: 'Feedback received and rich message sent to Slack!', ts: result.ts });
    } else {
        console.error('Slack API returned an error (Block Kit):', result.error);
        res.status(500).json({ success: false, message: 'Server received data, but failed to send Block Kit message to Slack.' });
    }
} catch (error) {
    console.error('Error sending Block Kit message via Slack SDK:', error);
    res.status(500).json({ success: false, message: 'Internal server error while trying to contact Slack with Block Kit.' });
}
});

// We will add our POST route for feedback here soon
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Slack Bot Token Loaded: ${slackToken ? 'Yes' : 'NO!'}`);
    console.log(`Target Slack Channel ID: ${slackChannelId}`);
});