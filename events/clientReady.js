const { loadAllowlist } = require("../utils/allowlist");

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);

    try {
      await loadAllowlist(client);
      console.log("Allowlist loaded.");
    } catch (err) {
      console.error("Failed to load allowlist:", err);
    }
  },
};
