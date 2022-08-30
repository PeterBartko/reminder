import styles from '../../styles/modules/modal.module.scss'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addNewReminderToList, Reminder } from '../../redux/listsSlice'
import { BsFillClockFill, BsFlagFill } from 'react-icons/bs'
import { Switch } from '@headlessui/react'

interface Props {
  setShowNew: Dispatch<SetStateAction<boolean>>
  listId: number
}

const NewReminder: React.FC<Props> = ({ setShowNew, listId }) => {
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

  const addNew = () => {
    dispatch(addNewReminderToList({ listId, values }))
    setShowNew(false)
  }

  return (
    <div
      className={styles.bg}
      id="bg"
      onClick={(e: any) => {
        if (e.target.id === 'bg') setShowNew(false)
      }}
    >
      <div className={styles.modal}>
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
          <button className={styles.btn} onClick={() => setShowNew(false)}>
            Cancel
          </button>
          <button className={styles.btn} onClick={addNew} disabled={values.title === ''}>
            OK
          </button>
        </span>
      </div>
    </div>
  )
}

export default NewReminder
