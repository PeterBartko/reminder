import { useEffect, useState } from 'react'
import styles from '../styles/modules/list.module.scss'
import Reminder from './Reminder'
import { RootState } from '../redux/store'
import { useSelector } from 'react-redux'
import { List, Reminder as IReminder } from '../redux/listsSlice'
import { BiPlusCircle } from 'react-icons/bi'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface Props {
  id: number
}

export const template = [
  {
    name: 'Today',
    color: 'dodgerblue',
  },
  {
    name: 'Scheduled',
    color: 'red',
  },
  {
    name: 'All',
    color: 'gray',
  },
  {
    name: 'Flagged',
    color: 'orange',
  },
]

export const isToday = (date: string | undefined) => {
  if (!date) return false
  return new Date(date).toDateString() === new Date(Date.now()).toDateString()
}

const getReminder = (lists: List[], id: number) => {
  switch (id) {
    case 0:
      return lists.map(({ reminders }) => reminders?.filter(r => isToday(r.deadline?.date))!).flat()
    case 1:
      return lists.map(({ reminders }) => reminders?.filter(r => r.deadline)!).flat()
    case 3:
      return lists.map(({ reminders }) => reminders?.filter(r => r.flag)!).flat()
  }
}

const List: React.FC<Props> = ({ id }) => {
  const [showNew, setShowNew] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [reminders, setReminders] = useState<IReminder[]>()
  const lists = useSelector((state: RootState) => state.lists)
  const [listRef] = useAutoAnimate<HTMLUListElement>({ duration: 200 })
  const { color, name } = template[id]

  useEffect(() => {
    setReminders(getReminder(lists, id))
  }, [id, lists])

  const renderReminders = () => {
    let rems = []
    if (id == 2) {
      rems = lists
        .filter(l => l.reminders?.length != 0 || showNew)
        .map(({ id: from, color, name, reminders }) => (
          <div key={from} className={styles.all_ul}>
            <h3 style={{ color }}>{name}</h3>
            {reminders?.map(reminder => (
              <Reminder
                key={reminder.id}
                color={color}
                listId={id}
                reminder={reminder}
                setReminders={setReminders}
              />
            ))}
            {showNew && (
              <button>
                <BiPlusCircle color="#aaa" size={25} />
              </button>
            )}
          </div>
        ))
    } else {
      rems = reminders
        ?.filter(({ completed }) => completed == showCompleted)
        .map(reminder => (
          <Reminder
            key={reminder.id}
            reminder={reminder}
            listId={id}
            color={color}
            setReminders={setReminders}
          />
        ))!
    }
    return rems?.length == 0 ? <p className={styles.no_rem}>No Reminders</p> : rems
  }

  return (
    <div className={styles.container}>
      <header style={{ marginTop: id != 2 ? '27.19px' : 0 }} className={styles.header}>
        <h1 style={{ color }}>{name}</h1>
        <div>
          {id == 2 && <button onClick={() => setShowNew(s => !s)}>+</button>}
          <p style={{ color }}>
            {id != 2
              ? reminders?.reduce((p, c) => p + (c.completed ? 0 : 1), 0)
              : lists.reduce((p, c) => p + c.reminders!?.length, 0)}
          </p>
        </div>
      </header>

      <span className={styles.h2}>
        <h2>
          {id != 2
            ? reminders?.reduce((p, c) => p + (c.completed ? 1 : 0), 0)
            : lists.reduce(
                (t, l) => t + l.reminders!.reduce((p, r) => p + (r.completed ? 1 : 0), 0),
                0
              )}{' '}
          Completed
        </h2>
        {id != 2 && (
          <button onClick={() => setShowCompleted(s => !s)} style={{ color }}>
            {showCompleted ? 'Hide' : 'Show'}
          </button>
        )}
      </span>

      <ul ref={listRef}>{renderReminders()}</ul>
    </div>
  )
}

export default List
