const fs = require("fs");
const path = require("path");

let allowlist = null;
let botOwnerId = null;

async function loadAllowlist(client) {
    const raw = fs.readFileSync(
        path.join(__dirname, "../config/allowlist.json"),
        "utf8"
    );

    allowlist = JSON.parse(raw);

    // Fetch bot owner
    const app = await client.application.fetch();
    botOwnerId = app.owner.id;

    // Replace "botOwner" placeholders in defaults
    ["user", "guild"].forEach(type => {
        allowlist.default[type] = allowlist.default[type].map(entry =>
            entry === "botOwner" ? botOwnerId : entry
        );
    });

    // Replace "botOwner" placeholders in overrides
    for (const command of Object.keys(allowlist.overrides)) {
        ["user", "guild"].forEach(type => {
            allowlist.overrides[command][type] =
                allowlist.overrides[command][type].map(entry =>
                    entry === "botOwner" ? botOwnerId : entry
                );
        });
    }
}

function isAllowed(commandName, userId, contextType) {
    if (!allowlist) {
        throw new Error("Allowlist not loaded. Call loadAllowlist(client) first.");
    }

    const override = allowlist.overrides[commandName];

    // If override exists AND is non-empty > use override
    if (override && override[contextType].length > 0) {
        return override[contextType].includes(userId);
    }

    // Otherwise use global defaults
    return allowlist.default[contextType].includes(userId);
}

// Added for reload command
async function reloadAllowlist(client) {
    await loadAllowlist(client);
}

module.exports = {
    loadAllowlist,
    isAllowed,
    reloadAllowlist,
};
