import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRun } from '../../api/runs';
import PartitionView from '../../components/PartitionView';
import TestCaseList from '../../components/TestCaseList';

export default function RunDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [runData, setRunData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchRun() {
      const json = await getRun(id);
      if (json.success) {
        setRunData(json.run);
      }
      setLoading(false);
    }
    fetchRun();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading run…</div>;
  }

  if (!runData) {
    return (
      <main className="container mx-auto p-6">
        <p>Run not found.</p>
        <Link
          href="/history"
          className="text-indigo-600 hover:underline"
        >
          Back to history
        </Link>
      </main>
    );
  }

  const { partitions, testCases, csvFilename } = runData;
  const csvUrl = `${process.env.NEXT_PUBLIC_API_URL}/exports/${csvFilename}`;

  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Run Details</h1>
        <Link
          href="/history"
          className="text-indigo-600 hover:underline"
        >
          ← Back to history
        </Link>
      </div>

      <PartitionView partitions={partitions} />

      <TestCaseList testCases={testCases} />

      <div className="text-center">
        <a
          href={csvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download CSV
        </a>
      </div>
    </main>
  );
}
