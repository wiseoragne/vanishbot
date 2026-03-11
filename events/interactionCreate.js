module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error("Command Execution Error:", error);

      // If the interaction has already been acknowledged, use followUp
      if (interaction.replied || interaction.deferred) {
        try {
          await interaction.followUp({
            content:
              "An unexpected error occurred while executing this command.",
            flags: 64,
          });
        } catch (_) {
          // Prevent cascading failures
        }
        return;
      }

      // If not yet acknowledged, send a normal reply
      try {
        await interaction.reply({
          content: "An unexpected error occurred while executing this command.",
          flags: 64,
        });
      } catch (_) {
        // Final fallback to avoid crashes
      }
    }
  },
};
