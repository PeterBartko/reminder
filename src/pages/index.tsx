import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import List from '../components/List'
import { RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setList } from '../redux/listsSlice'
import SidePanel from '../components/SidePanel'
import SmartList, { template } from '../components/SmartList'
import SearchResults from '../components/SearchResults'
import useMobile from '../hooks/useMobile'
import { IoChevronBack } from 'react-icons/io5'

const Home: NextPage = () => {
  const [listIndex, setListIndex] = useState(0)
  const [search, setSearch] = useState('')
  const [hide, setHide] = useState(false)

  const mobile = useMobile()

  const dispatch = useDispatch()
  const lists = useSelector((state: RootState) => state.lists)

  useEffect(() => {
    if (localStorage.lists !== undefined) dispatch(setList(JSON.parse(localStorage.lists)))
  }, [])

  useEffect(() => {
    setHide(true)
  }, [listIndex, search])

  const setFavicon = () => {
    if (search != '') return 'black'
    const color = lists.find(({ id }) => id == listIndex)
    return color ? color.color : template[listIndex].color
  }

  const setTitle = () => {
    if (search != '') return 'Search'
    const title = lists.find(({ id }) => id == listIndex)
    return title ? title.name : template[listIndex].name
  }

  const renderLists = () => {
    if (search !== '')
      return <SearchResults search={search} setSearch={setSearch} mobile={mobile} />
    return listIndex < 4 ? (
      <SmartList id={listIndex} />
    ) : (
      <List {...lists.find(({ id }) => id == listIndex)!} />
    )
  }

  return (
    <>
      <Head>
        <title>{setTitle()}</title>
        <meta
          name="description"
          content="Reminder app inspired by Apple, created by Peter Bartko"
        />
        <link rel="icon" href={`/favicons/${setFavicon()}.png`} />
      </Head>

      <main>
        {mobile ? (
          !hide ? (
            <SidePanel
              setListIndex={setListIndex}
              listIndex={listIndex}
              setSearch={setSearch}
              search={search}
            />
          ) : (
            <section className="right-view">
              <button
                onClick={() => {
                  setHide(false)
                  setSearch('')
                }}
              >
                <IoChevronBack size={20} />
                Back
              </button>
              {renderLists()}
            </section>
          )
        ) : (
          <>
            <SidePanel
              setListIndex={setListIndex}
              listIndex={listIndex}
              setSearch={setSearch}
              search={search}
            />
            <section className="right-view">{renderLists()}</section>
          </>
        )}
      </main>
    </>
  )
}

export default Home
