// src/components/TestCaseList.js
import React from 'react';

export default function TestCaseList({ testCases }) {
  if (!testCases || testCases.length === 0) {
    return (
      <section className="mt-12 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Generated Test Cases</h2>
        <p className="text-gray-600">No test cases to display.</p>
      </section>
    );
  }

  // Derive column names from the first test case
  const inputKeys    = Object.keys(testCases[0].inputs);
  const expectedKeys = Object.keys(testCases[0].expected);
  const headers      = ['Test Case ID', ...inputKeys, ...expectedKeys];

  return (
    <section className="mt-12 bg-white shadow rounded-lg p-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Generated Test Cases</h2>
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            {headers.map(h => (
              <th
                key={h}
                className="py-2 px-4 text-sm font-medium text-gray-600 text-center"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {testCases.map((tc, idx) => (
            <tr
              key={tc.testCaseID}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="py-2 px-4 text-sm text-center">
                {tc.testCaseID}
              </td>

              {inputKeys.map(key => (
                <td key={key} className="py-2 px-4 text-sm text-center">
                  {tc.inputs[key]}
                </td>
              ))}

              {expectedKeys.map(key => (
                <td key={key} className="py-2 px-4 text-sm text-center">
                  {tc.expected[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
