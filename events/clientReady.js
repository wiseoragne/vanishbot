const { loadAllowedUsers } = require("../utils/allowedUsers");

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);

    try {
      await loadAllowedUsers(client);
      console.log("Allowed users loaded.");
    } catch (err) {
      console.error("Failed to load allowedUsers:", err);
    }
  },
};
