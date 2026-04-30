// src/app/dashboard/products/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, deleteProduct } from "@/store/slices/productSlice";
import { fetchCategories } from "@/store/slices/categorySlice";
import Button from "@/components/ui/Button";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Search,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  X,
  Pencil,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import ProductForm from "./ProductForm";
import StockManagementModal from "./StockManagementModal";
import { Product } from "@/config/api";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, loading, pagination } = useAppSelector(
    (state) => state.products,
  );
  const { categories } = useAppSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showLowStock, setShowLowStock] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Load products with pagination and filters
  const loadProducts = useCallback(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        categoryId: filterCategory !== "all" ? filterCategory : undefined,
      }),
    );
  }, [dispatch, currentPage, searchTerm, filterCategory]);

  // Load categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Load products when dependencies change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory]);

  const handleRefresh = () => {
    loadProducts();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteProduct(productToDelete)).unwrap();
      toast.success("Product deleted successfully");
      loadProducts();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleStockManagement = (product: any) => {
    setSelectedProduct(product);
    setIsStockModalOpen(true);
  };

  // Calculate stats
  const lowStockCount = products.filter((p: any) => p.stock <= 20).length;
  const totalValue = products.reduce((sum: number, p: any) => {
    const productPrice = p.discountedPrice || p.price;
    return sum + productPrice * p.stock;
  }, 0);
  const outOfStockCount = products.filter((p: any) => p.stock === 0).length;

  const stats = [
    {
      label: "Total Products",
      value: pagination?.total || products.length,
      icon: Package,
      color: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
    },
    {
      label: "Low Stock",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
    },
    {
      label: "Out of Stock",
      value: outOfStockCount,
      icon: AlertTriangle,
      color: "from-red-500 to-rose-600",
      bgGradient: "from-red-50 to-rose-50",
    },
    {
      label: "Inventory Value",
      value: `৳${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
    },
  ];

  const getProductImage = (product: Product): string | null => {
    if (product.primaryImageId && product.images && product.images.length > 0) {
      const primaryImage = product.images.find(
        (img) => img.id === product.primaryImageId,
      );
      if (primaryImage?.url) return primaryImage.url;
    }
    if (product.images && product.images.length > 0 && product.images[0]?.url) {
      return product.images[0].url;
    }
    return null;
  };

  const getPageNumbers = () => {
    if (!pagination?.pages) return [];

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(pagination.pages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (loading && products.length === 0 && currentPage === 1) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur">
                <Package size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold">Product Management</h1>
            </div>
            <p className="text-gray-300 max-w-xl">
              Manage your product inventory, track stock levels, and monitor
              product performance across all categories.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={22} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowLowStock(!showLowStock)}
          className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm ${
            showLowStock
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-200"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          <AlertTriangle size={16} />
          {showLowStock ? "Show All" : "Low Stock Only"}
        </button>
      </div>

      {/* Search Info */}
      {searchTerm && (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-xl">
          <Search size={14} className="text-blue-600" />
          <span>
            Search results for:{" "}
            <strong className="text-gray-700">"{searchTerm}"</strong>
          </span>
          <button
            onClick={handleClearSearch}
            className="ml-auto text-blue-600 hover:text-blue-700 text-xs font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Package size={16} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Product Inventory
              </h2>
              <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full ml-2">
                {pagination?.total || products.length} products
              </span>
            </div>
            <button
              onClick={handleRefresh}
              className={`p-2 hover:bg-gray-100 rounded-xl transition-colors ${loading ? "animate-spin" : ""}`}
            >
              <RefreshCw size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500 font-medium">
                  Loading products...
                </p>
              </div>
            </div>
          )}

          {products.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No products found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Discounted
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors group"
                    >
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                            {(() => {
                              const imageUrl = getProductImage(product);
                              return imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                              ) : (
                                <Package size={16} className="text-blue-600" />
                              );
                            })()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            {product.description && (
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                {product.description.substring(0, 60)}...
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                          {product.category?.name || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className="font-semibold text-gray-900">
                          ৳{product.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        {product.discountedPrice ? (
                          <div>
                            <span className="text-emerald-600 font-semibold">
                              ৳{product.discountedPrice.toLocaleString()}
                            </span>
                            {product.discountPercent > 0 && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({product.discountPercent}% off)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                              product.stock > 20
                                ? "bg-emerald-100 text-emerald-700"
                                : product.stock > 0
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.stock} units
                          </span>
                          {product.stock <= 20 && product.stock > 0 && (
                            <span className="text-xs text-amber-600 font-medium">
                              Low Stock!
                            </span>
                          )}
                          {product.stock === 0 && (
                            <span className="text-xs text-red-600 font-medium">
                              Out of Stock!
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStockManagement(product)}
                            className="p-2 text-emerald-600 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-all duration-200"
                            title="Manage Stock"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all duration-200"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => confirmDelete(product.id)}
                            disabled={
                              isDeleting && productToDelete === product.id
                            }
                            className="p-2 text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-all duration-200 disabled:opacity-50"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} products
              </p>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                  className="p-2 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={loading}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={currentPage === pagination.pages || loading}
                  className="p-2 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSuccess={() => {
            setIsModalOpen(false);
            loadProducts();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <StockManagementModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          loadProducts();
        }}
      />

      <Modal
        isOpen={!!productToDelete}
        onClose={() => !isDeleting && setProductToDelete(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this product?
              </p>
              <p className="text-xs text-red-600 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setProductToDelete(null)}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              loading={isDeleting}
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
