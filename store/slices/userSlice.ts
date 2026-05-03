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

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId: string, { rejectWithValue }) => {
    try {
      await api.deleteUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete user");
    }
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
        state.error = null;
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
        state.error = null;
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
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
        // ✅ Toast shown here in slice — NOT in the page handler
        toast.success("User deleted successfully");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete user";
        toast.error((action.payload as string) || "Failed to delete user");
      });
  },
});

export default userSlice.reducer;
