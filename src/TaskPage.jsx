import { Link } from 'react-router-dom'
import Task from './Task'

function TaskPage() {
  return (
    <section id="task-page">
      <Link to="/">&larr; Back home</Link>
      <Task />
    </section>
  )
}

export default TaskPage
