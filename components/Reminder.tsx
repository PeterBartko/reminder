import { Dispatch, SetStateAction, useState } from 'react'
import { BsFlagFill, BsTrash } from 'react-icons/bs'
import { ImInfo } from 'react-icons/im'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteReminder,
  Reminder,
  syncChanges,
  syncDelete,
  upadteReminder,
} from '../redux/listsSlice'
import { RootState } from '../redux/store'
import styles from '../styles/modules/list.module.scss'
import EditReminder from './modals/EditReminder'
import EditSmartReminder from './modals/EditSmartReminder'

interface Deadline {
  date: string
  time: string
}

interface From {
  color?: string
  name?: string
}

interface Props {
  reminder: Reminder
  color: string
  listId: number
  setReminders?: Dispatch<SetStateAction<Reminder[] | undefined>>
}

const Reminder: React.FC<Props> = ({ reminder, color, listId, setReminders }) => {
  const { id, listId: from, title, flag, deadline, description, completed } = reminder
  const [showEdit, setShowEdit] = useState(false)
  const dispatch = useDispatch()

  const fromTag: From = {}
  if (listId < 4) {
    const lists = useSelector((state: RootState) => state.lists)
    fromTag.color = lists.find(l => l.id == from)!.color
    fromTag.name = lists.find(l => l.id == from)!.name
  }

  // let bool = false
  const handleComplete = () => {
    // const int = setTimeout(() => {
    if (setReminders) {
      setReminders(old => old?.map(r => (r.id == id ? { ...r, completed: !r.completed } : r)))
      dispatch(syncChanges({ ...reminder, completed: !reminder.completed }))
    } else {
      const values = { ...reminder, completed: !reminder.completed }
      dispatch(upadteReminder({ listId, values }))
      // dispatch(updateSmartList(values))
    }
    // }, 2000)
    // if (bool) clearTimeout(int)
  }

  const handleFlag = () => {
    if (setReminders) {
      setReminders(old => old?.map(r => (r.id == id ? { ...r, flag: !r.flag } : r)))
      dispatch(syncChanges({ ...reminder, flag: !reminder.flag }))
    } else {
      const values = { ...reminder, flag: !reminder.flag }
      dispatch(upadteReminder({ listId, values }))
    }
  }

  const handleDelete = () => {
    if (setReminders) {
      setReminders(old => old?.filter(r => r.id !== id))
      dispatch(syncDelete(reminder))
    } else {
      dispatch(deleteReminder(reminder))
    }
  }

  const renderEdit = () => {
    if (showEdit && listId > 4)
      return <EditReminder setShowEdit={setShowEdit} reminder={reminder} />
    else if (showEdit && listId < 4 && setReminders)
      return (
        <EditSmartReminder
          reminder={reminder}
          setShowEdit={setShowEdit}
          setReminders={setReminders}
        />
      )
  }

  const formatTags = (deadline: Deadline | undefined) => {
    if (!deadline) return ''
    let date = deadline.date
    if (new Date(deadline.date).toDateString() === new Date(Date.now()).toDateString())
      date = 'Today'
    return `${date ? date : ''}${deadline.time ? (date ? ', ' : '') + deadline.time : ''}`
  }

  return (
    <li className={styles.li}>
      <span>
        <button onClick={handleComplete}>
          <svg height="20" width="20">
            <circle
              cx="10"
              cy="10"
              r="9"
              fill="none"
              stroke={completed ? color : '#aaa'}
              strokeWidth="2"
            />
            <circle cx="10" cy="10" r="6" fill={completed ? color : 'none'} />
          </svg>
        </button>
      </span>

      <div className={styles.wrap}>
        <p>{title}</p>
        <p className={styles.tags}>{description}</p>
        <span className={styles.tags}>
          {listId < 4 && listId != 2 && (
            <p style={{ color: fromTag.color }}>{fromTag.name + (deadline ? ' -' : '')}</p>
          )}
          <p>{formatTags(deadline)}</p>
        </span>
      </div>

      <div className={styles.opts}>
        <button className={styles.info} onClick={() => setShowEdit(true)}>
          <ImInfo color="blue" size={20} />
        </button>
        <button
          style={{ display: flag ? 'block' : 'none', opacity: flag ? 1 : 0.4 }}
          onClick={handleFlag}
          className={styles.flag}
        >
          <BsFlagFill color="orange" size={20} />
        </button>
        <button className={styles.delete} onClick={handleDelete}>
          <BsTrash color="red" size={20} />
        </button>
      </div>

      {renderEdit()}
    </li>
  )
}

export default Reminder
