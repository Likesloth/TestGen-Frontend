// src/pages/index.js
import { useState, useEffect } from 'react';
import PartitionView      from '../components/PartitionView';
import TestCaseList       from '../components/TestCaseList';
import XMLPreviewModal    from '../components/XMLPreviewModal';
import LoginModal         from '../components/LoginModal';
import RegisterModal      from '../components/RegisterModal';
import { generateTestRun } from '../api/generate';
import { login, register } from '../api/auth';

export default function Home() {
  const [data, setData]                   = useState(null);
  const [loading, setLoading]             = useState(false);
  const [isLoggedIn, setIsLoggedIn]       = useState(false);

  const [dataDictPreview, setDataDictPreview]         = useState('');
  const [decisionTreePreview, setDecisionTreePreview] = useState('');

  // XML modal
  const [xmlModal, setXmlModal] = useState({
    open: false,
    title: '',
    content: ''
  });

  // Auth modals
  const [loginOpen, setLoginOpen]       = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Check token on mount
  useEffect(() => {
    if (localStorage.getItem('token')) setIsLoggedIn(true);
  }, []);

  const handleFilePreview = (file, setter) => {
    if (!file) return setter('');
    const reader = new FileReader();
    reader.onload = e => setter(e.target.result);
    reader.readAsText(file);
  };

  const openXmlModal = (title, content) => {
    setXmlModal({ open: true, title, content });
  };
  const closeXmlModal = () => setXmlModal(m => ({ ...m, open: false }));

  const handleLogin = async (username, password) => {
    const { success, token, error } = await login(username, password);
    if (success) {
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setLoginOpen(false);
    } else alert(error);
  };

  const handleRegister = async (username, password) => {
    const { success, error } = await register(username, password);
    if (success) {
      alert('Registered! Please log in.');
      setRegisterOpen(false);
    } else alert(error);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }
    setLoading(true);
    const fd = new FormData(e.target);
    try {
      const json = await generateTestRun(fd);
      if (json.success) setData(json);
      else alert(json.error);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">TestGen Web</h1>
        {isLoggedIn
          ? <button
              onClick={() => {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >Logout</button>
          : <div className="space-x-4">
              <button
                onClick={() => setLoginOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >Login</button>
              <button
                onClick={() => setRegisterOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >Register</button>
            </div>
        }
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow rounded-lg p-6"
      >
        {/* Data Dictionary */}
        <div>
          <label className="block mb-1 font-medium">
            Data Dictionary (XML)
          </label>
          <input
            type="file"
            name="dataDictionary"
            accept=".xml"
            required
            className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600 hover:border-blue-400 focus:outline-none focus:border-blue-500 cursor-pointer"
            onChange={e =>
              handleFilePreview(e.target.files[0], setDataDictPreview)
            }
          />
          <button
            type="button"
            disabled={!dataDictPreview}
            onClick={() =>
              openXmlModal('Data Dictionary Preview', dataDictPreview)
            }
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            Preview XML
          </button>
        </div>

        {/* Decision Tree */}
        <div>
          <label className="block mb-1 font-medium">
            Decision Tree (XML)
          </label>
          <input
            type="file"
            name="decisionTree"
            accept=".xml"
            required
            className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600 hover:border-blue-400 focus:outline-none focus:border-blue-500 cursor-pointer"
            onChange={e =>
              handleFilePreview(e.target.files[0], setDecisionTreePreview)
            }
          />
          <button
            type="button"
            disabled={!decisionTreePreview}
            onClick={() =>
              openXmlModal('Decision Tree Preview', decisionTreePreview)
            }
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            Preview XML
          </button>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? 'Generating…' : 'Generate & Save'}
          </button>
        </div>
      </form>

      {/* Results */}
      {data && (
        <>
          <PartitionView partitions={data.partitions} />
          <TestCaseList testCases={data.testCases} />
          <div className="text-center">
            <a
              href={data.csvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Download CSV
            </a>
          </div>
        </>
      )}

      {/* Modals */}
      <XMLPreviewModal
        isOpen={xmlModal.open}
        title={xmlModal.title}
        content={xmlModal.content}
        onClose={closeXmlModal}
      />
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegister={handleRegister}
      />
    </main>
  );
}
