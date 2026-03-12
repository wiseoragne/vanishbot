const fs = require("fs");
const path = require("path");

let allowedConfig = null;
let botOwnerId = null;

async function loadAllowedUsers(client) {
    const raw = fs.readFileSync(
        path.join(__dirname, "../config/allowedUsers.json"),
        "utf8"
    );

    allowedConfig = JSON.parse(raw);

    // Fetch bot owner
    const app = await client.application.fetch();
    botOwnerId = app.owner.id;

    // Replace "botOwner" placeholders (assuming single-user ownership)
    for (const command of Object.keys(allowedConfig)) {
        ["user", "guild"].forEach(type => {
            allowedConfig[command][type] = allowedConfig[command][type].map(entry =>
                entry === "botOwner" ? botOwnerId : entry
            );
        });
    }
}

function isAllowed(commandName, userId, contextType) {
    if (!allowedConfig) {
        throw new Error("allowedUsers not loaded. Call loadAllowedUsers(client) first.");
    }

    const command = allowedConfig[commandName];
    if (!command) return false;

    return command[contextType]?.includes(userId) ?? false;
}

module.exports = {
    loadAllowedUsers,
    isAllowed
};
