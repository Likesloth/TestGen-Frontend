import React from 'react';

export default function SyntaxTestList({ syntaxResults }) {
  if (!syntaxResults || !syntaxResults.length) {
    return null;
  }

  return (
    <section className="mt-12 bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Syntax-Based Test Cases</h2>
      <div className="relative -mx-6 px-6 overflow-x-auto">
      <table className="min-w-full table-auto text-base">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="py-2 px-4 font-medium text-ink-700">Field</th>
            <th className="py-2 px-4 font-medium text-ink-700">Valid</th>
            <th className="py-2 px-4 font-medium text-ink-700">Invalid Value</th>
            <th className="py-2 px-4 font-medium text-ink-700">Omission</th>
            <th className="py-2 px-4 font-medium text-ink-700">Addition</th>
            <th className="py-2 px-4 font-medium text-ink-700">Substitution</th>
          </tr>
        </thead>
        <tbody>
          {syntaxResults.map((sr, idx) => (
            <tr key={sr.name + idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="py-2 px-4 text-base font-semibold">{sr.name}</td>
              <td className="py-2 px-4 text-base">{sr.testCases.valid}</td>
              <td className="py-2 px-4 text-base">{sr.testCases.invalidValue}</td>
              <td className="py-2 px-4 text-base">{sr.testCases.invalidOmission}</td>
              <td className="py-2 px-4 text-base">{sr.testCases.invalidAddition}</td>
              <td className="py-2 px-4 text-base">{sr.testCases.invalidSubstitution}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  );
}
