import React from 'react';

function renderSequenceString(s) {
  const steps = Array.isArray(s?.steps) ? s.steps : [];
  const seq = Array.isArray(s?.sequence) ? s.sequence : [];

  if (steps.length > 0) {
    const first = steps[0]?.from ?? seq[0] ?? '';
    const parts = [first];
    steps.forEach(st => {
      const ev = st?.event ?? '';
      const to = st?.to ?? '';
      if (ev) {
        parts.push(` (${ev}) → ${to}`);
      } else {
        parts.push(` → ${to}`);
      }
    });
    return parts.join(' ');
  }

  // Fallback to simple state chain
  return seq.join(' → ');
}

export default function StateSequenceList({ sequences = [] }) {
  if (!sequences || sequences.length === 0) return null;

  return (
    <section className="mt-12 bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Sequences State Transitions Test Case</h2>

      <div className="relative -mx-6 px-6 overflow-x-auto">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {['Test Case ID', 'Sequence (events)', 'Coverage (%)'].map((h, i) => (
              <th
                key={h}
                className={`py-2 px-4 text-sm font-medium text-ink-700 ${i === 1 ? 'text-left' : 'text-center'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sequences.map((s, idx) => {
            const fallback = sequences.length > 0 ? ((idx + 1) / sequences.length) * 100 : 0;
            const coverage = typeof s.coverage === 'number' ? s.coverage : fallback;
            return (
              <tr
                key={s.seqCaseID || idx}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="py-2 px-4 text-sm text-center">{s.seqCaseID}</td>
                <td className="py-2 px-4 text-sm text-left whitespace-pre-wrap">
                  {renderSequenceString(s)}
                </td>
                <td className="py-2 px-4 text-sm text-center">{`${coverage.toFixed(2)}%`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </section>
  );
}
