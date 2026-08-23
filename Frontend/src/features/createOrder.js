import api from "../../utils/axios";

export const createOrder = async (payload) => {
    try {
        const { data } = await api.post(
            "/api/billing/create",
            payload
        );

        console.log("create order:", data);

        return data;
    } catch (error) {
        console.log(
            "Create order error:",
            error.response?.data || error.message
        );

        throw error;
    }
};