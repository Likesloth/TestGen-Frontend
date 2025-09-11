import React from 'react';

export default function StateSequenceList({ sequences = [] }) {
  if (!sequences || sequences.length === 0) return null;

  return (
    <section className="mt-12 bg-white shadow rounded-lg p-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">State Sequences</h2>

      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            {['Test Case ID', 'Sequence of Transitions', 'Coverage (%)'].map((h, i) => (
              <th
                key={h}
                className={`py-2 px-4 text-sm font-medium text-gray-600 ${i === 1 ? 'text-left' : 'text-center'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sequences.map((s, idx) => {
            const seq = Array.isArray(s.sequence) ? s.sequence : [];
            const fallback = sequences.length > 0 ? ((idx + 1) / sequences.length) * 100 : 0;
            const coverage = typeof s.coverage === 'number' ? s.coverage : fallback;
            return (
              <tr
                key={s.seqCaseID || idx}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="py-2 px-4 text-sm text-center">{s.seqCaseID}</td>
                <td className="py-2 px-4 text-sm text-left">
                  {seq.join(' -> ')}
                </td>
                <td className="py-2 px-4 text-sm text-center">{`${coverage.toFixed(2)}%`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
