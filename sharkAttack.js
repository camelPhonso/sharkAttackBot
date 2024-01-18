require("dotenv").config()
const Discord = require("discord.js")

// setup client
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
  ],
})
client.login(process.env.DISCORD_TOKEN)

// event handling
client.on("messageCreate", () => {
  console.log("ATTACK!")
})
