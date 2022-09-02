import styles from '../../styles/modules/modal.module.scss'
import { Dispatch, SetStateAction, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Reminder, upadteReminder } from '../../redux/listsSlice'

interface Props {
  setShowEdit: Dispatch<SetStateAction<boolean>>
  reminder: Reminder
}

const EditReminder: React.FC<Props> = ({ setShowEdit, reminder }) => {
  const { id, listId, title } = reminder
  const [values, setValues] = useState<Reminder>(reminder)

  const dispatch = useDispatch()

  const handleEdit = () => {
    dispatch(upadteReminder({ listId, values }))
    setShowEdit(false)
  }

  return (
    <div
      className={styles.bg}
      id="bg"
      onClick={(e: any) => {
        if (e.target.id === 'bg') setShowEdit(false)
      }}
    >
      <div className={styles.modal}>
        <h2 style={{ marginBottom: 0 }}>Edit &quot;{title}&quot;</h2>
        <h3 style={{ marginBottom: '1rem' }}>Created {new Date(id).toLocaleDateString('en-US')}</h3>
        <div className={styles.inp_wrap}>
          <label htmlFor="title">Title:</label>
          <input
            value={values.title}
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
            value={values.description}
            onInput={(e: any) => setValues(v => ({ ...v, description: e.target.value }))}
          />
        </div>

        <div className={styles.inp_wrap}>
          <input
            type="date"
            value={values.deadline?.date}
            onInput={(e: any) =>
              setValues(v => ({ ...v, deadline: { ...v.deadline!, date: e.target.value } }))
            }
          />
          <input
            type="time"
            onInput={(e: any) =>
              setValues(v => ({ ...v, deadline: { ...v.deadline!, time: e.target.value } }))
            }
          />
        </div>

        <hr color="#eee" />

        <span style={{ right: '5rem' }} className={styles.span_btns}>
          <button className={styles.btn} onClick={() => setShowEdit(false)}>
            Cancel
          </button>
          <button className={styles.btn} onClick={handleEdit} disabled={values.title === ''}>
            OK
          </button>
        </span>
      </div>
    </div>
  )
}

export default EditReminder
