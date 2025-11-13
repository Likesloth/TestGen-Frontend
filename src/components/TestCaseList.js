// src/components/TestCaseList.js
import React from 'react';

export default function TestCaseList({ testCases }) {
  if (!testCases || testCases.length === 0) {
    return (
      <section className="mt-12 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Equivalence Class Partitioning Test Cases</h2>
        <p className="text-gray-600">No test cases to display.</p>
      </section>
    );
  }

  // Derive column names from the first test case
  const inputKeys    = Object.keys(testCases[0].inputs || {});
  const expectedKeys = Object.keys(testCases[0].expected || {});
  const headers      = ['Test Case ID', 'Type', ...inputKeys, ...expectedKeys, 'Coverage (%)'];

  return (
    <section className="mt-12 bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Equivalence Class Partitioning Test Cases</h2>
      {/* Responsive horizontal scroll with sticky header */}
      <div className="relative -mx-6 px-6 overflow-x-auto">
      <table className="min-w-full table-auto text-base">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {headers.map(h => (
              <th
                key={h}
                className="py-2 px-4 text-base font-medium text-ink-700 text-center"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {testCases.map((tc, idx) => {
            const computedCoverage = ((idx + 1) / testCases.length) * 100;
            const coverage = typeof tc.coverage === 'number' ? tc.coverage : computedCoverage;
            return (
            <tr
              key={tc.testCaseID}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="py-2 px-4 text-base text-center">
                {tc.testCaseID}
              </td>
              <td className="py-2 px-4 text-base text-center">
                {tc.type ?? 'Valid'}
              </td>

              {inputKeys.map(key => (
                <td key={key} className="py-2 px-4 text-base text-center">
                  {tc.inputs?.[key]}
                </td>
              ))}

              {expectedKeys.map(key => (
                <td key={key} className="py-2 px-4 text-base text-center">
                  {tc.expected?.[key]}
                </td>
              ))}

              <td className="py-2 px-4 text-base text-center">
                {`${coverage.toFixed(2)}%`}
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </section>
  );
}
