// src/components/PartitionView.js
import React from 'react';

export default function PartitionView({ partitions }) {
  return (
    <div className="space-y-10">
      {partitions.map(({ name, items }) => (
        <section key={name} className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{name}</h2>

          {/* Contiguous bar */}
          <div className="relative w-full h-8 bg-gray-200 flex rounded overflow-hidden mb-2">
            {items.map((p, i) => (
              <div
                key={p.id}
                className={`
                  flex-1 flex items-center justify-center
                  ${i < items.length - 1 ? 'border-r border-white' : ''}
                `}
                style={{ backgroundColor: '#38a169' }}
              >
                <span className="text-xs font-bold text-red-400">{p.id}</span>
              </div>
            ))}
          </div>

          {/* Labels */}
          <div className="flex text-sm text-gray-700">
            {items.map(p => (
              <div key={p.id} className="flex-1 text-center truncate">
                {p.label}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
