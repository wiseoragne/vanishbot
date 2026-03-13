const { isAllowed } = require("../../utils/allowlist");

module.exports = {
  data: {
    name: "invite",
    description: "Get the link to invite the bot to your server.",
    integration_types: [0, 1], // Supports both guild installation and user installation
    contexts: [0, 1, 2], // Enables usage in guilds, bot DMs, and private DMs
  },

  async execute(interaction) {
    interaction.contextType = interaction.inGuild() ? "guild" : "user";

    // Permission check
    const permissionKey = "invite";
    if (!isAllowed(permissionKey, interaction.user.id, interaction.contextType)) {
      return interaction.reply({
        content: "You are not allowed to use this command.",
        flags: 64,
      });
    }

    const clientId = interaction.client.user.id;
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}`;

    // DM context
    if (interaction.contextType === "user") {
      return interaction.reply({
        content: `You cannot invite the bot to a DM, but you can still invite it to a server using this link:\n\n${inviteUrl}`,
        flags: 64,
      });
    }

    // Guild context
    return interaction.reply({
      content: `Use this link to invite the bot to your server:\n\n${inviteUrl}`,
      flags: 64,
    });
  },
};
