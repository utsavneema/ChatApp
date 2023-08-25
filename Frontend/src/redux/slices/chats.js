import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
  lastMessages: {}, 
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { sender,recipient, text,imageUrl, videoUrl, audioUrl } = action.payload;
      
      const existingMessageIndex = state.chats.findIndex(
        (message) =>
          message.text === action.payload.text &&
          message.sender === action.payload.sender
      );

      if (existingMessageIndex === -1) {
        state.chats.push(action.payload);
      }

      // state.lastMessages[sender] = text;
      // state.lastMessages[recipient] = text;
      const lastMessageContent = imageUrl ? "image" : videoUrl ? "video" : audioUrl ? "audio" : text;
  
  // state.lastMessages[sender] = lastMessageContent;
  // state.lastMessages[recipient] = lastMessageContent;

  state.lastMessages[sender] = {
    content: lastMessageContent,
    timestamp: action.payload.created_at,
  };
  state.lastMessages[recipient] = {
    content: lastMessageContent,
    timestamp: action.payload.created_at,
  };
  
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
