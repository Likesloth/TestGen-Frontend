// src/components/PartitionView.js
import React from 'react';

export default function PartitionView({ partitions }) {
  if (!Array.isArray(partitions)) return null;

  // Treat partitions marked as invalid (via explicit flags or obvious keywords) as needing red emphasis
  const isInvalidPartition = partition => {
    const type = String(partition?.type ?? partition?.status ?? partition?.category ?? '').toLowerCase();
    if (type === 'invalid' || partition?.isValid === false || partition?.valid === false) return true;

    // Fallback: detect common invalid labels like underflow/overflow/none
    const text = `${partition?.id ?? ''} ${partition?.label ?? ''}`.toLowerCase();
    const invalidKeywords = ['underflow', 'overflow', 'invalid', 'none', 'out of range', 'outside'];
    return invalidKeywords.some(word => text.includes(word));
  };

  return (
    <div className="space-y-10">
      {partitions.map(group => {
        const { name, items } = group;
        if (!Array.isArray(items)) return null;

        return (
          <section key={name} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6 text-ink-900">{name}</h2>

            {/* Bar - Larger and more visible */}
            <div className="relative w-full h-16 bg-ink-300 flex rounded-lg overflow-hidden mb-3 shadow-sm">
              {items.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex-1 flex items-center justify-center ${isInvalidPartition(p) ? 'bg-gray-700' : 'bg-blue-700'} ${i < items.length - 1 ? 'border-r-2 border-white' : ''
                    }`}
                >
                  <span className="text-lg font-bold text-white">{p.id}</span>
                </div>
              ))}
            </div>

            {/* Labels - Larger text */}
            <div className="flex text-base font-medium">
              {items.map(p => (
                <div
                  key={p.id}
                  className={`flex-1 text-center truncate px-1 ${isInvalidPartition(p) ? 'text-red-600 font-semibold' : 'text-ink-700'}`}
                >
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
