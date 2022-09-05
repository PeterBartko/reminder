import styles from '../../styles/modules/modal.module.scss'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addNewReminderToList, Reminder } from '../../redux/listsSlice'
import { BsFillClockFill, BsFlagFill } from 'react-icons/bs'
import { Switch } from '@headlessui/react'
import { Show } from '../List'
import { motion } from 'framer-motion'

interface Props {
  setShow: Dispatch<SetStateAction<Show>>
  listId: number
}

const NewReminder: React.FC<Props> = ({ setShow, listId }) => {
  const [values, setValues] = useState<Reminder>({
    id: Date.now(),
    listId,
    title: '',
    flag: false,
    completed: false,
  })
  const [flag, setFlag] = useState(false)
  const [deadline, setDeadline] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    setValues(v => ({ ...v, flag }))
  }, [flag])

  const close = () => {
    setShow(s => {
      if ('modal' in s) return { ...s, new: false, modal: false }
      else return { ...s, new: false }
    })
  }

  const addNew = () => {
    dispatch(addNewReminderToList({ listId, values }))
    close()
  }

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: 'anticipate', duration: 0.2 }}
      className={styles.bg}
      id="bg"
      onClick={(e: any) => {
        if (e.target.id === 'bg') close()
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ ease: 'anticipate', duration: 0.1 }}
        className={styles.modal}
      >
        <h2>New Reminder</h2>
        <div className={styles.inp_wrap}>
          <label htmlFor="title">Title:</label>
          <input
            autoFocus
            onInput={(e: any) => setValues(v => ({ ...v, title: e.target.value }))}
            id="title"
            type="text"
          />
        </div>
        <div className={styles.inp_wrap}>
          <label htmlFor="description">Desctiption:</label>
          <textarea
            id="description"
            onInput={(e: any) => setValues(v => ({ ...v, description: e.target.value }))}
          />
        </div>

        <div className={styles.swith_wrap}>
          <span>
            <div style={{ backgroundColor: 'orange' }}>
              <BsFlagFill color="white" />
            </div>
            <p>Flag</p>
            <Switch
              checked={flag}
              onChange={setFlag}
              className={styles.switch}
              style={{
                background: flag ? '#22c55e' : '#aaa',
              }}
            >
              <span className={styles.sr_only}>flag</span>
              <div aria-hidden="true" style={{ left: flag ? '21px' : '2px' }} />
            </Switch>
          </span>
          <span>
            <div style={{ backgroundColor: 'dodgerblue' }}>
              <BsFillClockFill color="white" />
            </div>
            <p>Time</p>
            <Switch
              checked={deadline}
              onChange={setDeadline}
              className={styles.switch}
              style={{
                background: deadline ? '#22c55e' : '#aaa',
              }}
            >
              <span className={styles.sr_only}>deadline</span>
              <div aria-hidden="true" style={{ left: deadline ? '21px' : '2px' }} />
            </Switch>
          </span>
        </div>

        {deadline && (
          <div className={styles.inp_wrap}>
            <input
              type="date"
              id=""
              onInput={(e: any) =>
                setValues(v => ({ ...v, deadline: { ...v.deadline!, date: e.target.value } }))
              }
            />
            <input
              type="time"
              id=""
              onInput={(e: any) =>
                setValues(v => ({ ...v, deadline: { ...v.deadline!, time: e.target.value } }))
              }
            />
          </div>
        )}

        <hr color="#eee" />

        <span className={styles.span_btns}>
          <button className={styles.btn} onClick={close}>
            Cancel
          </button>
          <button className={styles.btn} onClick={addNew} disabled={values.title === ''}>
            OK
          </button>
        </span>
      </motion.div>
    </motion.div>
  )
}

export default NewReminder
