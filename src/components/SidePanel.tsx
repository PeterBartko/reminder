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
import { AnimatePresence } from 'framer-motion'
interface Props {
  setListIndex: Dispatch<SetStateAction<number>>
  setSearch: Dispatch<SetStateAction<string>>
  listIndex: number
  search: string
}

export interface Show {
  newList?: boolean
  editIcon?: boolean
  editModal?: boolean
}

const SidePanel: React.FC<Props> = ({ setListIndex, listIndex, setSearch, search }) => {
  const [show, setShow] = useState<Show>({ newList: false, editIcon: false, editModal: false })
  const [editIndex, setEditIndex] = useState(0)
  const lists = useSelector((state: RootState) => state.lists)

  const hanldeEdit = (e: any, id: number) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    setShow(s => ({ ...s, editModal: true, editIcon: false }))
    setEditIndex(id)
  }

  const navs = [
    {
      title: 'Today',
      count: lists.reduce(
        (p, c) =>
          p +
          c.reminders!?.reduce(
            (t, r) => t + (isToday(r.deadline?.date) && !r.completed ? 1 : 0),
            0
          ),
        0
      ),
      color: 'dodgerblue',
      icon: <BsCalendar size={22} />,
    },
    {
      title: 'Scheduled',
      count: lists.reduce(
        (p, c) => p + c.reminders!?.reduce((t, r) => t + (r.deadline && !r.completed ? 1 : 0), 0),
        0
      ),
      color: 'red',
      icon: <BsCalendarWeek size={22} />,
    },
    {
      title: 'All',
      count: lists.reduce(
        (p, c) => p + c.reminders!?.reduce((t, r) => t + (!r.completed ? 1 : 0), 0),
        0
      ),
      color: 'gray',
      icon: <BsFillInboxFill size={22} />,
    },
    {
      title: 'Flagged',
      count: lists.reduce(
        (p, c) => p + c.reminders!?.reduce((t, r) => t + (r.flag && !r.completed ? 1 : 0), 0),
        0
      ),
      color: 'orange',
      icon: <BsFlagFill size={22} />,
    },
  ]

  const setIndex = (id: number) => {
    setListIndex(id)
    setSearch('')
  }

  return (
    <section className={styles.side_menu}>
      <span className="search">
        <AiOutlineSearch size={20} />
        <input
          type="text"
          value={search}
          placeholder="Search"
          onInput={(e: any) => setSearch(e.target.value)}
        />
      </span>

      <nav className={styles.nav}>
        {navs.map(({ title, color, count, icon }, i) => (
          <button
            key={i}
            style={{ backgroundColor: listIndex == i && search == '' ? color : '#fff' }}
            onClick={() => setIndex(i)}
          >
            <span>
              <div
                style={{
                  backgroundColor: listIndex == i && search == '' ? '#fff' : color,
                  color: listIndex == i && search == '' ? color : '#fff',
                }}
                className={styles.img}
              >
                {icon}
                {i == 0 && (
                  <p style={{ color: listIndex == i && search == '' ? color : '#fff' }}>
                    {new Date().getDate()}
                  </p>
                )}
              </div>
              <p style={{ color: listIndex == i && search == '' ? '#fff' : '#444' }}>{count}</p>
            </span>
            <h3 style={{ color: listIndex == i && search == '' ? '#fff' : '#444' }}>{title}</h3>
          </button>
        ))}
      </nav>

      <h2 className={styles.my_lists_h2}>My Lists</h2>
      <ul className={styles.my_lists}>
        {lists?.map(({ id, color, name, reminders }) => (
          <li key={id} onClick={() => setIndex(id)}>
            <span>
              {show.editIcon && (
                <AiOutlineEdit size={22} color={color} onClick={e => hanldeEdit(e, id)} />
              )}
              <div style={{ backgroundColor: color }}>
                <IoList size={22} color=" white" />
              </div>
              <p>{name}</p>
            </span>
            <p>{reminders!.reduce((p, r) => p + (!r.completed ? 1 : 0), 0)}</p>
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

      <AnimatePresence>
        {show.newList && <NewList setShow={setShow} setListIndex={setListIndex} />}

        {show.editModal && (
          <EditList
            setShow={setShow}
            list={lists.find(({ id }) => id == editIndex)!}
            setListIndex={setListIndex}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default SidePanel
