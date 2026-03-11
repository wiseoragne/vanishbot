const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

const config = require("./config/bot.json");

// Collect all command definitions
const commands = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((f) => f.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data);
  }
}

// Initialise REST client
const rest = new REST({ version: "10" }).setToken(config.token);

// Deploy global application commands
(async () => {
  try {
    console.log(`Deploying ${commands.length} command(s)...`);

    await rest.put(Routes.applicationCommands(config.clientId), {
      body: commands,
    });

    for (const command of commands) {
      console.log(`Deployed: ${command.name}`);
    }

    console.log("Deployment complete.");
  } catch (error) {
    console.error(error);
  }
})();
