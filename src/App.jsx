import './App.css'
import ScheduleLayer from './components/ScheduleLayer'
import './components/ScheduleLayer.css'
import { useScheduleState } from './hooks/useScheduleState'

function App() {
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

export default App
