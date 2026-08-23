import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './user.slice'
import userReducer from "./user.slice";
import conversationReducer from "./conversation.slice";
import messageReducer from "./message.slice"

const store = configureStore({
  reducer: {
    user: userReducer,
    conversation :conversationReducer,
    message :messageReducer
    
  },
});

export default store;