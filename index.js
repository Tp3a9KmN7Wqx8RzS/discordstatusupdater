const axios = require('axios');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const statuses = [
    { text: "this" },
    { text: "is" },
    { text: "me" }
];
let statusIndex = 0;

const updateStatus = async () => {
    const status = statuses[statusIndex];
    statusIndex = (statusIndex + 1) % statuses.length;

    try {
        await axios.patch('https://discord.com/api/v9/users/@me/settings', 
            {
                custom_status: status
            },
            {
                headers: {
                    Authorization: process.env.DISCORD_TOKEN,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`Status updated to: ${status.text}`);
        // Wait for 2.9 seconds before updating the status again
        setTimeout(updateStatus, 2900);
    } catch (error) {
        if (error.response && error.response.status === 429) {
            const retryAfter = error.response.headers['retry-after'] * 1000;
            console.error(`Rate limited. Retrying after ${retryAfter} milliseconds.`);
            setTimeout(updateStatus, retryAfter);
        } else {
            console.error(`Error updating status: ${error.message}`);
            // Retry after a default delay if an error occurs
            setTimeout(updateStatus, 5000);
        }
    }
};

// Initial update
updateStatus();

// Create a simple HTTP server to keep Render.com happy
app.get('/', (req, res) => {
    res.send('Discord Status Updater is running.');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
