// src/pages/history.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Link   from 'next/link';
import { listRuns } from '../api/runs';
import { useToast } from '../components/ui/ToastProvider';

export default function HistoryPage() {
  const toast = useToast();
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
          toast.error("Couldn't load history. Please try again.");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      router.push('/'); // not logged in — back to main
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
    return <div className="p-6">Loading history...</div>;
  }

  return (
    <>
      <header role="banner">
      <Navbar
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLoginOpen={() => {}}
        onRegisterOpen={() => {}}
        onLogout={handleLogout}
      />
      </header>

      <main id="main" className="max-w-content mx-auto p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-bold text-ink-900">TestGen History</h1>

        {runs.length === 0 ? (
          <p className="text-ink-700">No test runs yet. Upload XMLs on Home to get started.</p>
        ) : (
          <div className="relative -mx-6 px-6 overflow-x-auto">
            <table className="min-w-full table-auto text-sm bg-white shadow rounded-lg">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-ink-700">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-ink-700">Data Dictionary</th>
                  <th className="px-4 py-2 text-left font-medium text-ink-700">Decision Tree</th>
                  <th className="px-4 py-2 text-left font-medium text-ink-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {runs.map(run => (
                  <tr key={run._id} className="border-t">
                    <td className="px-4 py-2">
                      {new Date(run.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {run.dataDictionaryFilename}
                    </td>
                    <td className="px-4 py-2">
                      {run.decisionTreeFilename}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/run/${run._id}`}
                        className="text-primary-700 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <footer role="contentinfo" className="max-w-content mx-auto p-6 md:p-8"></footer>
    </>
  );
}
