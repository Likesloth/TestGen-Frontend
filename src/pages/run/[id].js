// src/pages/run/[id].js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import PartitionView from '../../components/PartitionView'
import TestCaseList from '../../components/TestCaseList'
import SyntaxTestList from '../../components/SyntaxTestList'
import StateTestList from '../../components/StateTestList'
import dynamic from 'next/dynamic'

const StateDiagram = dynamic(
  () => import('../../components/StateDiagram'),
  { ssr: false }
)
const SequenceDiagram = dynamic(
  () => import('../../components/SequenceDiagram'),
  { ssr: false }
)

import Link from 'next/link'
import {
  getRun,
  downloadEcpCsv,
  downloadSyntaxCsv,
  downloadStateCsv,
  downloadCombinedExcel
} from '../../api/runs'

export default function RunDetail() {

  const router = useRouter()
  const { id } = router.query

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState('')

  const [loading, setLoading] = useState(true)
  const [partitions, setPartitions] = useState([])
  const [testCases, setTestCases] = useState([])
  const [syntaxResults, setSyntax] = useState([])
  const [ecpCsvUrl, setEcpCsvUrl] = useState('')
  const [synCsvUrl, setSynCsvUrl] = useState('')
  const [excelUrl, setExcelUrl] = useState('')

  // state tests & model
  const [stateValid, setStateValid] = useState([])
  const [stateInvalid, setStateInvalid] = useState([])
  const [nodes, setNodes] = useState([])
  const [links, setLinks] = useState([])
  const [seqNodes, setSeqNodes] = useState([])
  const [seqLinks, setSeqLinks] = useState([])
  const [treeNodes, setTreeNodes] = useState([])
  const [treeLinks, setTreeLinks] = useState([])
  const [stateCsvUrl, setStateCsvUrl] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    if (token && username) {
      setIsLoggedIn(true)
      setCurrentUser(username)
    } else {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    if (!id) return
    getRun(id)
      .then(json => {
        if (!json.success) throw new Error(json.error || 'Failed to load')
        // partitions, test cases, syntax
        setPartitions(json.partitions)
        setTestCases(json.testCases)
        setSyntax(json.syntaxResults)

        // CSV URLs
        setEcpCsvUrl(downloadEcpCsv(id))
        setSynCsvUrl(downloadSyntaxCsv(id))
        setExcelUrl(downloadCombinedExcel(id))
        setStateCsvUrl(downloadStateCsv(id))

        // state tests arrays
        setStateValid(json.stateValid)
        setStateInvalid(json.stateInvalid)

        // diagram model
        setNodes(json.nodes || [])
        setLinks(json.links || [])
        // sequence tree model (legacy)
        setSeqNodes(json.seqNodes || [])
        setSeqLinks(json.seqLinks || [])
        // new state tree model
        setTreeNodes(json.stateTreeNodes || [])
        setTreeLinks(json.stateTreeLinks || [])
      })
      .catch(err => {
        alert(err.message)
        router.push('/history')
      })
      .finally(() => setLoading(false))
  }, [id, router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/')
  }

  if (loading) {
    return <div className="p-6">Loading…</div>
  }

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLoginOpen={() => { }}
        onRegisterOpen={() => { }}
        onLogout={handleLogout}
      />

      <main className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Run Details</h2>
          <Link
            href="/history"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to History
          </Link>
        </div>

        {/* Partitions */}
        <section className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Partitions</h3>
          <PartitionView partitions={partitions} />
        </section>

        {/* ECP Test Cases */}
        <section className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">ECP Test Cases</h3>
          <TestCaseList testCases={testCases} />
          <div className="mt-4 text-center">
            <a
              href={ecpCsvUrl}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Download ECP CSV
            </a>
          </div>
        </section>

        {/* Syntax Test Cases */}
        <section className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Syntax Test Cases</h3>
          <SyntaxTestList syntaxResults={syntaxResults} />
          <div className="mt-4 text-center">
            <a
              href={synCsvUrl}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Download Syntax CSV
            </a>
          </div>
        </section>

        {/* State diagram area: prefer new state tree, then seq tree, else model */}
        {(treeNodes?.length > 0 || seqNodes?.length > 0 || nodes?.length > 0) && (
          <section className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {treeNodes?.length > 0
                ? 'State Tree'
                : seqNodes?.length > 0
                  ? 'State Sequence Tree'
                  : 'State Transition Diagram'}
            </h3>
            {treeNodes?.length > 0 ? (
              <SequenceDiagram nodes={treeNodes} links={treeLinks} />
            ) : seqNodes?.length > 0 ? (
              <SequenceDiagram nodes={seqNodes} links={seqLinks} />
            ) : (
              <StateDiagram nodes={nodes} links={links} />
            )}
          </section>
        )}


        {/* State Transition Tests */}
        {(stateValid.length > 0 || stateInvalid.length > 0) && (
          <section className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              State Transition Tests
            </h3>
            <StateTestList
              validTests={stateValid}
              invalidTests={stateInvalid}
            />
            <div className="mt-4 text-center">
              <a
                href={stateCsvUrl}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Download State CSV
              </a>
            </div>
          </section>
        )}

        {/* Combined Excel */}
        <div className="text-center">
          <a
            href={excelUrl}
            className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Download Combined Excel
          </a>
        </div>
      </main>
    </>
  )
}
