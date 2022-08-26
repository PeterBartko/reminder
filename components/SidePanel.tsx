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

interface Props {
  setListIndex: Dispatch<SetStateAction<number>>
}

export interface Show {
  newList?: boolean
  editIcon?: boolean
  editModal?: boolean
}

const SidePanel: React.FC<Props> = ({ setListIndex }) => {
  const [show, setShow] = useState<Show>({ newList: false, editIcon: false, editModal: false })
  const lists = useSelector((state: RootState) => state.lists)
  const [editIndex, setEditIndex] = useState(0)

  const hanldeEdit = (e: any, id: number) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    setShow(s => ({ ...s, editModal: true, editIcon: false }))
    setEditIndex(id)
  }

  return (
    <section className={styles.side_menu}>
      <div className={styles.search}>
        <AiOutlineSearch size={20} color="black" />
        <input type="text" placeholder="Search" />
      </div>

      <nav className={styles.nav}>
        <div className={styles.nav_today} onClick={undefined}>
          <span>
            <div className={styles.img}>
              <BsCalendar size={22} />
              <p>{new Date().getDate()}</p>
            </div>
            <p>1</p>
          </span>
          <h3>Today</h3>
        </div>

        <div className={styles.nav_shched} onClick={undefined}>
          <span>
            <div className={styles.img}>
              <BsCalendarWeek size={22} />
            </div>
            <p>23</p>
          </span>
          <h3>Scheduled</h3>
        </div>

        <div className={styles.nav_all} onClick={undefined}>
          <span>
            <div className={styles.img}>
              <BsFillInboxFill size={22} />
            </div>
            <p>53</p>
          </span>
          <h3>All</h3>
        </div>

        <div className={styles.nav_flag} onClick={undefined}>
          <span>
            <div className={styles.img}>
              <BsFlagFill size={22} />
            </div>
            <p>2</p>
          </span>
          <h3>Flagged</h3>
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
