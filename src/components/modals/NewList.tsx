import styles from '../../styles/modules/modal.module.scss'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addNewList, List } from '../../redux/listsSlice'
import { Show } from '../SidePanel'
import { motion } from 'framer-motion'

const colors = [
  'red',
  'orange',
  'gold',
  'limegreen',
  'dodgerblue',
  'blue',
  'rebeccapurple',
  'crimson',
  'mediumorchid',
  'peru',
  'gray',
  'coral',
]

interface Props {
  setShow: Dispatch<SetStateAction<Show>>
  setListIndex: Dispatch<SetStateAction<number>>
}

const NewList: React.FC<Props> = ({ setShow, setListIndex }) => {
  const [values, setValues] = useState<List>({ name: '', color: '', id: Date.now(), reminders: [] })
  const liRefs = useRef([])
  const dispatch = useDispatch()

  useEffect(() => {
    liRefs.current = liRefs.current.slice(0, liRefs.current.length)
  }, [liRefs.current.length])

  const highlight = (li: HTMLLIElement, color: string) => {
    if (values.color !== '')
      liRefs.current.find(
        (l: HTMLLIElement) => l.style.borderColor === values.color
        // @ts-ignore
      )!.style.backgroundColor = values.color
    li.style.backgroundColor = 'white'
    setValues(v => ({ ...v, color }))
  }

  const addNew = () => {
    dispatch(addNewList(values))
    setShow(s => ({ ...s, newList: false }))
    setListIndex(values.id)
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
        if (e.target.id === 'bg') setShow(s => ({ ...s, newList: false }))
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ ease: 'anticipate', duration: 0.1 }}
        className={styles.modal}
      >
        <h2>
          New List {values.name && '"'}
          <b style={{ color: values.color }}>{values.name}</b>
          {values.name && '"'}
        </h2>
        <div className={styles.inp_wrap}>
          <label htmlFor="name">Name:</label>
          <input
            autoFocus
            onInput={(e: any) => setValues(v => ({ ...v, name: e.target.value }))}
            id="name"
            type="text"
          />
        </div>
        <div className={styles.inp_wrap}>
          <p>Colour:</p>
          <ul>
            {colors?.map((color, i) => (
              <li key={color}>
                <button
                  onClick={(e: any) => highlight(e.target, color)}
                  style={{
                    borderColor: color,
                    backgroundColor: values.color === color ? 'white' : color,
                  }}
                  // @ts-ignore
                  ref={el => (liRefs.current[i] = el)}
                ></button>
              </li>
            ))}
          </ul>
        </div>
        <hr color="#eee" />
        <span className={styles.span_btns}>
          <button className={styles.btn} onClick={() => setShow(s => ({ ...s, newList: false }))}>
            Cancel
          </button>
          <button
            className={styles.btn}
            onClick={addNew}
            disabled={values.name === '' || values.color === ''}
          >
            OK
          </button>
        </span>
      </motion.div>
    </motion.div>
  )
}

export default NewList
