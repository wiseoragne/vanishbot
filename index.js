const fs = require("fs");
const path = require("path");
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const config = require("./config/bot.json");

// Initialise client with required intents and partials
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
client.commandArray = [];

// Load command modules
const commandsPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs
    .readdirSync(folderPath)
    .filter((f) => f.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    client.commandArray.push(command.data);
  }
}

// Load event modules
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Global error handling for unexpected promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

// Global error handling for synchronous exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Discord client-level error handling
client.on("error", (error) => {
  console.error("Client Error:", error);
});

// WebSocket/shard-level error handling
client.on("shardError", (error) => {
  console.error("WebSocket Error:", error);
});

client.login(config.token);
