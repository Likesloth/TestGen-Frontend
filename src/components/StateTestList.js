import React from 'react'

export default function StateTestList({ validTests = [], invalidTests = [] }) {
  const total = (validTests?.length || 0) + (invalidTests?.length || 0)

  // Combined section wrapper for both tables
  return (
    <>
      {/* Valid State Transitions */}
      <section className="mt-12 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Valid Single State Transitions Test Cases</h2>
        <div className="relative -mx-6 px-6 overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {['Test Case ID', 'Type', 'Start State', 'Transition (Start → Expected)', 'Expected State', 'Coverage (%)'].map(h => (
                <th
                  key={h}
                  className="py-2 px-4 text-sm font-medium text-ink-700 text-center"
                >
                  {h}
                </th>
             ))}
            </tr>
          </thead>
          <tbody>
            {validTests.map((t, idx) => {
              const fallback = total > 0 ? ((idx + 1) / total) * 100 : 0
              const coverage = typeof t.coverage === 'number' ? t.coverage : fallback
              const desc = typeof t.transitionDescription === 'string' && t.transitionDescription
                ? t.transitionDescription.replace(/-+>/g, ' → ').replace(/-\s*>/g, ' → ')
                : `${t.startState} → ${t.expectedState ?? ''}`
              return (
                <tr
                  key={t.testCaseID}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="py-2 px-4 text-sm text-center">{t.testCaseID}</td>
                  <td className="py-2 px-4 text-sm text-center">{t.type}</td>
                  <td className="py-2 px-4 text-sm text-center">{t.startState}</td>
                  <td className="py-2 px-4 text-sm text-center">{desc}</td>
                  <td className="py-2 px-4 text-sm text-center">{t.expectedState ?? '—'}</td>
                  <td className="py-2 px-4 text-sm text-center">{`${coverage.toFixed(2)}%`}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </section>

      {/* Invalid State Transitions */}
      <section className="mt-12 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Invalid Single State Transitions Test Cases</h2>
        <div className="relative -mx-6 px-6 overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {['Test Case ID', 'Type', 'Start State', 'Transition (Start → Expected)', 'Expected State', 'Coverage (%)'].map(h => (
                <th
                  key={h}
                  className="py-2 px-4 text-sm font-medium text-ink-700 text-center"
                >
                  {h}
                </th>
             ))}
            </tr>
          </thead>
          <tbody>
            {invalidTests.map((t, idx) => {
              const start = validTests?.length || 0
              const fallback = total > 0 ? ((start + idx + 1) / total) * 100 : 0
              const coverage = typeof t.coverage === 'number' ? t.coverage : fallback
              const desc = typeof t.transitionDescription === 'string' && t.transitionDescription
                ? t.transitionDescription.replace(/-+>/g, ' → ').replace(/-\s*>/g, ' → ')
                : `${t.startState} → ${t.expectedState ?? ''}`
              return (
                <tr
                  key={t.testCaseID}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="py-2 px-4 text-sm text-center">{t.testCaseID}</td>
                  <td className="py-2 px-4 text-sm text-center">{t.type}</td>
                  <td className="py-2 px-4 text-sm text-center">{t.startState}</td>
                  <td className="py-2 px-4 text-sm text-center">{desc}</td>
                  <td className="py-2 px-4 text-sm text-center">{t.expectedState ?? '—'}</td>
                  <td className="py-2 px-4 text-sm text-center">{`${coverage.toFixed(2)}%`}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </section>
    </>
  )
}
