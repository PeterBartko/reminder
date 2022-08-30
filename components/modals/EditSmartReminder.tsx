import styles from '../../styles/modules/modal.module.scss'
import { Dispatch, SetStateAction, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Reminder, syncChanges } from '../../redux/listsSlice'

interface Props {
  setShowEdit: Dispatch<SetStateAction<boolean>>
  reminder: Reminder
  setReminders: Dispatch<SetStateAction<Reminder[] | undefined>>
}

const EditSmartReminder: React.FC<Props> = ({ setShowEdit, reminder, setReminders }) => {
  const { id, listId, title } = reminder
  const [values, setValues] = useState<Reminder>(reminder)
  const [showDelDliaog, setShowDelDliaog] = useState(false)

  const dispatch = useDispatch()

  const handleEdit = () => {
    setReminders(l => l?.map(r => (r.id == id ? values : r)))
    dispatch(syncChanges(values))
    setShowEdit(false)
  }

  const handleDelete = () => {}

  return (
    <div
      className={styles.bg}
      id="bg"
      onClick={(e: any) => {
        if (e.target.id === 'bg') setShowEdit(false)
      }}
    >
      <div className={styles.modal}>
        <h2 style={{ marginBottom: 0 }}>Edit "{title}"</h2>
        <h3 style={{ marginBottom: '1rem' }}>Created {new Date(id).toLocaleDateString('en-US')}</h3>
        <div className={styles.inp_wrap}>
          <label htmlFor="name">Title:</label>
          <input
            autoFocus
            onInput={(e: any) => setValues(v => ({ ...v, title: e.target.value }))}
            id="name"
            type="text"
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

export default EditSmartReminder
