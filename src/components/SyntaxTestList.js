import React from 'react';

export default function SyntaxTestList({ syntaxResults }) {
  if (!syntaxResults || !syntaxResults.length) {
    return null;
  }

  return (
    <section className="mt-12 bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-ink-900">Syntax-Based Test Cases</h2>
      <div className="relative -mx-6 px-6 overflow-x-auto">
        <table className="min-w-full table-auto text-base border border-ink-300">
          <thead className="bg-primary-700 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-base font-semibold text-white text-center border-r border-primary-600">Field</th>
              <th className="py-3 px-4 text-base font-semibold text-white text-center border-r border-primary-600">Valid</th>
              <th className="py-3 px-4 text-base font-semibold text-white text-center border-r border-primary-600">Invalid Value</th>
              <th className="py-3 px-4 text-base font-semibold text-white text-center border-r border-primary-600">Omission</th>
              <th className="py-3 px-4 text-base font-semibold text-white text-center border-r border-primary-600">Addition</th>
              <th className="py-3 px-4 text-base font-semibold text-white text-center">Substitution</th>
            </tr>
          </thead>
          <tbody>
            {syntaxResults.map((sr, idx) => (
              <tr key={sr.name + idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-3 px-4 text-base font-semibold text-ink-900 text-center border border-ink-300">{sr.name}</td>
                <td className="py-3 px-4 text-base text-center border border-ink-300">{sr.testCases.valid}</td>
                <td className="py-3 px-4 text-base text-center border border-ink-300">{sr.testCases.invalidValue}</td>
                <td className="py-3 px-4 text-base text-center border border-ink-300">{sr.testCases.invalidOmission}</td>
                <td className="py-3 px-4 text-base text-center border border-ink-300">{sr.testCases.invalidAddition}</td>
                <td className="py-3 px-4 text-base text-center border border-ink-300">{sr.testCases.invalidSubstitution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
