// src/app/dashboard/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProducts,
  deleteProduct,
  updateProductStock,
} from "@/store/slices/productSlice";
import { fetchCategories } from "@/store/slices/categorySlice";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import ProductForm from "./ProductForm";
import StockManagementModal from "./StockManagementModal";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showLowStock, setShowLowStock] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteProduct(productToDelete)).unwrap();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete product");
      console.error("Delete error:", error);
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

  // Filter products based on search, category, and low stock
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || product.categoryId === filterCategory;

    const matchesLowStock = !showLowStock || product.stock <= 20;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const lowStockCount = products.filter((p) => p.stock <= 20).length;

  // Calculate total value correctly: sum of (price * stock) for all products
  const totalValue = products.reduce((sum, p) => {
    // Use discounted price if available, otherwise use regular price
    const productPrice = p.discountedPrice || p.price;
    return sum + productPrice * p.stock;
  }, 0);

  // Stats
  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "blue",
    },
    {
      label: "Low Stock Items",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "red",
    },
    {
      label: "Total Value",
      value: `৳${totalValue.toLocaleString()}`,
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: Filter,
      color: "purple",
    },
  ];

  // Get product image URL
  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0 && product.images[0].url) {
      return product.images[0].url;
    }
    return null;
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your product inventory and stock levels
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "bg-blue-100 text-blue-600",
            red: "bg-red-100 text-red-600",
            green: "bg-green-100 text-green-600",
            purple: "bg-purple-100 text-purple-600",
          };
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            showLowStock
              ? "bg-red-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          <AlertTriangle size={16} />
          Low Stock Only
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package size={20} className="text-blue-600" />
              Product Inventory ({filteredProducts.length})
            </h2>
            <button
              onClick={() => dispatch(fetchProducts())}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Product
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Discounted
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Stock
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        {/* Product Image - Rounded Full */}
                        {getProductImage(product) ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                            <Package size={16} className="text-blue-600" />
                          </div>
                        )}
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
                      <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                        {product.category?.name || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className="font-medium text-gray-900">
                        ৳{product.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      {product.discountedPrice ? (
                        <div>
                          <span className="text-green-600 font-medium">
                            ৳{product.discountedPrice.toLocaleString()}
                          </span>
                          {product.discountPercent > 0 && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({product.discountPercent}% off)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${
                            product.stock > 20
                              ? "bg-green-100 text-green-700"
                              : product.stock > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock} units
                        </span>
                        {product.stock <= 20 && product.stock > 0 && (
                          <span className="text-xs text-yellow-600">
                            Low Stock!
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="text-xs text-red-600">
                            Out of Stock!
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStockManagement(product)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Manage Stock"
                        >
                          <TrendingUp size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(product.id)}
                          disabled={
                            isDeleting && productToDelete === product.id
                          }
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            dispatch(fetchProducts());
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <StockManagementModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          dispatch(fetchProducts());
        }}
      />

      <Modal
        isOpen={!!productToDelete}
        onClose={() => !isDeleting && setProductToDelete(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setProductToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              loading={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
