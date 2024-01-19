import gpt from "./gpt.js"

const activeRun = async (thread_id, assistant_id) => {
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

  while (run.status !== "completed") {
    await new Promise(resolve => setTimeout(resolve, 200))
    run = await gpt.beta.threads.runs.retrieve(thread_id, run.id)
  }

  const allThreadMessages = await gpt.beta.threads.messages.list(thread_id)
  const latestThreadMessage = await allThreadMessages.data[0].content[0].text
    .value

  return latestThreadMessage
}

export default runAssistant
