// src/app/dashboard/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/store/slices/categorySlice";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  Plus,
  FolderTree,
  Edit,
  Trash2,
  Search,
  Package,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Folder,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategory, setDeletingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDesc("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: any) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDesc(category.description || "");
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (category: any) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({
            id: editingCategory.id,
            name: categoryName,
            description: categoryDesc,
          }),
        ).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(
          createCategory({
            name: categoryName,
            description: categoryDesc,
          }),
        ).unwrap();
        toast.success("Category created successfully");
      }
      setIsModalOpen(false);
      setCategoryName("");
      setCategoryDesc("");
      setEditingCategory(null);
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save category",
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      await dispatch(deleteCategory(deletingCategory.id)).unwrap();
      toast.success("Category deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category",
      );
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {categories.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Folder size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-lg font-bold text-purple-600 mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <RefreshCw size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <Button onClick={handleOpenCreateModal} className="gap-2">
                <Plus size={16} />
                Add Category
              </Button>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <RefreshCw size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Refresh Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => dispatch(fetchCategories())}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Folder size={20} className="text-blue-600" />
            Category List ({filteredCategories.length})
          </h2>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">
              {searchTerm
                ? "No categories match your search"
                : "No categories found"}
            </p>
            {!searchTerm && (
              <Button
                onClick={handleOpenCreateModal}
                variant="secondary"
                className="mt-4"
              >
                Create your first category
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                      #
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                      Category Name
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                      Description
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                      ID
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((category, index) => (
                    <tr
                      key={category.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-6 text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                            <FolderTree size={14} className="text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        {category.description ? (
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {category.description}
                          </p>
                        ) : (
                          <span className="text-sm text-gray-400 italic">
                            No description
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {category.id.slice(-8)}
                        </code>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(category)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit category"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(category)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete category"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredCategories.length,
                    )}{" "}
                    of {filteredCategories.length} entries
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add New Category"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Electronics, Clothing, Books"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={categoryDesc}
              onChange={(e) => setCategoryDesc(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the category"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              {editingCategory ? "Update Category" : "Create Category"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete the category{" "}
                <strong className="text-gray-900">
                  "{deletingCategory?.name}"
                </strong>
                ?
              </p>
              <p className="text-xs text-red-600 mt-1">
                This action cannot be undone. Products in this category will be
                affected.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="danger" onClick={handleDelete} className="flex-1">
              Delete Category
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
