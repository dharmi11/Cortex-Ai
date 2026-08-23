import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js";

export const agent = async (req, res) => {
    console.log("✅ Agent controller hit");
    // console.log("Body:", req.body);
    try {
        const { prompt, conversationId ,agent} = req.body
          const userId = req.headers["x-user-id"];

        await addMessage(conversationId , "user" , prompt)

        
        await axios.post(`${process.env.CHAT_SERVICES}/save-message`, {
            conversationId, role: "user", content: prompt
        })
       
        const result = await graph.invoke({
            prompt,
            conversationId,
            agent,
            userId
        });
        // const response = result.aiResponse

        await addMessage(conversationId,"user" , prompt)
        await addMessage(conversationId , "assistant" , result.aiResponse)
         await axios.post(`${process.env.CHAT_SERVICES}/save-message`, {
            conversationId, role: "assistant", content:result?.aiResponse , images:result?.images , artifacts:result?.artifacts
        })

        return res.status(200).json({
            answer : result?.aiResponse,
            Image :result?.images,
            artifacts: result?.artifacts
        })

    } catch (error) {
        console.error(error);
        console.error(error.response?.data);
        console.error(error.stack);

        // return res.status(500).json({ message: `error in agent ai reply ${error}` })
        return res.status(500).json({
            message: error.message
        });
    }
}