// src/store/slices/productSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, Product, TopProduct } from "@/config/api";
import toast from "react-hot-toast";

interface ProductState {
  products: Product[];
  topProducts: TopProduct[];
  loading: boolean;
  topProductsLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  topProducts: [],
  loading: false,
  topProductsLoading: false,
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

export const uploadProductImages = createAsyncThunk(
  "products/uploadImages",
  async ({ productId, images }: { productId: string; images: File[] }) => {
    const response = await api.addProductImages(productId, images);
    return { productId, images: response };
  },
);

export const fetchTopProducts = createAsyncThunk(
  "products/fetchTop",
  async (limit: number = 10) => {
    const response = await api.getTopProducts(limit);
    return response;
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
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
        toast.error("Failed to fetch products");
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        toast.success("Product created successfully");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message || "Failed to create product");
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        toast.success("Product updated successfully");
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message || "Failed to update product");
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
        toast.success("Product deleted successfully");
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message || "Failed to delete product");
      })
      // Update Product Stock
      .addCase(updateProductStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        toast.success("Stock updated successfully");
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message || "Failed to update stock");
      })
      // Upload Product Images
      .addCase(uploadProductImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.productId,
        );
        if (index !== -1) {
          if (!state.products[index].images) {
            state.products[index].images = [];
          }
          const newImages = action.payload.images;
          state.products[index].images = [
            ...(state.products[index].images || []),
            ...newImages,
          ];
        }
        toast.success("Images uploaded successfully");
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message || "Failed to upload images");
      })
      // Fetch Top Products
      .addCase(fetchTopProducts.pending, (state) => {
        state.topProductsLoading = true;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topProductsLoading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.topProductsLoading = false;
        state.error = action.error.message || "Failed to fetch top products";
        toast.error("Failed to load top products");
      });
  },
});

export default productSlice.reducer;
