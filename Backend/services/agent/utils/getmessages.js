import axios from "axios"

export const getMessages = async (conversationId) => {
    try {

        const data = await axios.post(`${process.env.CHAT_SERVICES}/get-message/${conversationId }`, {
            conversationId, role: "user", content: prompt
        })
        return data ;

    } catch (error) {
        console.log(`Error in get message memmory ${error}`);
        return null 
    }
}