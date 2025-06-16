'use client'
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
  user: {
    id: string
    username: string
    email: string
    pictureId: string
    role: string
    createdAt: string
    updatedAt: string
  } | null,
}

const initialState: initialStateType = {
  user: null,
}

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{user: any}>) => {
      state.user = action.payload.user;
    },
    unsetUser: (state) => {
      state.user = null;
    }
  }
})

export const {setUser, unsetUser } = userSlice.actions

export default userSlice.reducer