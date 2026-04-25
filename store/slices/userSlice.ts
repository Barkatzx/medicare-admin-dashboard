import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, User } from "@/config/api";
import toast from "react-hot-toast";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await api.getUsers();
  return response;
});

export const approveUser = createAsyncThunk(
  "users/approve",
  async (userId: string) => {
    const response = await api.approveUser(userId);
    return response;
  },
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
        toast.error("Failed to fetch users");
      })
      .addCase(approveUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        toast.success("User approved successfully");
      })
      .addCase(approveUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to approve user";
        toast.error("Failed to approve user");
      });
  },
});

export default userSlice.reducer;
