// src/pages/history.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { listRuns } from '../api/runs';

export default function HistoryPage() {
  const router = useRouter();

  const [runs, setRuns]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const token    = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsLoggedIn(true);
      setCurrentUser(username);
    }
    async function fetchRuns() {
      const data = await listRuns();
      setRuns(data);
      setLoading(false);
    }
    fetchRuns();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setCurrentUser('');
    router.push('/');
  };

  if (loading) {
    return <div className="p-6">Loading history…</div>;
  }

  return (
    <main className="container mx-auto p-6 space-y-6 relative min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">TestGen Web</h1>
        {isLoggedIn && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Hello, {currentUser}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-semibold">Test Run History</h2>

      {runs.length === 0 ? (
        <p>No runs yet.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Data Dictionary</th>
              <th className="px-4 py-2 text-left">Decision Tree</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {runs.map(run => (
              <tr key={run._id} className="border-t">
                <td className="px-4 py-2 text-sm">
                  {new Date(run.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm">
                  {run.dataDictionaryFilename}
                </td>
                <td className="px-4 py-2 text-sm">
                  {run.decisionTreeFilename}
                </td>
                <td className="px-4 py-2 text-sm">
                  <Link
                    href={`/run/${run._id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Fixed back button in bottom-left corner */}
      <Link
        href="/"
        className="fixed bottom-4 left-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to TestGen
      </Link>
    </main>
  );
}
