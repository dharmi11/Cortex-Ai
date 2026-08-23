import api from "../../utils/axios"

export const updateConversation = async (payload) => {
  try {
    console.log("Sending Payload:", payload);

    const { data } = await api.post(
      "/api/chat/update-conversation",
      payload
    );

    console.log("Response:", data);

    return data;
  } catch (error) {
    console.log(error.response?.data || error);
  }
};