// src/pages/run/[id].js
import { useState, useEffect } from 'react';
import { useRouter }            from 'next/router';
import Navbar                   from '../../components/Navbar';
import PartitionView            from '../../components/PartitionView';
import TestCaseList             from '../../components/TestCaseList';
import { getRun, downloadCsv }  from '../../api/runs';
import Link                     from 'next/link';

export default function RunDetail() {
  const router = useRouter();
  const { id } = router.query;

  // Auth & user
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  // Data state
  const [loading, setLoading]     = useState(true);
  const [partitions, setPartitions] = useState([]);
  const [testCases, setTestCases]   = useState([]);
  const [csvUrl, setCsvUrl]         = useState('');

  // On mount: check auth
  useEffect(() => {
    const token    = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsLoggedIn(true);
      setCurrentUser(username);
    } else {
      router.push('/');  // not logged in → back to Home
    }
  }, [router]);

  // When `id` becomes available, fetch the run
  useEffect(() => {
    if (!id) return;
    getRun(id)
      .then(json => {
        setPartitions(json.partitions);
        setTestCases(json.testCases);
        setCsvUrl(json.csvUrl);
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/');
  };

  if (loading) {
    return <div className="p-6">Loading…</div>;
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
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Run Details</h2>
          <Link href="/history" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to History
          </Link>
        </div>

        <section className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Partitions</h3>
          <PartitionView partitions={partitions} />
        </section>

        <section className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Test Cases</h3>
          <TestCaseList testCases={testCases} />
          <div className="mt-4 text-center">
            <a
              href={csvUrl}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download CSV
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
