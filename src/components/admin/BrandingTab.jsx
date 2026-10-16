import { useState } from 'react'
import { Globe, Save } from 'lucide-react'
import { useTemplate } from '../../context/TemplateContext'
import { demoStore } from '../../data/demoStore'
export default function BrandingTab() {
  const { platform } = useTemplate()
  const [draft, setDraft] = useState(platform)
  const [saved, setSaved] = useState(false)
  return <div className="admin-tab-content"><div className="branding-panel glass"><div className="branding-header"><h3><Globe size={18} /> Identidade Visual</h3></div>
    <form className="branding-form" onSubmit={event => { event.preventDefault(); demoStore.setPlatform(draft); setSaved(true) }}>
      {[['name', 'Nome da plataforma'], ['headline', 'Título do destaque'], ['description', 'Descrição do destaque']].map(([key, label]) => <div className="form-group" key={key}><label htmlFor={key}>{label}</label><input id={key} value={draft[key]} required pattern=".*\S.*" onChange={event => { setDraft({ ...draft, [key]: event.target.value }); setSaved(false) }} /></div>)}
      <div className="form-footer"><button className="btn-primary" type="submit"><Save size={18} /> Aplicar na prévia</button></div>
      {saved && <p className="demo-notice" role="status">Identidade aplicada nesta sessão.</p>}
    </form>
  </div></div>
}
