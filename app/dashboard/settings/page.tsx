"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Bell, Moon, Sun, Shield, User, Globe } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your preferences and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <User size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Settings
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 234 567 8900"
              />
            </div>
            <Button>Update Profile</Button>
          </div>
        </Card>

        {/* Preferences */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Globe size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Preferences</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Dark Mode</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">
                  Email Notifications
                </span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white" />
                </button>
              </label>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Security</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left text-sm text-gray-700 hover:text-blue-600 transition-colors">
                Change Password
              </button>
              <button className="w-full text-left text-sm text-gray-700 hover:text-blue-600 transition-colors">
                Two-Factor Authentication
              </button>
              <button className="w-full text-left text-sm text-gray-700 hover:text-blue-600 transition-colors">
                Session Management
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
