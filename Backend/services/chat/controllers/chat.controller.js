import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"]


        const conversation = await Conversation.create({
            userId: userId
        })
        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json({ message: `create conversation error ${error}` })
    }
}


export const getConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"]
        // console.log("userId" , userId)            
        const conversations = await Conversation.find({
            userId: userId
        }).sort({ updatedAt: -1 })

        return res.status(200).json(conversations)
    } catch (error) {
        return res.status(500).json({ message: `get conversation error ${error}` })
    }
}

export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content, images , artifacts  } = req.body;

        const saveMessage = await Message.create({
            conversationId,
            role,
            content,
            images,
            artifacts
        })

        return res.status(200).json({
            saveMessage
        })

    } catch (error) {
        return res.status(500).json({ message: `saveMessage error ${error}` })
    }
}

export const getMessage = async (req, res) => {
    try {
        // const { conversationId } = req.params;

        const messages = await Message.find({
            conversationId: req.params.conversationId
        })

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({
            message: `Get Message error ${error.message}`,
        });
    }
};
export const updateConversation = async (req, res) => {
    try {
        const { id, title } = req.body;

        const conversations = await Conversation.findByIdAndUpdate(
            id,
            {
                title
            },
            {
                new: true
            }
        )
        return res.status(200).json(conversations)
    } catch (error) {
        return res.status(500).json({ message: `get conversation error ${error}` })
    }
}
