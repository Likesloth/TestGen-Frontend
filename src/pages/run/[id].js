// src/pages/run/[id].js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import PartitionView from '../../components/PartitionView'
import TestCaseList from '../../components/TestCaseList'
import SyntaxTestList from '../../components/SyntaxTestList'
import StateTestList from '../../components/StateTestList'
import StateSequenceList from '../../components/StateSequenceList'
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
import Button from '../../components/ui/button'
import {
  getRun,
  downloadEcpCsv,
  downloadSyntaxCsv,
  downloadStateCsv,
  downloadCombinedExcel
} from '../../api/runs'
import { useAuth } from '../../context/AuthContext'

export default function RunDetail() {

  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()

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
  const [stateSequences, setStateSequences] = useState([])

  useEffect(() => {
    if (!auth.isLoggedIn) {
      router.push('/')
    }
  }, [router, auth.isLoggedIn])

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

        // state tests arrays (derive from stateTests if not present)
        const allStateTests = Array.isArray(json.stateTests) ? json.stateTests : []
        const derivedValid = Array.isArray(json.stateValid) && json.stateValid.length > 0
          ? json.stateValid
          : allStateTests.filter(t => String(t.type || '').toLowerCase() === 'valid')
        const derivedInvalid = Array.isArray(json.stateInvalid) && json.stateInvalid.length > 0
          ? json.stateInvalid
          : allStateTests.filter(t => String(t.type || '').toLowerCase() === 'invalid')
        setStateValid(derivedValid)
        setStateInvalid(derivedInvalid)

        // diagram model
        setNodes(json.nodes || [])
        setLinks(json.links || [])
        // sequence tree model (legacy)
        setSeqNodes(json.seqNodes || [])
        setSeqLinks(json.seqLinks || [])
        // new state tree model
        setTreeNodes(json.stateTreeNodes || [])
        setTreeLinks(json.stateTreeLinks || [])
        // state sequences
        setStateSequences(Array.isArray(json.stateSequences) ? json.stateSequences : [])
      })
      .catch(err => {
        alert(err.message)
        router.push('/history')
      })
      .finally(() => setLoading(false))
  }, [id, router])

  const handleLogout = () => {
    auth.logout()
    router.push('/')
  }

  if (loading) {
    return <div className="p-6">Loading…</div>
  }

  return (
    <>
      <header role="banner">
      <Navbar
        isLoggedIn={auth.isLoggedIn}
        currentUser={auth.user}
        onLoginOpen={() => { }}
        onRegisterOpen={() => { }}
        onLogout={handleLogout}
      />
      </header>

      <main id="main" className="max-w-content mx-auto p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-ink-900">Run Details</h1>
          <Link href="/history">
            <Button variant="secondary" as="span">Back to History</Button>
          </Link>
        </div>

        {/* Partitions */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Partitions</h2>
          <PartitionView partitions={partitions} />
        </section>

        {/* ECP Test Cases */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Equivalence Class Partitioning Test Cases</h2>
          <TestCaseList testCases={testCases} />
          <div className="mt-4 text-center">
            <Button as="a" href={ecpCsvUrl}>
              Download ECP CSV
            </Button>
          </div>
        </section>

        {/* Syntax Test Cases */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Syntax Test Cases</h2>
          <SyntaxTestList syntaxResults={syntaxResults} />
          <div className="mt-4 text-center">
            <Button as="a" href={synCsvUrl}>
              Download Syntax CSV
            </Button>
          </div>
        </section>

        {/* State diagram area: prefer new state tree, then seq tree, else model */}
        {(treeNodes?.length > 0 || seqNodes?.length > 0 || nodes?.length > 0) && (
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              {treeNodes?.length > 0
                ? 'State Tree Diagram'
                : seqNodes?.length > 0
                  ? 'State Sequence Tree'
                  : 'State Transition Diagram'}
            </h2>
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
            <h2 className="text-lg font-semibold mb-4">
              State Transition Test Cases
            </h2>
            <StateTestList
              validTests={stateValid}
              invalidTests={stateInvalid}
            />
            <div className="mt-4 text-center">
              <Button as="a" href={stateCsvUrl}>
                Download State CSV
              </Button>
            </div>
          </section>
        )}

        {/* State Sequences */}
        {stateSequences.length > 0 && (
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Sequences State Transitions Test Cases</h2>
            <StateSequenceList sequences={stateSequences} />
          </section>
        )}

        {/* Combined Excel */}
        <div className="text-center">
          <Button as="a" href={excelUrl} className="mt-4">
            Download Combined Excel
          </Button>
        </div>
      </main>
      <footer role="contentinfo" className="max-w-content mx-auto p-6 md:p-8"></footer>
    </>
  )
}
