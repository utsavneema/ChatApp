
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../helpers";

const initialState = {
  selectedUser: "",
  userList: [],
  roomUserList: [],
};


export const fetchUserList = createAsyncThunk("user/fetchUserList", async () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    try {
      const [userResponse, roomResponse] = await Promise.all([
        axios.get(baseUrl + "api/user-list", {
          headers: {
            Authorization: token,
          },
        }),
        axios.get(baseUrl + "api/room-details", {
          headers: {
            Authorization: token,
          },
        }),
      ]);

      return {
        userList: userResponse.data.userDetails,
        roomUserList: roomResponse.data.roomDetails,
      };
    } catch (error) {
      throw error;
    }
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserList.fulfilled, (state, action) => {
      state.userList = action.payload.userList;
      state.roomUserList = action.payload.roomUserList;
    });
  },
});

export const { setSelectedUser } = userSlice.actions;
export default userSlice.reducer; 