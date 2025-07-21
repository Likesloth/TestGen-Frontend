// src/pages/index.js
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import PartitionView from '../components/PartitionView';
import TestCaseList from '../components/TestCaseList';
import SyntaxTestList from '../components/SyntaxTestList';
import StateTestList from '../components/StateTestList';
import XMLPreviewModal from '../components/XMLPreviewModal';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import { generateTestRun } from '../api/generate';
import { login, register } from '../api/auth';
import { BASE } from '../api/runs';

export default function Home() {
  // Auth & user state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  // Generation result + loading
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // XML-preview modal
  const [xmlModal, setXmlModal] = useState({
    open: false,
    title: '',
    content: ''
  });

  // Auth modals
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Refs for file inputs
  const dataDictRef = useRef(null);
  const decisionTreeRef = useRef(null);
  const stateMachineRef = useRef(null);

  // Restore auth from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsLoggedIn(true);
      setCurrentUser(username);
    }
  }, []);

  const openXmlModal = (title, content) => {
    setXmlModal({ open: true, title, content });
  };
  const closeXmlModal = () =>
    setXmlModal(m => ({ ...m, open: false }));

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

  const handleRegister = async (username, password) => {
    const { success, error } = await register(username, password);
    if (success) {
      alert('Registration successful! Please log in.');
      setRegisterOpen(false);
    } else {
      alert(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setCurrentUser('');
  };

  // Preview handlers — read file text on demand
  const handleDictPreview = async () => {
    const file = dataDictRef.current?.files?.[0];
    if (!file) return;
    const text = await file.text();
    openXmlModal('Data Dictionary Preview', text);
  };
  const handleTreePreview = async () => {
    const file = decisionTreeRef.current?.files?.[0];
    if (!file) return;
    const text = await file.text();
    openXmlModal('Decision Tree Preview', text);
  };
  const handleStatePreview = async () => {
    const file = stateMachineRef.current?.files?.[0];
    if (!file) return;
    const text = await file.text();
    openXmlModal('State Machine Preview', text);
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
      if (json.success) {
        const runId = json.runId;
        const combinedUrl = json.csvUrl || `${BASE}/api/runs/${runId}/csv`;
        const ecpUrl = `${BASE}/api/runs/${runId}/ecp-csv`;
        const syntaxUrl = `${BASE}/api/runs/${runId}/syntax-csv`;
        const stateUrl = `${BASE}/api/runs/${runId}/state-csv`;

        setData({
          partitions: json.partitions,
          testCases: json.testCases,
          syntaxResults: json.syntaxResults,
          stateValid: json.stateValid,
          stateInvalid: json.stateInvalid,
          csvUrl: combinedUrl,
          ecpCsvUrl: ecpUrl,
          syntaxCsvUrl: syntaxUrl,
          stateCsvUrl: stateUrl
        });
      } else {
        alert(json.error || 'Generation failed');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLoginOpen={() => setLoginOpen(true)}
        onRegisterOpen={() => setRegisterOpen(true)}
        onLogout={handleLogout}
      />

      <main className="container mx-auto p-6 space-y-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white shadow rounded-lg p-6"
        >
          {/* Data Dictionary */}
          <div>
            <label className="block mb-1 font-medium">
              Data Dictionary (XML)
            </label>
            <input
              ref={dataDictRef}
              type="file"
              name="dataDictionary"
              accept=".xml"
              required
              className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600 hover:border-blue-400 focus:outline-none focus:border-blue-500 cursor-pointer"
            />
            <button
              type="button"
              onClick={handleDictPreview}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
              ref={decisionTreeRef}
              type="file"
              name="decisionTree"
              accept=".xml"
              required
              className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600 hover:border-blue-400 focus:outline-none focus:border-blue-500 cursor-pointer"
            />
            <button
              type="button"
              onClick={handleTreePreview}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Preview XML
            </button>
          </div>

          {/* State Machine (optional) */}
          <div>
            <label className="block mb-1 font-medium">
              State Machine (XML)
            </label>
            <input
              ref={stateMachineRef}
              type="file"
              name="stateMachine"
              accept=".xml"
              className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600 hover:border-blue-400 focus:outline-none focus:border-blue-500 cursor-pointer"
            />
            <button
              type="button"
              onClick={handleStatePreview}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Preview XML
            </button>
          </div>

          {/* Generate & Save — spans all three columns */}
          <div className="md:col-span-3 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {loading ? 'Generating…' : 'Generate & Save'}
            </button>
          </div>
        </form>

        {/* Show results only once we have data */}
        {data && (
          <>
            {/* Partitions */}
            <PartitionView partitions={data.partitions} />

            {/* ECP Test Cases */}
            <section className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">ECP Test Cases</h3>
              <TestCaseList testCases={data.testCases} />
              <div className="mt-4 text-center">
                <a
                  href={data.ecpCsvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Download ECP CSV
                </a>
              </div>
            </section>

            {/* Syntax Test Cases */}
            <section className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Syntax Test Cases</h3>
              <SyntaxTestList syntaxResults={data.syntaxResults} />
              <div className="mt-4 text-center">
                <a
                  href={data.syntaxCsvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Download Syntax CSV
                </a>
              </div>
            </section>

            {/* State Transition Tests (only if present) */}
            {(data.stateValid?.length > 0 || data.stateInvalid?.length > 0) && (
              <section className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">State Transition Tests</h3>
                <StateTestList
                  validTests={data.stateValid}
                  invalidTests={data.stateInvalid}
                />
                <div className="mt-4 text-center">
                  <a
                    href={data.stateCsvUrl}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download State CSV
                  </a>
                </div>
              </section>
            )}

            {/* Combined CSV */}
            <div className="text-center mt-6">
              <a
                href={data.csvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Download Combined CSV
              </a>
            </div>
          </>
        )}

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
    </>
  );
}
