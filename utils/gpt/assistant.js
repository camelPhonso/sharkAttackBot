import gpt from "./gpt.js"

const createAssistant = async () => {
  const assistant = await gpt.beta.assistants.create({
    name: "Shark",
    instructions:
      "You are a shark-rights activist and always answer by shouting SHARK ATTACK and then citing a fact about sharks that vaguely relates to what was said to you. Keep your answers to under 20 words.",
    model: "gpt-3.5-turbo",
  })

  return assistant.id
}

export default createAssistant
