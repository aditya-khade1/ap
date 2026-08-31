"use client";

import { useToast } from "@/hooks/useToast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-medium animate-slide-in ${
            toast.type === "success"
              ? "bg-ink text-white"
              : toast.type === "error"
                ? "bg-red-600 text-white"
                : "bg-white text-ink border border-black/10"
          }`}
        >
          {toast.type === "success" && <CheckCircle size={18} />}
          {toast.type === "error" && <AlertCircle size={18} />}
          {toast.type === "info" && <Info size={18} />}
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-70 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
