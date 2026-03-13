const { reloadAllowlist, isAllowed } = require("../../utils/allowlist");

module.exports = {
  data: {
    name: "reload",
    description: "Reload internal bot systems.",
    integration_types: [0, 1], // Supports both guild installation and user installation
    contexts: [0, 1, 2], // Enables usage in guilds, bot DMs, and private DMs
    options: [
      {
        type: 1,
        name: "allowlist",
        description: "Reload the allowlist configuration",
      },
    ],
  },

  async execute(interaction) {
    interaction.contextType = interaction.inGuild() ? "guild" : "user";

    const subcommand = interaction.options.getSubcommand();

    // Differentiate permissions
    const permissionKey = `reload ${subcommand}`;

    if (!isAllowed(permissionKey, interaction.user.id, interaction.contextType)) {
      return interaction.reply({
        content: "You are not allowed to use this command.",
        flags: 64,
      });
    }

    if (subcommand === "allowlist") {
      await handleAllowlistReload(interaction);
    }
  },
};

async function handleAllowlistReload(interaction) {
  try {
    await reloadAllowlist(interaction.client);

    return interaction.reply({
      content: "Reloaded allowlist.",
      flags: 64,
    });
  } catch (err) {
    console.error("Error reloading allowlist:", err);

    return interaction.reply({
      content: "Failed to reload allowlist.",
      flags: 64,
    });
  }
}
