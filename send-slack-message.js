require('dotenv').config(); // Loads variables from .env into process.env
const { WebClient } = require('@slack/web-api'); // Import the WebClient class

const botToken = process.env.SLACK_BOT_TOKEN;
const slackChannelId = process.env.SLACK_TEST_CHANNEL_ID;

if (!botToken || !slackChannelId) {
    console.error("Error: SLACK_BOT_TOKEN or SLACK_TEST_CHANNEL_ID is not defined in your .env file.");
    console.error("Please ensure your .env file is correctly set up in the project root.");
    process.exit(1);
}
console.log("Environment variables loaded. Initializing Slack WebClient...");
// Initialize the Slack WebClient with your bot token

const web = new WebClient(botToken);
// Define an asynchronous function to send the message
async function sendMessageToSlack() {
    try {
        console.log(`Sending message to channel ${slackChannelId}...`);
        // Call the chat.postMessage method using the WebClient
        const result = await web.chat.postMessage({
            channel: slackChannelId,
            text: "Hello from my Node.js app! This message was sent at " + new Date().toLocaleString()
        });
        if (result.ok) {
            console.log("Message sent successfully to Slack! Timestamp:", result.ts);
        } else {
            // If Slack API returns an error in the response (but not a network error)
            console.error("Slack API returned an error:", result.error);
        }
    } catch (error) {
        // If there's a network error or other issue with the API call itself
        console.error("Error sending message to Slack:", error);
    }
}
// Call the function to send the message
sendMessageToSlack();