import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styles from '../styles/modules/list.module.scss'
import { List } from '../redux/listsSlice'
import Reminder from './Reminder'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { AiOutlineSearch } from 'react-icons/ai'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface Props {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  mobile: boolean
}

const searchReminders = (lists: List[], search: string) => {
  return lists
    .map(l => ({
      ...l,
      reminders: l.reminders?.filter(
        r => r.title.toLowerCase().indexOf(search.toLowerCase()) != -1
      )!,
    }))
    .filter(l => l.reminders.length !== 0)
}

const SearchResults: React.FC<Props> = ({ search, mobile, setSearch }) => {
  const [reminders, setReminders] = useState<List[]>([])
  const [listRef] = useAutoAnimate<HTMLUListElement>({ duration: 200 })
  const lists = useSelector((state: RootState) => state.lists)

  useEffect(() => {
    setReminders(searchReminders(lists, search))
  }, [lists, search])

  const renderReminders = () => {
    const rems = reminders.map(({ id: from, color, name, reminders }) => (
      <div key={from} className={styles.all_ul}>
        <h3 style={{ color }}>{name}</h3>
        {reminders?.map(reminder => (
          <Reminder
            key={reminder.id}
            color={color}
            listId={from}
            reminder={reminder}
            setLists={setReminders}
          />
        ))}
      </div>
    ))
    return rems?.length == 0 ? <p className={styles.no_rem}>No Reminders</p> : rems
  }

  return (
    <div className={styles.container}>
      {mobile && (
        <div style={{ left: search != '' ? '6rem' : '1rem' }} className="search mobile-search">
          <AiOutlineSearch size={20} />
          <input
            autoFocus
            type="text"
            value={search}
            placeholder="Search"
            onInput={(e: any) => setSearch(e.target.value)}
          />
        </div>
      )}
      <header style={{ marginTop: '27.19px' }} className={styles.header}>
        <h1 style={{ color: 'black' }}>Results for &quot;{search}&quot;</h1>
        <div>
          <p style={{ color: 'black' }}>
            {reminders?.reduce((p, c) => p + c.reminders!.length, 0)}
          </p>
        </div>
      </header>

      <ul ref={listRef}>{renderReminders()}</ul>
    </div>
  )
}

export default SearchResults
