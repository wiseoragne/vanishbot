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

    // Replace "botOwner" placeholders in defaults
    ["user", "guild"].forEach(type => {
        allowedConfig.default[type] = allowedConfig.default[type].map(entry =>
            entry === "botOwner" ? botOwnerId : entry
        );
    });

    // Replace "botOwner" placeholders in overrides
    for (const command of Object.keys(allowedConfig.overrides)) {
        ["user", "guild"].forEach(type => {
            allowedConfig.overrides[command][type] =
                allowedConfig.overrides[command][type].map(entry =>
                    entry === "botOwner" ? botOwnerId : entry
                );
        });
    }
}

function isAllowed(commandName, userId, contextType) {
    if (!allowedConfig) {
        throw new Error("allowedUsers not loaded. Call loadAllowedUsers(client) first.");
    }

    const override = allowedConfig.overrides[commandName];

    // If override exists AND is non-empty > use override
    if (override && override[contextType].length > 0) {
        return override[contextType].includes(userId);
    }

    // Otherwise use global defaults
    return allowedConfig.default[contextType].includes(userId);
}

module.exports = {
    loadAllowedUsers,
    isAllowed
};
