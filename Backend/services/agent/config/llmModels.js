import dotenv from "dotenv";

dotenv.config();

import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatOpenRouter } from "@langchain/openrouter";

const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,

})

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash",
});

// const claud = new ChatAnthropic({});

const deepseek = new ChatDeepSeek({
    model: "deepseek-reasoner",
    temperature: 0,

});

const openrouter = new ChatOpenRouter({
    model: "deepseek/deepseek-chat",
    temperature:0,
    maxTokens:2500
})


const getModels = async (agent) => {
    switch (agent) {
        case "chat":
            return groq;
        case "search":
            return groq;
        case "coding":
            return gemini ;
        case "pdf":
            return gemini;
        case "vision":
            return gemini;
        default:
            return groq;
    }
};

export default getModels;