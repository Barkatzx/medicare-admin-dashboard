// src/app/dashboard/help/page.tsx
"use client";

import { useState } from "react";
import {
  FileCode,
  BookOpen,
  ExternalLink,
  CheckCircle,
  Shield,
  Zap,
  Server,
  Key,
  Copy,
  Check,
  ArrowRight,
  Code2,
  Database,
  Lock,
  Users,
  ShoppingBag,
  BarChart3,
  FolderTree,
  Package,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function HelpPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(
      "https://medicare-server-production.up.railway.app/api",
    );
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/users/all",
      description: "Get all users (admin only)",
    },
    {
      method: "PUT",
      endpoint: "/users/approve/:userId",
      description: "Approve a user",
    },
    { method: "GET", endpoint: "/products", description: "Get all products" },
    {
      method: "POST",
      endpoint: "/products",
      description: "Create a new product",
    },
    {
      method: "PUT",
      endpoint: "/products/:id",
      description: "Update a product",
    },
    {
      method: "DELETE",
      endpoint: "/products/:id",
      description: "Delete a product",
    },
    {
      method: "GET",
      endpoint: "/orders",
      description: "Get all orders (admin only)",
    },
    {
      method: "PUT",
      endpoint: "/orders/:id/status",
      description: "Update order status",
    },
    {
      method: "GET",
      endpoint: "/sales/dashboard",
      description: "Get sales dashboard data",
    },
    {
      method: "GET",
      endpoint: "/sales/summary",
      description: "Get sales summary",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section - Modern Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white">
        {/* Animated Background Elements */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-2.5">
              <Sparkles size={24} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Developer Hub
            </h1>
          </div>
          <p className="max-w-2xl text-gray-300 text-lg">
            Complete API reference and integration guide for the Medicare Admin
            Dashboard. Built for developers who need flexibility and control.
          </p>

          <div className="mt-6 flex gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              API Status: Operational
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield size={14} />
              JWT Auth Required
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Code2 size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">24+</p>
              <p className="text-xs text-gray-600">API Endpoints</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Database size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700">7</p>
              <p className="text-xs text-gray-600">Data Resources</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Lock size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-700">RBAC</p>
              <p className="text-xs text-gray-600">Role-Based Access</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Zap size={18} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-700">99.9%</p>
              <p className="text-xs text-gray-600">Uptime SLA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* API Documentation Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              API Documentation
            </h2>
          </div>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Base URL</h3>
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl">
                  <code className="text-sm font-mono text-gray-300">
                    https://medicare-server-production.up.railway.app/api
                  </code>
                  <button
                    onClick={handleCopyEndpoint}
                    className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {copiedEndpoint ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Authentication
                </h3>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-sm text-amber-800 mb-2">
                    All API requests require a valid JWT token in the
                    Authorization header:
                  </p>
                  <code className="block bg-gray-900 text-gray-300 p-3 rounded-lg text-xs font-mono">
                    Authorization: Bearer &lt;your_jwt_token&gt;
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Common Endpoints
                </h3>
                <div className="space-y-2">
                  {apiEndpoints.slice(0, 5).map((endpoint, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                    >
                      <span
                        className={`text-xs font-mono px-2 py-1 rounded ${
                          endpoint.method === "GET"
                            ? "bg-green-100 text-green-700"
                            : endpoint.method === "POST"
                              ? "bg-blue-100 text-blue-700"
                              : endpoint.method === "PUT"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="text-xs font-mono text-gray-700 flex-1">
                        {endpoint.endpoint}
                      </code>
                      <p className="text-xs text-gray-500 hidden md:block">
                        {endpoint.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full gap-2">
                View Full API Documentation
                <ExternalLink size={14} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Integration Guidelines Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileCode size={20} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Integration Guidelines
            </h2>
          </div>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Server size={16} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Environment Setup
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configure your environment variables for local development
                    and production deployment.
                  </p>
                  <code className="block mt-2 bg-gray-900 text-gray-300 p-3 rounded-lg text-xs font-mono">
                    NEXT_PUBLIC_API_URL=https://medicare-server-production.up.railway.app/api
                  </code>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Shield size={16} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Security Best Practices
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      • Always use HTTPS in production
                    </li>
                    <li className="flex items-center gap-2">
                      • Rotate JWT secrets regularly
                    </li>
                    <li className="flex items-center gap-2">
                      • Implement rate limiting for API routes
                    </li>
                    <li className="flex items-center gap-2">
                      • Validate and sanitize all inputs
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap size={16} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Webhooks & Events
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configure webhooks to receive real-time updates for order
                    status changes, user registrations, and more.
                  </p>
                  <Button variant="secondary" size="sm" className="mt-2 gap-2">
                    Configure Webhooks
                    <ArrowRight size={12} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Full Endpoints Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="font-semibold text-gray-900">
            Complete API Reference
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            All available endpoints organized by resource
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                  Method
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                  Endpoint
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                  Description
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                  Auth
                </th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map((endpoint, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-6">
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded ${
                        endpoint.method === "GET"
                          ? "bg-green-100 text-green-700"
                          : endpoint.method === "POST"
                            ? "bg-blue-100 text-blue-700"
                            : endpoint.method === "PUT"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <code className="text-xs font-mono text-gray-700">
                      {endpoint.endpoint}
                    </code>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-600">
                    {endpoint.description}
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                      <Key size={10} />
                      JWT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tech Stack & Footer */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Database size={16} className="text-blue-600" />
            Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js 14",
              "TypeScript",
              "Tailwind CSS",
              "Redux Toolkit",
              "Node.js",
              "PostgreSQL",
              "Prisma",
              "Railway",
            ].map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-white rounded-lg text-xs text-gray-600 border border-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <HeartHandshake size={16} className="text-rose-500" />
            Support & Resources
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Need help with integration? Check our detailed API documentation or
            contact our developer support team.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" className="gap-2">
              <FileCode size={14} />
              API Reference
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <ExternalLink size={14} />
              Postman Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Qodeax Footer */}
      <div className="border-t border-gray-100 pt-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">Q</span>
          </div>
          <p className="text-sm text-gray-500">
            Built with excellence by{" "}
            <a
              href="https://www.qodeax.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-700 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
            >
              Qodeax – Software Agency
              <ExternalLink size={12} />
            </a>
          </p>
        </div>
        <p className="text-xs text-gray-400 max-w-xl mx-auto">
          Qodeax specializes in building high-performance web applications,
          scalable backend systems, and developer-first tools. This admin panel
          is engineered for clarity, performance, and complete API
          controllability.
        </p>
      </div>
    </div>
  );
}
