import { modules, lessons, tracks, platform } from './template.js'

// Dados voláteis para navegar pelo template. Nenhuma chamada de rede ou autenticação.
let state = { modules, lessons, tracks, platform, completed: [], favorites: [] }
const listeners = new Set()
const publish = (patch) => {
  state = { ...state, ...patch }
  listeners.forEach(listener => listener())
}
export const demoStore = {
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) },
  getSnapshot: () => state,
  list(table) {
    const rows = state[table] || []
    return rows.map(row => table === 'modules' ? { ...row, tracks: state.tracks.find(t => t.id === row.track_id) } : { ...row })
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  },
  save(table, value) {
    const record = { ...value, id: value.id || crypto.randomUUID() }
    delete record.tracks
    publish({ [table]: state[table].some(row => row.id === record.id)
      ? state[table].map(row => row.id === record.id ? record : row)
      : [...state[table], record] })
    return record
  },
  remove(table, id) {
    const patch = { [table]: state[table].filter(row => row.id !== id) }
    if (table === 'modules') {
      patch.lessons = state.lessons.filter(row => row.module_id !== id)
      patch.favorites = state.favorites.filter(value => value !== id)
      patch.completed = state.completed.filter(value => patch.lessons.some(row => row.id === value))
    }
    if (table === 'lessons') patch.completed = state.completed.filter(value => value !== id)
    publish(patch)
  },
  toggle(key, id) { publish({ [key]: state[key].includes(id) ? state[key].filter(value => value !== id) : [...state[key], id] }) },
  setPlatform(value) { publish({ platform: { ...state.platform, ...value } }) },
}
