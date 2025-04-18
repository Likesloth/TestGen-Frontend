// src/components/TestCaseList.js
import React from 'react';

export default function TestCaseList({ testCases }) {
  return (
    <section className="mt-12 bg-white shadow rounded-lg p-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Generated Test Cases</h2>
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            {['ID', 'Order Price', 'Customer Type', 'Expected Discount'].map(h => (
              <th
                key={h}
                className="py-2 px-4 text-sm font-medium text-gray-600"
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
              <td className="py-2 px-4 text-sm">{tc.testCaseID}</td>
              <td className="py-2 px-4 text-sm">{tc.orderPrice}</td>
              <td className="py-2 px-4 text-sm">{tc.customerType}</td>
              <td className="py-2 px-4 text-sm">{tc.expectedDiscount}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
