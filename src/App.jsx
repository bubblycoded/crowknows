import { useState } from 'react'
import './App.css'
import ScheduleLayer from './components/ScheduleLayer'
import './components/ScheduleLayer.css'
import { useScheduleState } from './hooks/useScheduleState'

const AUTH_KEY = 'crowknows_authed'
const PASSWORD = 'Jun3bug'

function PasswordGate({ onAuth }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (value === PASSWORD) {
      localStorage.setItem(AUTH_KEY, '1')
      onAuth()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className="password-gate">
      <h1 className="gate-title">Crowknows</h1>
      <form onSubmit={submit} className="gate-form">
        <input
          type="password"
          className={`gate-input${error ? ' gate-input--error' : ''}`}
          placeholder="Password"
          value={value}
          autoFocus
          onChange={e => { setValue(e.target.value); setError(false) }}
        />
        {error && <p className="gate-error">Incorrect password</p>}
        <button type="submit" className="gate-btn">Enter</button>
      </form>
    </div>
  )
}

function Schedule() {
  const { completedHabits, toggleHabit, stepCount, updateSteps } = useScheduleState()
  return (
    <div className="khroknows-app">
      <ScheduleLayer
        completedHabits={completedHabits}
        onToggleHabit={toggleHabit}
        stepCount={stepCount}
        onStepUpdate={updateSteps}
      />
    </div>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === '1')

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />
  return <Schedule />
}
