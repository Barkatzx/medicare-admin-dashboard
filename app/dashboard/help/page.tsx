// src/app/dashboard/help/page.tsx
"use client";

import { useState } from "react";
import {
  HelpCircle,
  Rocket,
  Shield,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Bell,
  FileText,
  Video,
  BookOpen,
  MessageCircle,
  Mail,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Zap,
  TrendingUp,
  Database,
  Key,
  Globe,
  Smartphone,
  Monitor,
  Cloud,
  Lock,
  Award,
  Star,
  Sparkles,
  Search,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { id: "all", name: "All Topics", icon: HelpCircle },
    { id: "getting-started", name: "Getting Started", icon: Rocket },
    { id: "user-management", name: "User Management", icon: Users },
    { id: "product-management", name: "Product Management", icon: Package },
    { id: "order-management", name: "Order Management", icon: ShoppingCart },
    { id: "reports-analytics", name: "Reports & Analytics", icon: BarChart3 },
    { id: "settings-security", name: "Settings & Security", icon: Settings },
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I approve new user registrations?",
      answer:
        "Navigate to Users → Pending Approvals section. Review user details and click 'Approve' to activate their account.",
      category: "user-management",
      steps: [
        "Go to Users page",
        "Find 'Pending Approvals' section",
        "Click 'Approve' button",
      ],
    },
    {
      id: 2,
      question: "How do I add products with images?",
      answer:
        "Click 'Add Product' button on Products page. Fill in product details, then upload multiple images. The first image becomes default.",
      category: "product-management",
      steps: [
        "Go to Products page",
        "Click 'Add Product'",
        "Fill product details",
        "Upload images",
        "Set default image with star icon",
      ],
    },
    {
      id: 3,
      question: "How do I manage low stock products?",
      answer:
        "Use 'Low Stock Only' filter on Products page to view items with stock below 20 units.",
      category: "product-management",
      steps: [
        "Go to Products page",
        "Click 'Low Stock Only' button",
        "Update stock via stock management modal",
      ],
    },
    {
      id: 4,
      question: "How do I update order status?",
      answer:
        "Go to Orders page, find the order, and use the status dropdown to update.",
      category: "order-management",
      steps: [
        "Navigate to Orders page",
        "Find the order",
        "Select new status from dropdown",
      ],
    },
    {
      id: 5,
      question: "How do I view sales reports and analytics?",
      answer:
        "Go to Reports page to view comprehensive sales insights and export data.",
      category: "reports-analytics",
      steps: [
        "Go to Reports page",
        "Select period (Daily/Weekly/Monthly/Yearly)",
        "View charts and insights",
        "Export as CSV or PDF",
      ],
    },
    {
      id: 6,
      question: "How do I send notifications to users?",
      answer:
        "Go to Notifications page. Send to individual users or bulk send to multiple users.",
      category: "user-management",
      steps: [
        "Go to Notifications page",
        "Click 'Send to User' or 'Bulk Send'",
        "Select recipients",
        "Write message and send",
      ],
    },
    {
      id: 7,
      question: "How do I manage product categories?",
      answer: "Go to Categories page to create, edit, or delete categories.",
      category: "product-management",
      steps: [
        "Go to Categories page",
        "Click 'Add Category'",
        "View product counts per category",
      ],
    },
    {
      id: 8,
      question: "How do I change my admin password?",
      answer: "Go to Settings → Security → Change Password.",
      category: "settings-security",
      steps: [
        "Go to Settings page",
        "Click 'Change Password'",
        "Enter current and new password",
        "Click 'Update Password'",
      ],
    },
  ];

  const tutorials = [
    {
      title: "Quick Start Guide",
      description: "Learn the basics of navigating the admin dashboard",
      icon: Rocket,
      duration: "5 min read",
      level: "Beginner",
    },
    {
      title: "User Management Tutorial",
      description: "Complete guide to managing users and approvals",
      icon: Users,
      duration: "10 min read",
      level: "Intermediate",
    },
    {
      title: "Product Management Guide",
      description: "Learn how to add, edit, and manage products",
      icon: Package,
      duration: "15 min read",
      level: "Intermediate",
    },
    {
      title: "Order Processing Workflow",
      description: "Step-by-step guide to processing customer orders",
      icon: ShoppingCart,
      duration: "8 min read",
      level: "Beginner",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur">
              <HelpCircle size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold">Help Center</h1>
          </div>
          <p className="text-blue-100 max-w-2xl">
            Welcome to the admin help center. Find guides, tutorials, and
            answers to common questions about managing your store effectively.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search for help articles, guides, or FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 ">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{faqs.length}</p>
              <p className="text-xs text-gray-500">Help Articles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 ">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Video size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tutorials.length}
              </p>
              <p className="text-xs text-gray-500">Tutorials</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 ">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">24/7</p>
              <p className="text-xs text-gray-500">Support Available</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 ">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Zap size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">50+</p>
              <p className="text-xs text-gray-500">API Endpoints</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tutorials */}
      <>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Video size={20} className="text-blue-600" />
          Quick Tutorials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tutorials.map((tutorial) => {
            const Icon = tutorial.icon;
            return (
              <Card
                key={tutorial.title}
                className="group transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <Icon size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {tutorial.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {tutorial.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">
                        {tutorial.duration}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-blue-600">
                        {tutorial.level}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Icon size={16} />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* FAQs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle size={20} className="text-blue-600" />
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500">
            {filteredFaqs.length} articles
          </p>
        </div>

        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-gray-100">
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">
                No FAQs found matching your search
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                  }
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronRight
                    size={18}
                    className={`text-gray-400 transition-transform duration-200 ${
                      expandedFaq === faq.id ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="pt-4">
                      <p className="text-sm text-gray-600 mb-3">{faq.answer}</p>
                      {faq.steps && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="font-semibold text-gray-700 mb-2">
                            Quick Steps:
                          </p>
                          <ol className="space-y-1">
                            {faq.steps.map((step, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-600 flex items-start gap-2"
                              >
                                <span className="text-blue-600 font-semibold">
                                  {idx + 1}.
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Admin Pro Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Award size={24} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              💡 Admin Pro Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle
                  size={14}
                  className="text-green-500 flex-shrink-0"
                />
                <span>
                  Use{" "}
                  <kbd className="px-1.5 py-0.5 bg-white rounded text-xs font-mono">
                    ⌘K
                  </kbd>{" "}
                  to quickly search and navigate
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle
                  size={14}
                  className="text-green-500 flex-shrink-0"
                />
                <span>Monitor low stock with "Low Stock Only" filter</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle
                  size={14}
                  className="text-green-500 flex-shrink-0"
                />
                <span>Export reports as CSV or PDF for offline analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle
                  size={14}
                  className="text-green-500 flex-shrink-0"
                />
                <span>Use bulk notifications for announcements</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Need More Help */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 rounded-xl bg-blue-100 mb-4">
            <MessageCircle size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Still Need Help?</h3>
          <p className="text-gray-500 mt-2 max-w-md">
            Can't find what you're looking for? Our support team is here to
            help.
          </p>
          <div className="flex gap-4 mt-6">
            <Link
              href="mailto:barkatullah.zx@gmail.com"
              className="text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/dashboard/documentation"
              className="text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
