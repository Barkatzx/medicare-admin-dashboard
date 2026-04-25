// src/store/slices/productSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, Product } from "@/config/api";
import toast from "react-hot-toast";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const response = await api.getAllProducts();
  return response;
});

export const createProduct = createAsyncThunk(
  "products/create",
  async (productData: Partial<Product>) => {
    const response = await api.createProduct(productData);
    return response;
  },
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }: { id: string; data: Partial<Product> }) => {
    const response = await api.updateProduct(id, data);
    return response;
  },
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string) => {
    await api.deleteProduct(id);
    return id;
  },
);
export const updateProductStock = createAsyncThunk(
  "products/updateStock",
  async ({
    id,
    operation,
    stock,
  }: {
    id: string;
    operation?: "increment" | "decrement";
    stock: number;
  }) => {
    let response;
    if (operation === "increment") {
      response = await api.incrementProductStock(id, stock);
    } else if (operation === "decrement") {
      response = await api.decrementProductStock(id, stock);
    } else {
      response = await api.updateProductStock(id, stock);
    }
    return response;
  },
);
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        toast.success("Product created successfully");
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        toast.success("Product updated successfully");
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        toast.success("Product deleted successfully");
      });
  },
});

export default productSlice.reducer;
