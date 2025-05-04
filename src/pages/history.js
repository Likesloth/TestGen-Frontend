// src/pages/history.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Link   from 'next/link';
import { listRuns } from '../api/runs';

export default function HistoryPage() {
  const router = useRouter();

  const [runs, setRuns]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const token    = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
      setIsLoggedIn(true);
      setCurrentUser(username);

      listRuns()
        .then(data => setRuns(data))
        .catch(err => {
          console.error(err);
          alert(err.message || 'Could not load history');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      router.push('/'); // not logged in → back to main
    }
  }, [router]);

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
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLoginOpen={() => {}}
        onRegisterOpen={() => {}}
        onLogout={handleLogout}
      />

      <main className="container mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold">TestGen History</h2>

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
      </main>
    </>
  );
}
