// src/components/PartitionView.js
import React from 'react';

export default function PartitionView({ partitions }) {
  if (!Array.isArray(partitions)) return null;

  return (
    <div className="space-y-10">
      {partitions.map(group => {
        const { name, items } = group;
        if (!Array.isArray(items)) return null;

        return (
          <section key={name} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-ink-900">{name}</h2>

            {/* Bar */}
            <div className="relative w-full h-10 bg-ink-300 flex rounded overflow-hidden mb-2">
              {items.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex-1 flex items-center justify-center bg-primary-600 ${
                    i < items.length - 1 ? 'border-r border-white' : ''
                  }`}
                >
                  <span className="text-sm font-semibold text-white">{p.id}</span>
                </div>
              ))}
            </div>

            {/* Labels */}
            <div className="flex text-sm text-ink-700">
              {items.map(p => (
                <div key={p.id} className="flex-1 text-center truncate">
                  {p.label}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
