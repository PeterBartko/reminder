import { useState } from 'react'
import styles from '../styles/modules/list.module.scss'
import { List } from '../redux/listsSlice'
import NewReminder from './modals/NewReminder'
import Reminder from './Reminder'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { AnimatePresence } from 'framer-motion'

export interface Show {
  new: boolean
  completed: boolean
  modal?: boolean
}

const List: React.FC<List> = ({ id: listId, name, color, reminders }) => {
  const [show, setShow] = useState<Show>({ completed: false, new: false })
  const [listRef] = useAutoAnimate<HTMLUListElement>({ duration: 200 })

  const renderReminders = () => {
    const rems = reminders
      ?.filter(({ completed }) => completed == show.completed)
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
          <button onClick={() => setShow(s => ({ ...s, new: true }))}>+</button>
          <p style={{ color }}>{reminders?.reduce((p, c) => p + (c.completed ? 0 : 1), 0)}</p>
        </div>
      </header>

      <span className={styles.h2}>
        <h2>{reminders?.reduce((p, c) => p + (c.completed ? 1 : 0), 0)} Completed</h2>
        <button onClick={() => setShow(s => ({ ...s, completed: !s.completed }))} style={{ color }}>
          {show.completed ? 'Hide' : 'Show'}
        </button>
      </span>

      <ul ref={listRef}>{renderReminders()}</ul>

      <AnimatePresence>
        {show.new && <NewReminder setShow={setShow} listId={listId} />}
      </AnimatePresence>
    </div>
  )
}

export default List
