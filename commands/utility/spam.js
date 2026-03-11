const allowedUsers = require("../../config/allowedUsers.json");

module.exports = {
  data: {
    name: "spam",
    description: "Send a message multiple times",
    integration_types: [0, 1], // Supports both guild installation and user installation
    contexts: [0, 1, 2], // Enables usage in guilds, bot DMs, and private DMs
    options: [
      {
        type: 1,
        name: "channel",
        description: "Spam a message in the current channel",
        options: [
          {
            type: 3,
            name: "message",
            description: "Message to send",
            required: true,
          },
          {
            type: 4,
            name: "count",
            description: "How many times to send it",
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: "dm",
        description: "Spam a message to a user via DM",
        options: [
          {
            type: 6,
            name: "user",
            description: "User to spam",
            required: true,
          },
          {
            type: 3,
            name: "message",
            description: "Message to send",
            required: true,
          },
          {
            type: 4,
            name: "count",
            description: "How many times to send it",
            required: true,
          },
        ],
      },
    ],
  },

  async execute(interaction) {
    // Restrict command usage to approved user IDs
    if (!allowedUsers.includes(interaction.user.id)) {
      return interaction.reply({
        content: "You are not allowed to use this command.",
        flags: 64,
      });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "channel") {
      await handleChannelSpam(interaction);
    } else if (subcommand === "dm") {
      await handleDmSpam(interaction);
    }
  },
};

async function handleChannelSpam(interaction) {
  const message = interaction.options.getString("message");
  const count = interaction.options.getInteger("count");

  // Apply different limits depending on context
  const maxCount = interaction.inGuild() ? 50 : 5;

  if (count > maxCount) {
    return interaction.reply({
      content: `Max count for this context is **${maxCount}**.`,
      flags: 64,
    });
  }

  // Acknowledge the command before sending additional messages
  await interaction.reply({
    content: `Sending ${count} ${count === 1 ? 'message' : 'messages'}...`,
    flags: 64,
  });

  // Send messages to the channel or DM
  if (!interaction.inGuild()) {
    // Use followUp for DMs since there's no channel to send to
    for (let i = 0; i < count; i++) {
      await interaction.followUp({
        content: message
      });
    }
  } else {
    // Send messages to the guild channel
    for (let i = 0; i < count; i++) {
      await interaction.channel.send(message);
    }
  }
}

async function handleDmSpam(interaction) {
  const targetUser = interaction.options.getUser("user");
  const message = interaction.options.getString("message");
  const count = interaction.options.getInteger("count");
  const maxCount = 50;

  if (count > maxCount) {
    return interaction.reply({
      content: `Max count is ${maxCount}.`,
      flags: 64,
    });
  }

  // Acknowledge the command before sending additional messages
  await interaction.reply({
    content: `Sending ${count} ${count === 1 ? 'message' : 'messages'} to <@${targetUser.id}>...`,
    flags: 64,
  });

  // Send DMs to the target user
  try {
    for (let i = 0; i < count; i++) {
      await targetUser.send(message);
    }
  } catch (error) {
    await interaction.followUp({
      content: `Error sending DM to <@${targetUser.id}>. They may have DMs disabled.`,
      flags: 64,
    });
  }
}
