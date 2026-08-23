import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
        conversation: [],
        selectiveConversation: null
    },
    reducers: {
        setConversations: (state, action) => {
            state.conversation = action.payload
        },
        addConversation: (state, action) => {
            state.conversation.unshift(action.payload);
        },
        setSelectiveConversation: (state, action) => {
            state.selectiveConversation = action.payload
        },
        setConvTitle: (state, action) => {
            const { title, conversationId } = action.payload
            state.conversation = state.conversation.map((conv) =>
                conv._id === conversationId
                    ? { ...conv, title }
                    : conv
            );
            if (state.selectiveConversation?._id === conversationId) {
                state.selectiveConversation = { ...state.selectiveConversation, title }
            }

        }
    }

})

export const {
    setConversations,
    addConversation,
    setSelectiveConversation,
    setConvTitle
} = conversationSlice.actions;

export default conversationSlice.reducer;