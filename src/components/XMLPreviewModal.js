// src/components/XMLPreviewModal.js
import React from 'react';
import { X } from 'lucide-react';

export default function XMLPreviewModal({ isOpen, title, content, onClose }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="border rounded-xl bg-gray-50 p-4 overflow-auto max-h-[60vh]">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
            {content}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
