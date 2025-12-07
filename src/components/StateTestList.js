import React from 'react'

export default function StateTestList({ validTests = [], invalidTests = [] }) {
  // Combine both arrays into one with type indicator
  const allTests = [
    ...validTests.map(t => ({ ...t, type: t.type || 'Valid' })),
    ...invalidTests.map(t => ({ ...t, type: t.type || 'Invalid' }))
  ]

  const total = allTests.length

  if (total === 0) return null

  return (
    <section className="mt-12 bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-ink-900">State Transitions Test Cases</h2>
      <div className="relative -mx-6 px-6 overflow-x-auto">
        <table className="min-w-full table-auto text-base border border-ink-300">
          <thead className="bg-primary-700 sticky top-0 z-10">
            <tr>
              {['Test Case ID', 'Type', 'Start State', 'Transition (Start → Expected)', 'Expected State', 'Coverage (%)'].map(h => (
                <th
                  key={h}
                  className="py-3 px-4 text-base font-semibold text-white text-center border-r border-primary-600 last:border-r-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allTests.map((t, idx) => {
              const fallback = total > 0 ? ((idx + 1) / total) * 100 : 0
              const coverage = typeof t.coverage === 'number' ? t.coverage : fallback
              const desc = typeof t.transitionDescription === 'string' && t.transitionDescription
                ? t.transitionDescription.replace(/-+>/g, ' → ').replace(/-\s*>/g, ' → ')
                : `${t.startState} → ${t.expectedState ?? ''}`

              return (
                <tr
                  key={t.testCaseID}
                  className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="py-3 px-4 text-base font-semibold text-center border border-ink-300">{t.testCaseID}</td>
                  <td className={`py-3 px-4 text-base text-center border border-ink-300 ${t.type === 'Invalid' ? 'text-red-600 font-semibold' : ''}`}>{t.type}</td>
                  <td className="py-3 px-4 text-base text-center border border-ink-300">{t.startState}</td>
                  <td className="py-3 px-4 text-base text-center border border-ink-300">{desc}</td>
                  <td className="py-3 px-4 text-base text-center border border-ink-300">{t.expectedState ?? '—'}</td>
                  <td className="py-3 px-4 text-base font-semibold text-primary-700 text-center border border-ink-300">{`${coverage.toFixed(2)}%`}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
