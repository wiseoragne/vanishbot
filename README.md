# VanishBot

A multipurpose Discord bot for utility, moderation, and testing with slash command support.

## Table of Contents

1. [Features](#1-features)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Configuration](#4-configuration)
5. [Deployment](#5-deployment)
6. [Running the Bot](#6-running-the-bot)
7. [Commands](#7-commands)
8. [Production Setup (Windows)](#8-production-setup-windows)
9. [Contributing](#9-contributing)
10. [Licence](#10-licence)

---

## 1. Features

- Spam testing commands for channels and direct messages
- User permission system with configurable access control
- Simplified JSON-based configuration
- 24/7 operation on Windows through service integration
- Slash command support
- Modular command and event architecture

## 2. Prerequisites

- **Node.js** v16.9.0 or higher ([https://nodejs.org/](https://nodejs.org/))
- **npm** (included with Node.js)
- **Discord Server** for testing
- **Discord Developer Account** ([https://discord.com/developers/applications](https://discord.com/developers/applications))

---

## 3. Installation

### Fork the Repository

1. Click the **Fork** button in the top-right corner of this repository
2. Clone your fork locally:

```bash
git clone https://github.com/wiseoragne/vanishbot.git
cd vanishbot
```

### Install Dependencies

```powershell
npm install
```

---

## 4. Configuration

### Configure Bot Credentials

1. Navigate to the `config/` folder
2. Rename `example.bot.json` to `bot.json`
3. Add your Discord bot credentials:

```json
{
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID"
}
```

**Obtaining credentials:**
- Visit [Discord Developer Portal](https://discord.com/developers/applications)
- Create a new application or select an existing one
- Navigate to the **Bot** section and create a bot
- Copy the **Token** value
- Go to **General Information** and copy the **Application ID**

> [!TIP]  
> To keep your bot token secure, add `bot.json` to `.gitignore` to prevent accidental commits.

### Configure Allowed Users

1. Navigate to the `config/` folder
2. Rename `example.allowedUsers.json` to `allowedUsers.json`
3. Add authorised Discord user IDs:

```json
[
  "YOUR_DISCORD_USER_ID",
  "ANOTHER_USER_ID"
]
```

**Finding your Discord user ID:**
- Enable Developer Mode (User Settings > Advanced > Developer Mode)
- Right-click any username and select "Copy User ID"

---

## 5. Deployment

Deploy your commands to Discord:

```powershell
npm run deploy
```

This registers all slash commands with Discord. Run this again after adding or modifying commands.

---

## 6. Running the Bot

### Development

Start the bot locally:

```powershell
npm start
```

Stop with `Ctrl+C`.

---

## 7. Commands

### Spam Commands

| Command | Parameters | Description |
|---------|------------|-------------|
| `/spam channel` | message, count | Send a message multiple times in the current channel |
| `/spam dm` | user, message, count | Send a message multiple times to a user's direct messages |

> [!NOTE]  
> These commands are restricted to users in `allowedUsers.json`.

---

## 8. Production Setup (Windows)

To run VanishBot continuously as a Windows service, use NSSM (Non-Sucking Service Manager).

### Installation

1. Download and install NSSM from [https://nssm.cc/download](https://nssm.cc/download)
2. Extract and add to your system PATH, or use the full path in commands below
3. Open PowerShell as Administrator and run:

```powershell
nssm install VanishBot "C:\Program Files\nodejs\node.exe" "C:\path\to\vanishbot\index.js"
```

Replace the path with your actual bot directory.

### Service Management

```powershell
nssm start VanishBot       # Start the service
nssm stop VanishBot        # Stop the service
nssm restart VanishBot     # Restart the service
nssm status VanishBot      # Check service status
nssm remove VanishBot confirm  # Remove the service
```

The service will automatically start on system boot and restart if the bot process fails.

---

## 9. Contributing

To contribute to this project:

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request with a description of your changes

---

## 10. Licence

This project is open source and available for use and modification.

---

## Troubleshooting

- **Bot not responding:** Verify the bot is online in your Discord server
- **Commands not showing:** Run `npm run deploy` to refresh slash commands
- **Permission errors:** Check that your user ID is in `allowedUsers.json`
- **Token errors:** Verify your bot token in `bot.json` is correct
