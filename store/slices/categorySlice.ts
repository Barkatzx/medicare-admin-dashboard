// src/store/slices/categorySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, Category } from "@/config/api";
import toast from "react-hot-toast";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => {
    const response = await api.getAllCategories();
    return response;
  },
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async ({ name, description }: { name: string; description?: string }) => {
    const response = await api.createCategory(name, description);
    return response;
  },
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        toast.success("Category created successfully");
      });
  },
});

export default categorySlice.reducer;
