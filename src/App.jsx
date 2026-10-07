import { useState, useEffect } from 'react'
import './App.css'
import ScheduleLayer from './components/ScheduleLayer'
import './components/ScheduleLayer.css'
import { useScheduleState, clearLocalCache } from './hooks/useScheduleState'
import { supabase, supabaseConfigured } from './lib/supabase'

function SetupNotice() {
  return (
    <div className="password-gate">
      <h1 className="gate-title">Crowknows</h1>
      <p className="gate-error">
        Supabase isn&rsquo;t configured. Set VITE_SUPABASE_URL and
        VITE_SUPABASE_PUBLISHABLE_KEY (see .env.local.example).
      </p>
    </div>
  )
}

function LoginGate() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (authError) {
      setError('Incorrect email or password')
      setPassword('')
    }
    setBusy(false)
  }

  return (
    <div className="password-gate">
      <h1 className="gate-title">Crowknows</h1>
      <form onSubmit={submit} className="gate-form">
        <input
          type="email"
          className={`gate-input${error ? ' gate-input--error' : ''}`}
          placeholder="Email"
          autoComplete="username"
          value={email}
          autoFocus
          onChange={e => { setEmail(e.target.value); setError('') }}
        />
        <input
          type="password"
          className={`gate-input${error ? ' gate-input--error' : ''}`}
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
        />
        {error && <p className="gate-error">{error}</p>}
        <button type="submit" className="gate-btn" disabled={busy}>
          {busy ? 'Signing in…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}

function Schedule({ userId }) {
  const { completedHabits, toggleHabit, stepCount, updateSteps } = useScheduleState(userId)

  async function signOut() {
    await supabase.auth.signOut()
    clearLocalCache()
  }

  return (
    <div className="khroknows-app">
      <ScheduleLayer
        completedHabits={completedHabits}
        onToggleHabit={toggleHabit}
        stepCount={stepCount}
        onStepUpdate={updateSteps}
      />
      <button type="button" className="signout-btn" onClick={signOut}>
        Sign out
      </button>
    </div>
  )
}

export default function App() {
  // undefined = still checking for a saved session, null = signed out
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!supabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!supabaseConfigured) return <SetupNotice />
  if (session === undefined) return null
  if (!session) return <LoginGate />
  return <Schedule userId={session.user.id} />
}
