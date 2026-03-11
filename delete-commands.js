const { REST, Routes } = require("discord.js");

const config = require("./config/bot.json");

// Initialise REST client
const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("Fetching deployed global commands...");

    const commands = await rest.get(
      Routes.applicationCommands(config.clientId),
    );

    if (commands.length === 0) {
      console.log("No commands to delete.");
      return;
    }

    console.log(`Found ${commands.length} command(s). Deleting...`);

    for (const command of commands) {
      await rest.delete(Routes.applicationCommand(config.clientId, command.id));
      console.log(`Deleted: ${command.name}`);
    }

    console.log("All commands deleted successfully.");
  } catch (error) {
    console.error(error);
  }
})();
