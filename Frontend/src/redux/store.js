import { configureStore } from "@reduxjs/toolkit";
import chatReducer from './slices/chats';
import userReducer from './slices/user'

const store = configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer
    
  },
});

export default store;