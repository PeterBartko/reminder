import { Dispatch, SetStateAction, useState } from 'react'
import { AiOutlineSearch, AiOutlineEdit } from 'react-icons/ai'
import {
  BsCalendar,
  BsCalendarWeek,
  BsFillInboxFill,
  BsFlagFill,
  BsPlusCircle,
} from 'react-icons/bs'
import { IoList } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import NewList from './modals/NewList'
import EditList from './modals/EditList'
import styles from '../styles/modules/sidepanel.module.scss'
import { isToday } from './SmartList'

interface Props {
  setListIndex: Dispatch<SetStateAction<number>>
  listIndex: number
}

export interface Show {
  newList?: boolean
  editIcon?: boolean
  editModal?: boolean
}

const SidePanel: React.FC<Props> = ({ setListIndex, listIndex }) => {
  const [show, setShow] = useState<Show>({ newList: false, editIcon: false, editModal: false })
  const [editIndex, setEditIndex] = useState(0)
  const lists = useSelector((state: RootState) => state.lists)

  const hanldeEdit = (e: any, id: number) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    setShow(s => ({ ...s, editModal: true, editIcon: false }))
    setEditIndex(id)
  }

  const today = lists.reduce(
    (p, c) => p + c.reminders!?.reduce((t, r) => t + (isToday(r.deadline?.date) ? 1 : 0), 0),
    0
  )
  const sched = lists.reduce(
    (p, c) => p + c.reminders!?.reduce((t, r) => t + (r.deadline ? 1 : 0), 0),
    0
  )
  const all = lists.reduce((p, c) => p + c.reminders!?.length, 0)
  const flagged = lists.reduce(
    (p, c) => p + c.reminders!?.reduce((t, r) => t + (r.flag ? 1 : 0), 0),
    0
  )

  return (
    <section className={styles.side_menu}>
      <div className={styles.search}>
        <AiOutlineSearch size={20} color="black" />
        <input type="text" placeholder="Search" />
      </div>

      <nav className={styles.nav}>
        <div
          style={{ backgroundColor: listIndex == 0 ? 'dodgerblue' : '#0000002b' }}
          className={styles.nav_today}
          onClick={() => setListIndex(0)}
        >
          <span>
            <div
              style={{ backgroundColor: listIndex == 0 ? '#fff' : 'dodgerblue' }}
              className={styles.img}
            >
              <BsCalendar size={22} color={listIndex == 0 ? 'dodgerblue' : '#fff'} />
              <p style={{ color: listIndex == 0 ? 'dodgerblue' : '#fff' }}>
                {new Date().getDate()}
              </p>
            </div>
            <p style={{ color: listIndex == 0 ? '#fff' : 'initial' }}>{today}</p>
          </span>
          <h3 style={{ color: listIndex == 0 ? '#fff' : 'initial' }}>Today</h3>
        </div>

        <div
          style={{ backgroundColor: listIndex == 1 ? 'red' : '#0000002b' }}
          className={styles.nav_shched}
          onClick={() => setListIndex(1)}
        >
          <span>
            <div
              style={{ backgroundColor: listIndex == 1 ? '#fff' : 'red' }}
              className={styles.img}
            >
              <BsCalendarWeek size={22} color={listIndex == 1 ? 'red' : '#fff'} />
            </div>
            <p style={{ color: listIndex == 1 ? '#fff' : 'initial' }}>{sched}</p>
          </span>
          <h3 style={{ color: listIndex == 1 ? '#fff' : 'initial' }}>Scheduled</h3>
        </div>

        <div
          style={{ backgroundColor: listIndex == 2 ? 'gray' : '#0000002b' }}
          className={styles.nav_all}
          onClick={() => setListIndex(2)}
        >
          <span>
            <div
              style={{ backgroundColor: listIndex == 2 ? '#fff' : 'gray' }}
              className={styles.img}
            >
              <BsFillInboxFill size={22} color={listIndex == 2 ? 'gray' : '#fff'} />
            </div>
            <p style={{ color: listIndex == 2 ? '#fff' : 'initial' }}>{all}</p>
          </span>
          <h3 style={{ color: listIndex == 2 ? '#fff' : 'initial' }}>All</h3>
        </div>

        <div
          style={{ backgroundColor: listIndex == 3 ? 'orange' : '#0000002b' }}
          className={styles.nav_flag}
          onClick={() => setListIndex(3)}
        >
          <span>
            <div
              style={{ backgroundColor: listIndex == 3 ? '#fff' : 'orange' }}
              className={styles.img}
            >
              <BsFlagFill size={22} color={listIndex == 3 ? 'orange' : '#fff'} />
            </div>
            <p style={{ color: listIndex == 3 ? '#fff' : 'initial' }}>{flagged}</p>
          </span>
          <h3 style={{ color: listIndex == 3 ? '#fff' : 'initial' }}>Flagged</h3>
        </div>
      </nav>

      <ul className={styles.my_lists}>
        <h2>My Lists</h2>
        {lists?.map(({ id, color, name, reminders }) => (
          <li key={id} onClick={() => setListIndex(id)}>
            <span>
              {show.editIcon && (
                <AiOutlineEdit size={22} color={color} onClick={e => hanldeEdit(e, id)} />
              )}
              <div style={{ backgroundColor: color }}>
                <IoList size={22} color="white" />
              </div>
              <p>{name}</p>
            </span>
            <p>{reminders!.length}</p>
          </li>
        ))}
      </ul>

      <button className={styles.bottom_btn} onClick={() => setShow(s => ({ ...s, newList: true }))}>
        <BsPlusCircle size={18} />
        <p>Add List</p>
      </button>

      <button
        className={`${styles.bottom_btn} ${styles.edit}`}
        onClick={() => setShow(s => ({ ...s, editIcon: !s.editIcon }))}
      >
        <p>Edit</p>
      </button>

      {show.newList && <NewList setShow={setShow} setListIndex={setListIndex} />}
      {show.editModal && (
        <EditList setShow={setShow} list={lists.find(({ id }) => id == editIndex)!} />
      )}
    </section>
  )
}

export default SidePanel
