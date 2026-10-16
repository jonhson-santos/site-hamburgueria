import { createContext, useContext, useSyncExternalStore } from 'react'
import { demoStore } from '../data/demoStore'
const TemplateContext = createContext(null)
export function TemplateProvider({ children }) {
  const data = useSyncExternalStore(demoStore.subscribe, demoStore.getSnapshot, demoStore.getSnapshot)
  return <TemplateContext.Provider value={data}>{children}</TemplateContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export const useTemplate = () => useContext(TemplateContext)
