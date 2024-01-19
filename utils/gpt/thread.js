import gpt from "./gpt.js"

const createThread = async () => {
  const thread = await gpt.beta.threads.create()

  return thread.id
}

export default createThread
