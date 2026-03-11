# VanishBot

Multipurpose Discord bot for utility, moderation, and fun.

## Setup

```powershell
npm install
```

Rename `example.bot.json` to `bot.json` and add your credentials:
```json
{
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID"
}
```

Get these from [Discord Developer Portal](https://discord.com/developers/applications).

Rename `example.allowedUsers.json` to `allowedUsers.json`and add Discord user IDs to grant them permission to use VanishBot:
```json
[
  "YOUR_USER_ID",
  "ANOTHER_USER_ID"
]
```

Deploy commands:
```powershell
npm run deploy
```

## Run Locally
```powershell
npm start
```

## Run 24/7 (Windows)

Install [NSSM](https://nssm.cc/download).

```powershell
nssm install VanishBot "C:\Program Files\nodejs\node.exe" "C:\path\to\vanishbot\index.js"
nssm start VanishBot
```

Auto-starts on boot. Restart with `nssm restart VanishBot`.

## Commands

- **`/spam channel [message] [count]`** - Spam message in channel
- **`/spam dm [user] [message] [count]`** - Spam message via DM

> [!NOTE]  
> Some commands are restricted to allowed users only.
