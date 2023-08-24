import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../helpers';

const initialState = {
  chats: [],
};

export const fetchChats = createAsyncThunk("user/fetchchats", async (receiverId) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    try {
      const response = await axios.get(baseUrl + "api/chat-details", {
        headers: {
          Authorization: token,
        },
        params: {
          receiverId: receiverId,
        },
      });
      return response.data.chatDetails;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
});

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
  extraReducers: (builder) => {
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.chats = action.payload;
    });
  },
});

export const { addMessage, createChatRoom } = chatSlice.actions;

export default chatSlice.reducer;
