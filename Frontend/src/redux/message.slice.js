import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    artifacts: null,
    isLoading:false 
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setArtifact: (state, action) => {
      state.artifacts = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setMessages, addMessage, setArtifact , setIsLoading} = messageSlice.actions;

export default messageSlice.reducer;