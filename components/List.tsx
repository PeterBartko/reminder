import { useState } from 'react'
import { BsFlagFill } from 'react-icons/bs'
import { ImInfo } from 'react-icons/im'
import { Switch } from '@headlessui/react'

import styles from '../styles/list.module.scss'
import { Reminder } from '../types/reminders'
import { List } from '../redux/listsSlice'

const List: React.FC<List> = ({ name, color, reminders }) => {
  const [showNew, setShowNew] = useState(false)
  const [newReminder, setNewReminder] = useState<Reminder | {}>({})
  const [enabled, setEnabled] = useState(false)

  const [rems, setRems] = useState([
    { id: 0, completed: false, title: 'Car into garage', tags: '22/07/2021, 09:00' },
    { id: 1, completed: false, title: 'Clean the dishwasher', tags: '01/08/2021, Monthly' },
  ])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 style={{ color }}>{name}</h1>
        <div>
          <button onClick={() => setShowNew(s => !s)}>+</button>
          <p style={{ color }}>{reminders?.length}</p>
        </div>
      </header>

      <span className={styles.h2}>
        <h2>0 Completed</h2>
        <button style={{ color }}>Show</button>
      </span>
      <ul>
        {reminders?.map(({ id, title }) => (
          <li key={id} className={styles.li}>
            <span>
              <button>
                <div></div>
              </button>
            </span>
            <div className={styles.wrap}>
              <p>{title}</p>
              {/* <p className={styles.tags}>{tags}</p> */}
            </div>
            <div className={styles.opts}>
              <button>
                <ImInfo color="blue" size={20} />
              </button>
              <button>
                <BsFlagFill color="orange" size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showNew && (
        <div className={styles.li}>
          <span>
            <button>
              <div></div>
            </button>
          </span>
          <div className={styles.wrap}>
            <input
              autoFocus
              onInput={(e: any) => setNewReminder(r => ({ ...r, title: e.target.value }))}
              onKeyDown={e => {
                if (e.code !== 'Enter') return
                // setRems(r => [...r, { id: Date.now(), title: newReminder.title }])
                setShowNew(false)
              }}
              type="text"
            />
          </div>
          <div className={styles.opts}>
            <button onClick={undefined}>
              <ImInfo color="blue" size={20} />
            </button>

            <div>
              <span></span>
              <p>flag</p>

              <Switch
                checked={enabled}
                onChange={setEnabled}
                className="switch"
                style={{
                  background: enabled ? '#aaa' : '#22c55e',
                }}
                //       className={`${enabled ? 'bg-[#aaa]' : 'bg-[#22c55e]'}
                // relative flex h-[40px] w-[74px] shrink-0 cursor-pointer rounded-full items-center`}
              >
                <span className="sr-only">flag</span>
                <div
                  aria-hidden="true"
                  style={{ left: enabled ? '4px' : '2.5rem' }}
                  //       className={`${enabled ? 'left-1' : 'left-[2.5rem]'}
                  // absolute pointer-events-none h-[30px] w-[30px] rounded-full bg-white shadow-lg transition-all duration-200`}
                />
              </Switch>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default List
