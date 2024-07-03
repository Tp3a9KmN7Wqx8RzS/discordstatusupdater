const axios = require('axios');
require('dotenv').config();

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
    } catch (error) {
        if (error.response && error.response.status === 429) {
            const retryAfter = error.response.headers['retry-after'];
            console.error(`Rate limited. Retrying after ${retryAfter} milliseconds.`);
            setTimeout(updateStatus, retryAfter);
        } else {
            console.error(`Error updating status: ${error.message}`);
        }
    }
};

// Initial update
updateStatus();

// Regular interval updates
setInterval(updateStatus, 2900); // Update every 2.9 seconds
