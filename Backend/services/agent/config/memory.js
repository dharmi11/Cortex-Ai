import redis from "../../../shared/redis/redis.js"
import { getMessages } from "../utils/getmessages.js"

export const getMemory = async (conversationId)=>{

    const key = `message-${conversationId}`
    const  cached = await redis.get(key)
    if(cached){
        return JSON.parse(cached) 
    }

    const message = getMessages(conversationId)
    await redis.set(key,JSON.stringify(message), "EX",24*60*60)

    return message
}


export const addMessage = async(conversationId , role , content)=>{
    const key = `message-${conversationId}`
    const  rawMessages = await redis.get(key)

    const messages = rawMessages?JSON.parse(rawMessages):[]

    messages.push({
        role ,
        content
    })
    if(messages.length>20){
        message.shift()
    }
    await redis.set(key , JSON.stringify(messages))

}