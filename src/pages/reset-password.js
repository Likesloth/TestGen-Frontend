// src/pages/reset-password.js
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { resetPassword } from '../api/auth'
import Navbar from '../components/Navbar'

export default function ResetPassword() {
  const router = useRouter()
  const { token } = router.query

  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) setError('')  // clear any stale error once token arrives
  }, [token])

  const handleSubmit = async e => {
    e.preventDefault()
    if (newPassword !== confirm) {
      setError("Passwords don't match")
      return
    }
    const json = await resetPassword(token, newPassword)
    if (json.success) {
      setMessage('Password reset! Redirecting to login…')
      setTimeout(() => router.push('/'), 2000)
    } else {
      setError(json.error || 'Something went wrong')
    }
  }

  if (!token) return <p>Loading…</p>

  return (
    <>
    <Navbar />
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-4">Reset your password</h1>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        {message && <div className="mb-4 text-sm text-green-600">{message}</div>}

        <label className="block mb-2 text-sm font-medium">New password</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
          required
        />

        <label className="block mb-2 text-sm font-medium">Confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full mb-6 px-3 py-2 border rounded focus:outline-none focus:ring"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reset Password
        </button>

        <p className="mt-4 text-center text-sm">
          Remembered your password?{' '}
          <Link href="/" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
    </>
  )
}
