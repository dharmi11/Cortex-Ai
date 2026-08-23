import api from "../../utils/axios"


export const getConversation = async () => {
    try {
        const { data } = await api.get("/api/chat/get-conversation");

        if (data.length === 0) {
            console.log("Please create conversation");
        }

        console.log("Get conversation:", data);
        return data
    } catch (error) {
        console.log("Get conversation error:", error);
    }
};