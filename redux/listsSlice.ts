import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Reminder {
  id: number
  title: string
  completed: boolean
  deadline?: string
  flag: boolean
}

export interface List {
  id: number
  name: string
  color: string
  reminders?: Reminder[]
}

const initialState: List[] = [
  {
    id: 0,
    name: 'Reminders',
    color: 'orange',
    reminders: [{ id: 0, title: 'New Reminder', completed: false, flag: false }],
  },
]

export const listSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setList: (state: List[], { payload }: PayloadAction<List[]>) => {
      return payload
    },
    addNewList: (state: List[], { payload }: PayloadAction<List>) => {
      state.push({
        id: payload.id,
        name: payload.name,
        color: payload.color,
        reminders: [],
      })
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
  },
})

export const getListState = (state: { lists: List[] }) => state.lists
export const { addNewList, setList, editList, deleteList } = listSlice.actions

export default listSlice.reducer
