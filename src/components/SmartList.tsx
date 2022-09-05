import { useEffect, useState } from 'react'
import styles from '../styles/modules/list.module.scss'
import Reminder from './Reminder'
import { RootState } from '../redux/store'
import { useSelector } from 'react-redux'
import { List as SmartList, Reminder as IReminder } from '../redux/listsSlice'
import { BiPlusCircle } from 'react-icons/bi'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import NewReminder from './modals/NewReminder'
import { Show } from './List'
import { AnimatePresence } from 'framer-motion'

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

const getReminder = (lists: SmartList[], id: number) => {
  switch (id) {
    case 0:
      return lists.map(({ reminders }) => reminders?.filter(r => isToday(r.deadline?.date))!).flat()
    case 1:
      return lists.map(({ reminders }) => reminders?.filter(r => r.deadline)!).flat()
    case 3:
      return lists.map(({ reminders }) => reminders?.filter(r => r.flag)!).flat()
  }
}

const SmartList: React.FC<Props> = ({ id }) => {
  const [show, setShow] = useState<Show>({ new: false, modal: false, completed: false })
  const [listId, setListId] = useState(-1)
  const [reminders, setReminders] = useState<IReminder[]>()
  const lists = useSelector((state: RootState) => state.lists)
  const [listRef] = useAutoAnimate<HTMLUListElement>({ duration: 200 })
  const { color, name } = template[id]

  useEffect(() => {
    setReminders(getReminder(lists, id))
  }, [id, lists])

  const handleAdd = (id: number) => {
    setShow(s => ({ ...s, modal: true }))
    setListId(id)
  }

  const renderReminders = () => {
    let rems = []
    if (id == 2) {
      rems = lists
        .filter(l => l.reminders?.length != 0 || show.new)
        .map(({ id: from, color, name, reminders }) => (
          <div key={from} className={styles.all_ul}>
            {reminders?.some(r => (show.completed ? r.completed : !r.completed)) && (
              <h3 style={{ color }}>{name}</h3>
            )}
            {reminders
              ?.filter(({ completed }) => (show.completed ? completed : !completed))
              .map(reminder => (
                <Reminder
                  key={reminder.id}
                  color={color}
                  listId={id}
                  reminder={reminder}
                  setReminders={setReminders}
                />
              ))}
            {show.new && (
              <button onClick={() => handleAdd(from)}>
                <BiPlusCircle color="#aaa" size={25} />
              </button>
            )}
          </div>
        ))
    } else {
      rems = reminders
        ?.filter(({ completed }) => completed == show.completed)
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
          {id == 2 && <button onClick={() => setShow(s => ({ ...s, new: !s.new }))}>+</button>}
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
        {/* {id != 2 && ( */}
        <button onClick={() => setShow(s => ({ ...s, completed: !s.completed }))} style={{ color }}>
          {show.completed ? 'Hide' : 'Show'}
        </button>
        {/* )} */}
      </span>

      <ul ref={listRef}>{renderReminders()}</ul>

      <AnimatePresence>
        {show.modal && <NewReminder setShow={setShow} listId={listId} />}
      </AnimatePresence>
    </div>
  )
}

export default SmartList
