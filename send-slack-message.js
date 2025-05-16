require('dotenv').config(); // Loads variables from .env into process.env

const botToken = process.env.SLACK_BOT_TOKEN;
const slackChannelId = process.env.SLACK_TEST_CHANNEL_ID;

// Basic check to ensure variables are loaded
if (!botToken || !slackChannelId) {
    console.error("Error: SLACK_BOT_TOKEN or SLACK_TEST_CHANNEL_ID is not defined in your .env file.");
    console.error("Please ensure your .env file is correctly set up in the project root.");
    process.exit(1); // Exit the script if essential variables are missing
}
console.log("Environment variables loaded successfully.");
console.log("Attempting to send a message to channel:", slackChannelId);