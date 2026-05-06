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
  Terminal,
  GitBranch,
  Cloud,
  Cpu,
  Globe,
  Award,
  MessageCircle,
  Mail,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function HelpPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(
      "https://medicare-server-production.up.railway.app/api",
    );
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/users/all",
      description: "Get all users (admin only)",
      auth: true,
    },
    {
      method: "PUT",
      endpoint: "/users/approve/:userId",
      description: "Approve a user",
      auth: true,
    },
    {
      method: "GET",
      endpoint: "/products",
      description: "Get all products",
      auth: false,
    },
    {
      method: "POST",
      endpoint: "/products",
      description: "Create a new product",
      auth: true,
    },
    {
      method: "PUT",
      endpoint: "/products/:id",
      description: "Update a product",
      auth: true,
    },
    {
      method: "DELETE",
      endpoint: "/products/:id",
      description: "Delete a product",
      auth: true,
    },
    {
      method: "GET",
      endpoint: "/orders",
      description: "Get all orders (admin only)",
      auth: true,
    },
    {
      method: "PUT",
      endpoint: "/orders/:id/status",
      description: "Update order status",
      auth: true,
    },
    {
      method: "GET",
      endpoint: "/sales/dashboard",
      description: "Get sales dashboard data",
      auth: true,
    },
    {
      method: "GET",
      endpoint: "/sales/summary",
      description: "Get sales summary",
      auth: true,
    },
    {
      method: "GET",
      endpoint: "/sales/top-products",
      description: "Get top selling products",
      auth: true,
    },
    {
      method: "GET",
      endpoint: "/sales/daily",
      description: "Get daily sales",
      auth: true,
    },
    {
      method: "GET",
      endpoint: "/sales/weekly",
      description: "Get weekly sales",
      auth: true,
    },
    {
      method: "GET",
      endpoint: "/sales/monthly",
      description: "Get monthly sales",
      auth: true,
    },
    {
      method: "GET",
      endpoint: "/sales/yearly",
      description: "Get yearly sales",
      auth: true,
    },
    {
      method: "GET",
      endpoint: "/sales/custom-range",
      description: "Custom date range sales",
      auth: true,
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "JWT Authentication",
      description: "Secure token-based authentication for all API requests",
    },
    {
      icon: Lock,
      title: "Role-Based Access",
      description: "Admin and customer roles with different permission levels",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "WebSocket connections for live notifications and updates",
    },
    {
      icon: Database,
      title: "RESTful API",
      description:
        "Clean, predictable REST endpoints with consistent responses",
    },
    {
      icon: GitBranch,
      title: "Version Control",
      description: "API versioning for backward compatibility",
    },
    {
      icon: Cloud,
      title: "Cloud Ready",
      description: "Deployed on Railway with 99.9% uptime guarantee",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section - Modern Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 text-white">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Terminal size={14} className="text-blue-400" />
            <span className="text-xs font-mono text-blue-300">API v1.0.0</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-xl">
              <Sparkles size={28} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent">
              Developer Hub
            </h1>
          </div>
          <p className="max-w-2xl text-gray-300 text-lg leading-relaxed">
            Complete API reference and integration guide for the{" "}
            <span className="text-white font-semibold">
              MediCare Admin Dashboard
            </span>
            . Built for developers who need flexibility, control, and seamless
            integration.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-300">
                API Status: Operational
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-sm">
              <Shield size={12} className="text-blue-400" />
              <span className="text-xs text-blue-300">JWT Auth Required</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 backdrop-blur-sm">
              <Zap size={12} className="text-purple-400" />
              <span className="text-xs text-purple-300">
                Rate Limit: 1000/hr
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Modern Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm p-5 border border-blue-200/20 hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />
          <div className="relative flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Code2 size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">24+</p>
              <p className="text-xs text-gray-500 font-medium">API Endpoints</p>
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm p-5 border border-purple-200/20 hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300" />
          <div className="relative flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <Database size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-xs text-gray-500 font-medium">
                Data Resources
              </p>
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm p-5 border border-emerald-200/20 hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300" />
          <div className="relative flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Lock size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">RBAC</p>
              <p className="text-xs text-gray-500 font-medium">
                Role-Based Access
              </p>
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-sm p-5 border border-orange-200/20 hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/5 group-hover:to-amber-500/5 transition-all duration-300" />
          <div className="relative flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">99.9%</p>
              <p className="text-xs text-gray-500 font-medium">Uptime SLA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="group rounded-2xl bg-white p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid - API & Integration */}
      <div className="grid lg:grid-cols-2 gap-7">
        {/* API Documentation Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <BookOpen size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              API Documentation
            </h2>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="p-6 space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Base URL</h3>
                <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl">
                  <code className="text-sm font-mono text-gray-300">
                    https://medicare-server-production.up.railway.app/api
                  </code>
                  <button
                    onClick={handleCopyEndpoint}
                    className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
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
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                  <p className="text-sm text-amber-800 mb-3 flex items-center gap-2">
                    <Key size={14} />
                    All API requests require a valid JWT token
                  </p>
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl">
                    <code className="text-xs font-mono text-gray-300">
                      Authorization: Bearer &lt;your_jwt_token&gt;
                    </code>
                    <button
                      onClick={handleCopyToken}
                      className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      {copiedToken ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Quick Start Examples
                </h3>
                <div className="space-y-2">
                  <div className="bg-slate-900 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal size={12} className="text-green-400" />
                      <span className="text-xs text-gray-400">
                        cURL Example
                      </span>
                    </div>
                    <code className="text-xs font-mono text-gray-300">
                      curl -X GET /users/profile \<br />
                      &nbsp;&nbsp;-H "Authorization: Bearer YOUR_TOKEN"
                    </code>
                  </div>
                </div>
              </div>

              <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                View Full API Documentation
                <ExternalLink size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* Integration Guidelines Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <FileCode size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Integration Guidelines
            </h2>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="p-6 space-y-5">
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                  <Server size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Environment Setup
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Configure your environment variables for local development
                    and production deployment.
                  </p>
                  <div className="bg-slate-900 rounded-xl p-3">
                    <code className="text-xs font-mono text-gray-300">
                      NEXT_PUBLIC_API_URL=https://medicare-server-production.up.railway.app/api
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <Shield size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Security Best Practices
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li className="flex items-center gap-2">
                      ✓ Always use HTTPS in production
                    </li>
                    <li className="flex items-center gap-2">
                      ✓ Rotate JWT secrets regularly
                    </li>
                    <li className="flex items-center gap-2">
                      ✓ Implement rate limiting for API routes
                    </li>
                    <li className="flex items-center gap-2">
                      ✓ Validate and sanitize all inputs
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                  <Zap size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Webhooks & Events
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Configure webhooks to receive real-time updates for order
                    status changes, user registrations, and more.
                  </p>
                  <Button variant="secondary" size="sm" className="gap-2">
                    Configure Webhooks
                    <ArrowRight size={12} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete API Endpoints Table */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Complete API Reference
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                All available endpoints organized by resource
              </p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {apiEndpoints.length} endpoints
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3.5 px-6 text-sm font-semibold text-gray-600">
                  Method
                </th>
                <th className="text-left py-3.5 px-6 text-sm font-semibold text-gray-600">
                  Endpoint
                </th>
                <th className="text-left py-3.5 px-6 text-sm font-semibold text-gray-600">
                  Description
                </th>
                <th className="text-left py-3.5 px-6 text-sm font-semibold text-gray-600">
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
                      className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-mono font-semibold ${
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
                    {endpoint.auth ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        <Key size={10} />
                        JWT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <Globe size={10} />
                        Public
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tech Stack & Support */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-gray-50 p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md">
              <Cpu size={16} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Technology Stack</h3>
          </div>
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
              "Recharts",
              "Lucide Icons",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-white rounded-xl text-xs font-medium text-gray-700 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-gray-50 p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 shadow-md">
              <HeartHandshake size={16} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Support & Resources</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Need help with integration? Check our detailed API documentation or
            contact our developer support team.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" className="gap-2">
              <FileCode size={14} />
              API Reference
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <ExternalLink size={14} />
              Postman Collection
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <MessageCircle size={14} />
              Support Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Qodeax Footer */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-48 w-48 rounded-full bg-purple-500/10 blur-2xl" />

        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">Q</span>
            </div>
            <p className="text-sm text-gray-300">
              Built with precision by{" "}
              <a
                href="https://www.qodeax.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-blue-400 transition-colors inline-flex items-center gap-1"
              >
                Qodeax – Software Agency
                <ExternalLink size={12} />
              </a>
            </p>
          </div>
          <p className="text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
            Qodeax specializes in building high-performance web applications,
            scalable backend systems, and developer-first tools. This admin
            panel is engineered for clarity, performance, and complete API
            controllability.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a
              href="#"
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              <Github size={16} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              <Twitter size={16} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              <Mail size={16} />
            </a>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <p className="text-[10px] text-gray-500">
              © 2024 MediCare. All rights reserved. | Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
