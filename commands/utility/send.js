const { isAllowed } = require("../../utils/allowedUsers");

module.exports = {
  data: {
    name: "message",
    description: "Send a message in a channel or DM a user multiple times.",
    integration_types: [0, 1], // Supports both guild installation and user installation
    contexts: [0, 1, 2], // Enables usage in guilds, bot DMs, and private DMs
    options: [
      {
        type: 1,
        name: "here",
        description: "Send a message in the current channel",
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
            description: "How many times to send it (default is 1)",
            required: false,
          },
          {
            type: 3,
            name: "reply",
            description: "Message ID to reply to (servers only)",
            required: false
          },
        ],
      },
      {
        type: 1,
        name: "user",
        description: "Send a message to a user via DM",
        options: [
          {
            type: 6,
            name: "user",
            description: "User to message",
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
            description: "How many times to send it (default is 1)",
            required: false,
          },
        ],
      },
    ],
  },

  async execute(interaction) {
    interaction.contextType = interaction.inGuild() ? "guild" : "user";

    const subcommand = interaction.options.getSubcommand();

    // Differentiate permissions
    const permissionKey = `message ${subcommand}`;

    if (!isAllowed(permissionKey, interaction.user.id, interaction.contextType)) {
      return interaction.reply({
        content: "You are not allowed to use this command.",
        flags: 64,
      });
    }

    if (subcommand === "here") {
      await handleChannelMsg(interaction);
    } else if (subcommand === "user") {
      await handleDmMsg(interaction);
    }
  },
};

async function handleChannelMsg(interaction) {
  const message = interaction.options.getString("message");
  const count = interaction.options.getInteger("count") ?? 1;

  const botInGuild = interaction.inGuild() && interaction.channel;
  const clientId = interaction.client.user.id;

  const replyID = interaction.options.getString("reply");
  let reference = null;

  // Bot IS in the guild
  if (botInGuild) {
    const maxCount = 50;

    if (count > maxCount) {
      return interaction.reply({
        content: `Max count is **${maxCount}**.`,
        flags: 64,
      });
    }

    // If replyID was provided, try to fetch the message
    if (replyID) {
      try {
        const targetMessage = await interaction.channel.messages.fetch(replyID);
        reference = { messageReference: targetMessage.id };
      } catch {
        return interaction.reply({
          content: `I couldn't find a message with ID **${replyID}** in this channel.`,
          flags: 64,
        });
      }
    }


    await interaction.reply({
      content: `Sending ${count} ${count === 1 ? "message" : "messages"}...`,
      flags: 64,
    });

    for (let i = 0; i < count; i++) {
      await interaction.channel.send({
        content: message,
        reply: reference ?? undefined,
      });
    }

    return;
  }

  // Bot is NOT in the guild (user-installed command used in a guild)
  if (interaction.contextType === "guild" && !botInGuild) {
    const maxCount = 5;
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}`;

    if (count > maxCount) {
      return interaction.reply({
        content: `Max count in servers I'm not a member of is **${maxCount}**.\n\nFor higher limits, please [invite me](${inviteUrl}).`,
        flags: 64,
      });
    }

    if (replyID) {
      return interaction.reply({
        content: `The reply feature only works in servers I'm a member of.\n\nPlease [invite me](${inviteUrl}) to reply to messages.`,
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
  if (interaction.contextType === "user") {
    const maxCount = 5;

    if (count > maxCount) {
      return interaction.reply({
        content: `Max count in DMs is **${maxCount}**.`,
        flags: 64,
      });
    }

    if (replyID) {
      return interaction.reply({
        content: "The reply feature does not support DMs.",
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

async function handleDmMsg(interaction) {
  const targetUser = interaction.options.getUser("user");
  const message = interaction.options.getString("message");
  const count = interaction.options.getInteger("count") ?? 1;
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
