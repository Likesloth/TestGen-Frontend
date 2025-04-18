// src/pages/index.js
import { useState } from 'react';
import PartitionView from '../components/PartitionView';
import TestCaseList from '../components/TestCaseList';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Previews
  const [dataDictPreview, setDataDictPreview] = useState('');
  const [decisionTreePreview, setDecisionTreePreview] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  // Read file as text
  const handleFilePreview = (file, setter) => {
    if (!file) return setter('');
    const reader = new FileReader();
    reader.onload = e => setter(e.target.result);
    reader.readAsText(file);
  };

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    try {
      const res = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        body: fd
      });
      const json = await res.json();
      if (json.success) setData(json);
      else alert(json.error);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center">TestGen Web</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow rounded-lg p-6"
      >
        <div>
          <label className="block mb-1 font-medium">Data Dictionary (XML)</label>
          <input
            type="file"
            name="dataDictionary"
            accept=".xml"
            required
            className="
              block w-full
              border-2 border-dashed border-gray-300
              rounded-lg p-6 text-center text-gray-600
              hover:border-blue-400 focus:outline-none focus:border-blue-500
              cursor-pointer
            "
            onChange={e =>
              handleFilePreview(e.target.files[0], setDataDictPreview)
            }
          />
          <button
            type="button"
            disabled={!dataDictPreview}
            onClick={() => openModal('Data Dictionary Preview', dataDictPreview)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            Preview XML
          </button>
        </div>

        <div>
          <label className="block mb-1 font-medium">Decision Tree (XML)</label>
          <input
            type="file"
            name="decisionTree"
            accept=".xml"
            required
            className="
              block w-full
              border-2 border-dashed border-gray-300
              rounded-lg p-6 text-center text-gray-600
              hover:border-blue-400 focus:outline-none focus:border-blue-500
              cursor-pointer
            "
            onChange={e =>
              handleFilePreview(e.target.files[0], setDecisionTreePreview)
            }
          />
          <button
            type="button"
            disabled={!decisionTreePreview}
            onClick={() =>
              openModal('Decision Tree Preview', decisionTreePreview)
            }
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            Preview XML
          </button>
        </div>

        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </form>

      {data && (
        <>
          <PartitionView partitions={data.partitions} />
          <TestCaseList testCases={data.testCases} />
          <div className="text-center">
            <a
              href={data.csvFile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Download CSV
            </a>
          </div>
        </>
      )}

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{modalTitle}</h3>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 text-xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-4 whitespace-pre-wrap text-xs">
              {modalContent}
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
