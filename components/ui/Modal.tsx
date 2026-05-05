// src/components/ui/Modal.tsx - Updated with Portal and transparent background
"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Transparent backdrop - removed bg-opacity */}
      <div
        className="fixed inset-0 backdrop-blur transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-xl text-left shadow-sm">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-red-600 bg-red-100 hover:bg-red-200 transition-colors p-2 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
