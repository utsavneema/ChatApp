import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const existingMessageIndex = state.chats.findIndex(
        (message) =>
          message.text === action.payload.text &&
          message.sender === action.payload.sender
      );

      if (existingMessageIndex === -1) {
        state.chats.push(action.payload);
      }

    },

    clearChat: (state) => {
      state.chats = [];
    },

    createChatRoom: (state, action) => {
      const existingChatRoom = state.chats.find(
        (chat) =>
          (chat.user1 === action.payload.user1 && chat.user2 === action.payload.user2) ||
          (chat.user1 === action.payload.user2 && chat.user2 === action.payload.user1)
      );

      if (!existingChatRoom) {
        state.chats.push({
          user1: action.payload.user1,
          user2: action.payload.user2,
          messages: [],
        });
      }
    },
  },
});

export const { addMessage, createChatRoom, clearChat } = chatSlice.actions;

export default chatSlice.reducer;
