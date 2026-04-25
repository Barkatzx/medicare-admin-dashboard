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

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description?: string;
  }) => {
    const response = await api.updateCategory(id, name, description);
    return response;
  },
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string) => {
    await api.deleteCategory(id);
    return id;
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
        toast.error("Failed to fetch categories");
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        toast.success("Category created successfully");
      })
      .addCase(createCategory.rejected, (state, action) => {
        toast.error(action.error.message || "Failed to create category");
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        toast.success("Category updated successfully");
      })
      .addCase(updateCategory.rejected, (state, action) => {
        toast.error(action.error.message || "Failed to update category");
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload,
        );
        toast.success("Category deleted successfully");
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        toast.error(action.error.message || "Failed to delete category");
      });
  },
});

export default categorySlice.reducer;
