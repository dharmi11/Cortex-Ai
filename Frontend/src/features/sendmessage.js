import api from "../../utils/axios"

export const sendMessage = async (payload) => {
    try {
        const { data } = await api.post("/api/agent/chat", payload);

        console.log("Send Message", data);
        return data;

    } catch (error) {
    console.error(error);
    console.error(error.response?.data);
    console.error(error.stack);
}
}