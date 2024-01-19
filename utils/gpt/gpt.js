import "dotenv/config"
import OpenAI from "openai"

const gpt = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default gpt