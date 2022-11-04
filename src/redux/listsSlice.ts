import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Reminder {
  id: number
  listId: number
  title: string
  description: string
  completed: boolean
  flag: boolean
  deadline: {
    date: string
    time: string
  }
}

export interface List {
  id: number
  name: string
  color: string
  reminders: Reminder[]
}

const initialState: List[] = [
  {
    id: 4,
    name: 'Reminders',
    color: 'orange',
    reminders: [
      {
        id: 0,
        listId: 4,
        title: 'New Reminder',
        description: '',
        completed: false,
        flag: true,
        deadline: {
          date: '',
          time: '',
        },
      },
    ],
  },
]

export const listSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setList: (state, { payload }: PayloadAction<List[]>) => {
      return payload
    },
    addNewList: (state: List[], { payload }: PayloadAction<List>) => {
      state.push({ ...payload, reminders: [] })
      localStorage.lists = JSON.stringify(state)
    },
    editList: (state: List[], { payload }: PayloadAction<List>) => {
      state[state.findIndex(({ id }) => id == payload.id)] = payload
      localStorage.lists = JSON.stringify(state)
    },
    deleteList: (state: List[], { payload }: PayloadAction<number>) => {
      const tmp = state.filter(({ id }) => id != payload)
      localStorage.lists = JSON.stringify(tmp)
      return tmp
    },

    addNewReminderToList: (
      state: List[],
      { payload }: PayloadAction<{ listId: number; values: Reminder }>
    ) => {
      state.find(({ id }) => payload.listId == id)!.reminders?.push(payload.values)
      localStorage.lists = JSON.stringify(state)
    },
    upadteReminder: (
      state: List[],
      { payload }: PayloadAction<{ listId: number; values: Reminder }>
    ) => {
      const { listId, values: reminder } = payload
      const tmp = state.map(l => {
        if (l.id == listId)
          return {
            ...l,
            reminders: l.reminders?.map(r => (r.id == reminder.id ? reminder : r)),
          }
        else return l
      })
      localStorage.lists = JSON.stringify(tmp)
      return tmp
    },
    deleteReminder: (state: List[], { payload }: PayloadAction<Reminder>) => {
      const { id, listId } = payload
      const tmp = state.map(l => {
        if (l.id == listId)
          return {
            ...l,
            reminders: l.reminders?.filter(r => r.id !== id),
          }
        else return l
      })
      localStorage.lists = JSON.stringify(tmp)
      return tmp
    },
    syncChanges: (state: List[], { payload }: PayloadAction<Reminder>) => {
      const { listId, id } = payload
      const list = state.find(l => l.id == listId)!
      list.reminders = list.reminders?.map(r => (r.id == id ? payload : r))
      localStorage.lists = JSON.stringify(state)
    },
    syncDelete: (state: List[], { payload }: PayloadAction<Reminder>) => {
      const { listId, id } = payload
      const list = state.find(l => l.id == listId)!
      list.reminders = list.reminders?.filter(r => r.id !== id)
      localStorage.lists = JSON.stringify(state)
    },
  },
})

export const getListState = (state: { lists: List[] }) => state.lists
export const {
  addNewList,
  setList,
  editList,
  deleteList,
  addNewReminderToList,
  upadteReminder,
  syncChanges,
  deleteReminder,
  syncDelete,
} = listSlice.actions

export default listSlice.reducer
