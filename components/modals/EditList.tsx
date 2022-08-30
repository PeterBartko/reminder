import styles from '../../styles/modules/modal.module.scss'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteList, editList, List } from '../../redux/listsSlice'
import { Show } from '../SidePanel'

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
  list: List
}

const EditList: React.FC<Props> = ({ setShow, list }) => {
  const [values, setValues] = useState<List>(list)
  const [showDelDliaog, setShowDelDliaog] = useState(false)

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

  const handleEdit = () => {
    dispatch(editList(values))
    setShow(s => ({ ...s, editModal: false }))
  }

  const handleDelete = () => {
    dispatch(deleteList(values.id))
    setShow(s => ({ ...s, editModal: false }))
  }

  return (
    <div
      className={styles.bg}
      id="bg"
      onClick={(e: any) => {
        if (e.target.id === 'bg') setShow(s => ({ ...s, editModal: false }))
      }}
    >
      <div className={styles.modal}>
        <h2>
          Edit {values.name && '"'}
          <b style={{ color: values.color }}>{values.name}</b>
          {values.name && '"'}
        </h2>
        <div className={styles.inp_wrap}>
          <label htmlFor="name">Name:</label>
          <input
            autoFocus
            onInput={(e: any) => setValues(v => ({ ...v, name: e.target.value }))}
            value={values.name}
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

        {!showDelDliaog && (
          <button onClick={() => setShowDelDliaog(true)} className={styles.btn_del}>
            Delete
          </button>
        )}
        {showDelDliaog && (
          <span className={styles.span_del}>
            <button className={styles.btn} onClick={() => setShowDelDliaog(false)}>
              Cancel
            </button>
            <button className={styles.btn} style={{ color: 'red' }} onClick={handleDelete}>
              OK
            </button>
          </span>
        )}

        <span className={styles.span_btns}>
          <button className={styles.btn} onClick={() => setShow(s => ({ ...s, editModal: false }))}>
            Cancel
          </button>
          <button
            className={styles.btn}
            onClick={handleEdit}
            disabled={values.name === '' || values.color === ''}
          >
            OK
          </button>
        </span>
      </div>
    </div>
  )
}

export default EditList
