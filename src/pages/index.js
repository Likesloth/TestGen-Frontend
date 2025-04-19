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
  // Data & form state
  const [data, setData]                   = useState(null);
  const [loading, setLoading]             = useState(false);

  // Auth & user state
  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [currentUser, setCurrentUser]     = useState('');

  // File previews
  const [dataDictPreview, setDataDictPreview]         = useState('');
  const [decisionTreePreview, setDecisionTreePreview] = useState('');

  // XML preview modal
  const [xmlModal, setXmlModal] = useState({
    open: false,
    title: '',
    content: ''
  });

  // Auth modals
  const [loginOpen, setLoginOpen]       = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // On mount, restore auth state
  useEffect(() => {
    const token    = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsLoggedIn(true);
      setCurrentUser(username);
    }
  }, []);

  // FileReader for previews
  const handleFilePreview = (file, setter) => {
    if (!file) return setter('');
    const reader = new FileReader();
    reader.onload = e => setter(e.target.result);
    reader.readAsText(file);
  };

  // XML preview handlers
  const openXmlModal = (title, content) => {
    setXmlModal({ open: true, title, content });
  };
  const closeXmlModal = () => setXmlModal(m => ({ ...m, open: false }));

  // Login handler
  const handleLogin = async (username, password) => {
    const { success, token, error } = await login(username, password);
    if (success) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      setIsLoggedIn(true);
      setCurrentUser(username);
      setLoginOpen(false);
    } else {
      alert(error);
    }
  };

  // Register handler
  const handleRegister = async (username, password) => {
    const { success, error } = await register(username, password);
    if (success) {
      alert('Registration successful! Please log in.');
      setRegisterOpen(false);
    } else {
      alert(error);
    }
  };

  // Generate & save test run
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
      if (json.success) {
        setData(json);
      } else {
        alert(json.error || 'Generation failed');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setCurrentUser('');
  };

  return (
    <main className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">TestGen Web</h1>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Hello, {currentUser}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <button
              onClick={() => setLoginOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>
            <button
              onClick={() => setRegisterOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Register
            </button>
          </div>
        )}
      </div>

      {/* Upload & Generate Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow rounded-lg p-6"
      >
        {/* Data Dictionary */}
        <div>
          <label className="block mb-1 font-medium">Data Dictionary (XML)</label>
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
          <label className="block mb-1 font-medium">Decision Tree (XML)</label>
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

        {/* Generate Button */}
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
