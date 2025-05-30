import React from 'react';

export default function SyntaxTestList({ syntaxResults }) {
  if (!syntaxResults || !syntaxResults.length) {
    return null;
  }

  return (
    <section className="mt-12 bg-white shadow rounded-lg p-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Syntax‐Based Test Cases</h2>
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-sm font-medium text-gray-600">Field</th>
            <th className="py-2 px-4 text-sm font-medium text-gray-600">Valid</th>
            <th className="py-2 px-4 text-sm font-medium text-gray-600">Invalid Value</th>
            <th className="py-2 px-4 text-sm font-medium text-gray-600">Omission</th>
            <th className="py-2 px-4 text-sm font-medium text-gray-600">Addition</th>
            <th className="py-2 px-4 text-sm font-medium text-gray-600">Substitution</th>
          </tr>
        </thead>
        <tbody>
          {syntaxResults.map((sr, idx) => (
            <tr key={sr.name + idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="py-2 px-4 text-sm font-semibold">{sr.name}</td>
              <td className="py-2 px-4 text-sm">{sr.testCases.valid}</td>
              <td className="py-2 px-4 text-sm">{sr.testCases.invalidValue}</td>
              <td className="py-2 px-4 text-sm">{sr.testCases.invalidOmission}</td>
              <td className="py-2 px-4 text-sm">{sr.testCases.invalidAddition}</td>
              <td className="py-2 px-4 text-sm">{sr.testCases.invalidSubstitution}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
