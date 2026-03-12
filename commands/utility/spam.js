const { isAllowed } = require("../../utils/allowedUsers");

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
    interaction.contextType = interaction.inGuild() ? "guild" : "user";

    // Restrict command usage to approved user IDs
    if (!isAllowed("spam", interaction.user.id, interaction.contextType)) {
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

async function handleChannelSpam(interaction, contextType) {
  const message = interaction.options.getString("message");
  const count = interaction.options.getInteger("count");

  const botInGuild = interaction.inGuild() && interaction.channel;
  const clientId = interaction.client.user.id;

  // Bot IS in the guild
  if (botInGuild) {
    const maxCount = 50;

    if (count > maxCount) {
      return interaction.reply({
        content: `Max count is **${maxCount}**.`,
        flags: 64,
      });
    }

    await interaction.reply({
      content: `Sending ${count} ${count === 1 ? "message" : "messages"}...`,
      flags: 64,
    });

    for (let i = 0; i < count; i++) {
      await interaction.channel.send(message);
    }

    return;
  }

  // Bot is NOT in the guild (user-installed command used in a guild)
  if (interaction.inGuild() && !botInGuild) {
    const maxCount = 5;
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}`;

    if (count > maxCount) {
      return interaction.reply({
        content: `Max count in servers I'm not a member of is **${maxCount}**.\n\nFor higher limits, please [invite the bot](${inviteUrl}).`,
        flags: 64,
      });
    }

    await interaction.reply({
      content: `Sending ${count} ${count === 1 ? "message" : "messages"}...`,
      flags: 64,
    });

    for (let i = 0; i < count; i++) {
      await interaction.followUp({ content: message });
    }

    return;
  }

  // DM context
  if (!interaction.inGuild()) {
    const maxCount = 5;

    if (count > maxCount) {
      return interaction.reply({
        content: `Max count in DMs is **${maxCount}**.`,
        flags: 64,
      });
    }

    await interaction.reply({
      content: `Sending ${count} ${count === 1 ? "message" : "messages"}...`,
      flags: 64,
    });

    for (let i = 0; i < count; i++) {
      await interaction.followUp({ content: message });
    }

    return;
  }
}

async function handleDmSpam(interaction) {
  const targetUser = interaction.options.getUser("user");
  const message = interaction.options.getString("message");
  const count = interaction.options.getInteger("count");
  const maxCount = 50;

  if (count > maxCount) {
    return interaction.reply({
      content: `Max count is **${maxCount}**.`,
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
