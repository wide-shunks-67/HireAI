import { useState } from 'react'
import api from './api/axios'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [page, setPage] = useState('login')
  const [form, setForm] = useState({ email: '', full_name: '', password: '' })
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    setError(''); setLoading(true)
    try {
      if (page === 'register') {
        await api.post('/auth/register', form)
        setPage('login')
        setError('Account created! Please login.')
      } else {
        const res = await api.post('/auth/login', {
          email: form.email, password: form.password
        })
        localStorage.setItem('token', res.data.access_token)
        setUser(form.email)
      }
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    }
    setLoading(false)
  }

  if (user) return <Dashboard user={user} onLogout={() => setUser(null)} />

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">HireAI</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          {page === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {page === 'login' ? 'Sign in to your account' : 'Start your AI career journey'}
        </p>

        {error && (
          <div className={`text-sm px-4 py-3 rounded-lg mb-4 ${
            error.includes('created')
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-600'
          }`}>{error}</div>
        )}

        <div className="flex flex-col gap-3">
          {page === 'register' && (
            <input name="full_name" placeholder="Full name"
              value={form.full_name} onChange={handle}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 transition"
            />
          )}
          <input name="email" placeholder="Email address" type="email"
            value={form.email} onChange={handle}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 transition"
          />
          <input name="password" placeholder="Password" type="password"
            value={form.password} onChange={handle}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 transition"
          />
        </div>

        <button onClick={submit} disabled={loading}
          className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl text-sm transition disabled:opacity-60">
          {loading ? 'Please wait...' : page === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          {page === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setPage(page === 'login' ? 'register' : 'login'); setError('') }}
            className="text-emerald-600 font-medium hover:underline">
            {page === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}