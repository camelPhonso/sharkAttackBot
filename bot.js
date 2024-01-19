import "dotenv/config"

import client from "./utils/bot/client.js"
import createAssistant from "./utils/gpt/assistant.js"
import createThread from "./utils/gpt/thread.js"
import runAssistant from "./utils/gpt/run.js"

let assistant_id = ""
let thread_id = ""

client.login(process.env.DISCORD_TOKEN)

client.on("ready", async () => {
  assistant_id = await createAssistant()
  thread_id = await createThread()
  console.log("ATTACK!")
})

client.on("messageCreate", async userInput => {
  if (userInput.author.bot) return

  const botResponse = await runAssistant(assistant_id, thread_id)

  userInput.reply(botResponse)
})
