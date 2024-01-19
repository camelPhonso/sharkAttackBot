require("dotenv").config()
const Discord = require("discord.js")
const OpenAI = require("openai")
const gpt = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// setup Discord client
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
  ],
})
client.login(process.env.DISCORD_TOKEN)

const createAssistant = async () => {
  const assistant = await gpt.beta.assistants.create({
    name: "Shark",
    instructions:
      "You are a shark-rights activist and always start your answers by shouting SHARK ATTACK and then citing a fact about sharks that vaguely relates to the conversation.",
    model: "gpt-3.5-turbo",
  })

  return assistant.id
}

const createThread = async () => {
  const thread = await gpt.beta.threads.create()

  return thread.id
}

const activeRun = async thread_id => {
  const allRuns = (await gpt.beta.threads.runs.list(thread_id).data) || []
  if (allRuns.length === 0) {
    return await gpt.beta.threads.runs.create(thread_id, { assistant_id })
  }

  const activeRun = allRuns.find(
    run => (run.status === "queued") | (run.status === "in_progress")
  )

  return activeRun
}

const runAssistant = async (assistant_id, thread_id) => {
  let run = await activeRun(thread_id, assistant_id)
  console.log({ run })

  while (run.status !== "completed") {
    await new Promise(resolve => setTimeout(resolve, 200))
    run = await gpt.beta.threads.runs.retrieve(thread_id, run.id)
  }

  const allThreadMessages = await gpt.beta.threads.messages.list(thread_id)
  const latestThreadMessage = await allThreadMessages.data[0].content[0].text
    .value

  return latestThreadMessage
}

// event handling
let assistant_id = ""
let thread_id = ""

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
