// src/pages/index.js
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import PartitionView from '../components/PartitionView';
import TestCaseList from '../components/TestCaseList';
import SyntaxTestList from '../components/SyntaxTestList';
import StateTestList from '../components/StateTestList';
import XMLPreviewModal from '../components/XMLPreviewModal';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import StateSequenceList from '../components/StateSequenceList';
import Button from '../components/ui/button';
const SequenceDiagram = dynamic(
  () => import('../components/SequenceDiagram'),
  {
    ssr: false,
    loading: () => <p>Loading sequence diagram...</p>
  }
);
import { generateTestRun } from '../api/generate';
import { useToast } from '../components/ui/ToastProvider';
import { login, register } from '../api/auth';
import { BASE } from '../api/runs';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import FileInput from '../components/ui/FileInput';

const StateDiagram = dynamic(
  () => import('../components/StateDiagram'),
  {
    ssr: false,
    loading: () => <p>Loading diagram...</p>
  }
);

export default function Home() {
  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [xmlModal, setXmlModal] = useState({ open: false, title: '', content: '' });
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const formRef = useRef(null);
  const [pendingGenerate, setPendingGenerate] = useState(false);


  // File refs managed internally by FileInput; form submission reads via FormData

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsLoggedIn(true);
      setCurrentUser(username);
    }
  }, []);

  const openXmlModal = (title, content) => setXmlModal({ open: true, title, content });
  const closeXmlModal = () => setXmlModal(m => ({ ...m, open: false }));

  const handleLogin = async (username, password) => {
    const { success, token, error } = await login(username, password);
    if (success) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      setIsLoggedIn(true);
      setCurrentUser(username);
      setLoginOpen(false);
      if (pendingGenerate) {
        setPendingGenerate(false);
        toast.info('Signed in. Resuming generation…');
        setTimeout(() => {
          try { formRef.current?.requestSubmit?.(); } catch {}
        }, 50);
      }
    } else {
      toast.error(error || 'Could not sign in. Please try again.');
    }
  };

  const handleRegister = async (username, email, password) => {
    const { success, error } = await register(username, email, password);
    if (success) {
      toast.success('Account created. Please sign in.');
      setRegisterOpen(false);
    } else {
      toast.error(error || 'Could not create account.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setCurrentUser('');
  };

  const previewDict = (text) => openXmlModal('Data Dictionary Preview', text);
  const previewTree = (text) => openXmlModal('Decision Tree Preview', text);
  const previewState = (text) => openXmlModal('State Machine Preview', text);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isLoggedIn) {
      setPendingGenerate(true);
      setLoginOpen(true);
      return;
    }
    setLoading(true);
    const fd = new FormData(e.target);

    try {
      const json = await generateTestRun(fd);
      if (json.success) {
        const { nodes = [], links = [] } = json;
        const runId = json.runId;
        const combinedUrl = `${BASE}/api/runs/${runId}/csv`;
        const ecpUrl = `${BASE}/api/runs/${runId}/ecp-csv`;
        const syntaxUrl = `${BASE}/api/runs/${runId}/syntax-csv`;
        const stateUrl = `${BASE}/api/runs/${runId}/state-csv`;

        // Derive valid/invalid from stateTests if explicit arrays are not provided
        const allStateTests = Array.isArray(json.stateTests) ? json.stateTests : [];
        const derivedValid = Array.isArray(json.stateValid) && json.stateValid.length > 0
          ? json.stateValid
          : allStateTests.filter(t => String(t.type || '').toLowerCase() === 'valid');
        const derivedInvalid = Array.isArray(json.stateInvalid) && json.stateInvalid.length > 0
          ? json.stateInvalid
          : allStateTests.filter(t => String(t.type || '').toLowerCase() === 'invalid');

        setData({
          partitions: json.partitions,
          testCases: json.testCases,
          syntaxResults: json.syntaxResults,
          stateValid: derivedValid,
          stateInvalid: derivedInvalid,
          stateSequences: json.stateSequences || [],
          nodes,
          links,
          seqNodes: json.seqNodes || [],
          seqLinks: json.seqLinks || [],
          stateTreeNodes: json.stateTreeNodes || [],
          stateTreeLinks: json.stateTreeLinks || [],
          csvUrl: combinedUrl,
          ecpCsvUrl: ecpUrl,
          syntaxCsvUrl: syntaxUrl,
          stateCsvUrl: stateUrl
        });
      } else {
        toast.error("Couldn't generate tests. Check your XML files and try again.");
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header role="banner">
      <Navbar
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLoginOpen={() => setLoginOpen(true)}
        onRegisterOpen={() => setRegisterOpen(true)}
        onLogout={handleLogout}
      />
      </header>

      <main id="main" className="max-w-content mx-auto p-6 md:p-8 space-y-8">
        {/* <h1 className="text-2xl font-bold text-ink-900">Generate Tests</h1> */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white shadow rounded-lg p-6"
        >
          <FileInput
            label="Use Case Data Dictionary (XML)"
            name="dataDictionary"
            accept=".xml"
            required
            hint="Upload the Use Case Data Dictionary XML. You can submit just this file."
            onPreview={previewDict}
          />

          <FileInput
            label="Decision Tree (XML)"
            name="decisionTree"
            accept=".xml"
            hint="Optional: upload the decision tree XML file."
            onPreview={previewTree}
          />

          <FileInput
            label="State Machine (XML)"
            name="stateMachine"
            accept=".xml"
            hint="Optional: upload the state machine XML file."
            onPreview={previewState}
          />

          <div className="md:col-span-3 text-center">
            <Button type="submit" loading={loading} className="w-full md:w-auto">
              Generate Tests
            </Button>
          </div>
        </form>

        {data && (
          <>
            <section className="bg-white shadow rounded-lg p-6 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">Equivalence Class Partitions</h2>
              <PartitionView partitions={data.partitions} />
            </section>

            <section className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Equivalence Class Partitioning Test Cases</h2>
              <TestCaseList testCases={data.testCases} />
              <div className="mt-4 text-center">
                <Button as="a" href={data.ecpCsvUrl} target="_blank" rel="noopener noreferrer">
                  Download ECP CSV
                </Button>
              </div>
            </section>

            <section className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Syntax Test Cases</h2>
              <SyntaxTestList syntaxResults={data.syntaxResults} />
              <div className="mt-4 text-center">
                <Button as="a" href={data.syntaxCsvUrl} target="_blank" rel="noopener noreferrer">
                  Download Syntax CSV
                </Button>
              </div>
            </section>

            {(data.stateTreeNodes?.length > 0 || data.seqNodes?.length > 0 || data.nodes?.length > 0) && (
              <section className="bg-white shadow rounded-lg p-6 mt-8">
                <h2 className="text-lg font-semibold mb-4">
                  {data.stateTreeNodes?.length > 0
                    ? 'State Tree Diagram'
                    : data.seqNodes?.length > 0
                      ? 'State Sequence Tree'
                      : 'State Transition Diagram'}
                </h2>
                {data.stateTreeNodes?.length > 0 ? (
                  <SequenceDiagram nodes={data.stateTreeNodes} links={data.stateTreeLinks} />
                ) : data.seqNodes?.length > 0 ? (
                  <SequenceDiagram nodes={data.seqNodes} links={data.seqLinks} />
                ) : (
                  <StateDiagram nodes={data.nodes} links={data.links} />
                )}
              </section>
            )}

            {(data.stateValid?.length > 0 || data.stateInvalid?.length > 0) && (
              <section className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">State Transition Test Cases</h2>
                <StateTestList validTests={data.stateValid} invalidTests={data.stateInvalid} />
                {/* <h3 className="text-lg font-semibold mb-4">State Sequences</h3> */}
                <StateSequenceList sequences={data.stateSequences} />
                <div className="mt-4 text-center">
                  <Button as="a" href={data.stateCsvUrl} target="_blank" rel="noopener noreferrer">
                    Download State CSV
                  </Button>
                </div>
              </section>
            )}
            {/* Tree is shown above if available; no duplicate section here */}

            {/* {data.stateSequences?.length > 0 && (
              <section className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">State Sequences</h3>
                <StateSequenceList sequences={data.stateSequences} />
                <div className="mt-4 text-center">
                  <a
                    href={data.stateCsvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Download State CSV
                  </a>
                </div>
              </section>
            )} */}


            <div className="text-center mt-6">
              <Button as="a" href={data.csvUrl} target="_blank" rel="noopener noreferrer">
                Download Combined CSV
              </Button>
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
          onOpenRegister={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
          onForgot={() => {
            setLoginOpen(false);
            setForgotOpen(true);
          }}
        />


        <RegisterModal
          isOpen={registerOpen}
          onClose={() => setRegisterOpen(false)}
          onRegister={handleRegister}
          onOpenLogin={() => {
            setRegisterOpen(false)
            setLoginOpen(true)
          }}
        />

        <ForgotPasswordModal
          isOpen={forgotOpen}
          onClose={() => setForgotOpen(false)}
        />
      </main>
      <footer role="contentinfo" className="max-w-content mx-auto p-6 md:p-8"></footer>
    </>
  );
}
