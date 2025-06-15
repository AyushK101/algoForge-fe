'use client'
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
  user: object | null,
  accessToken: string | null
}

const initialState: initialStateType = {
  user: null,
  accessToken: null 
}

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{user: any, accessToken: string}>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    unsetUser: (state) => {
      state.user = null;
      state.accessToken = null;
    }
  }
})

export const {setUser, unsetUser } = userSlice.actions

export default userSlice.reducer