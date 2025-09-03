import React from 'react'

export default function StateTestList({ validTests = [], invalidTests = [] }) {
  // Combined section wrapper for both tables
  return (
    <>
      {/* Valid State Transitions */}
      <section className="mt-12 bg-white shadow rounded-lg p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Valid State Transitions</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              {['Test Case ID', 'Type', 'Start State', 'Event', 'Expected State'].map(h => (
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
            {validTests.map((t, idx) => (
              <tr
                key={t.testCaseID}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="py-2 px-4 text-sm text-center">{t.testCaseID}</td>
                <td className="py-2 px-4 text-sm text-center">{t.type}</td>
                <td className="py-2 px-4 text-sm text-center">{t.startState}</td>
                <td className="py-2 px-4 text-sm text-center">{t.event}</td>
                <td className="py-2 px-4 text-sm text-center">{t.expectedState ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Invalid State Transitions */}
      <section className="mt-12 bg-white shadow rounded-lg p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Invalid State Transitions</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              {['Test Case ID', 'Type', 'Start State', 'Event', 'Expected State'].map(h => (
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
            {invalidTests.map((t, idx) => (
              <tr
                key={t.testCaseID}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="py-2 px-4 text-sm text-center">{t.testCaseID}</td>
                <td className="py-2 px-4 text-sm text-center">{t.type}</td>
                <td className="py-2 px-4 text-sm text-center">{t.startState}</td>
                <td className="py-2 px-4 text-sm text-center">{t.event}</td>
                <td className="py-2 px-4 text-sm text-center">{t.expectedState ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
