import { useState } from 'react'
import styles from '../styles/modules/list.module.scss'
import { List } from '../redux/listsSlice'
import NewReminder from './modals/NewReminder'
import Reminder from './Reminder'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const List: React.FC<List> = ({ id: listId, name, color, reminders }) => {
  const [showNew, setShowNew] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [noRems, setNoRems] = useState(false)
  const [listRef] = useAutoAnimate<HTMLUListElement>({ duration: 200 })

  const renderReminders = () => {
    const rems = reminders
      ?.filter(({ completed }) => completed == showCompleted)
      .map(reminder => (
        <Reminder key={reminder.id} reminder={reminder} listId={listId} color={color} />
      ))
    return rems?.length == 0 ? <p className={styles.no_rem}>No Reminders</p> : rems
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 style={{ color }}>{name}</h1>
        <div>
          <button onClick={() => setShowNew(true)}>+</button>
          <p style={{ color }}>{reminders?.reduce((p, c) => p + (c.completed ? 0 : 1), 0)}</p>
        </div>
      </header>

      <span className={styles.h2}>
        <h2>{reminders?.reduce((p, c) => p + (c.completed ? 1 : 0), 0)} Completed</h2>
        <button onClick={() => setShowCompleted(s => !s)} style={{ color }}>
          {showCompleted ? 'Hide' : 'Show'}
        </button>
      </span>

      <ul ref={listRef}>{renderReminders()}</ul>

      {showNew && <NewReminder setShowNew={setShowNew} listId={listId} />}
    </div>
  )
}

export default List
