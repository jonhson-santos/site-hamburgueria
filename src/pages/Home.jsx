import { Link } from 'react-router-dom'
import { ArrowRight, Bookmark, LockKeyhole } from 'lucide-react'
import { useTemplate } from '../context/TemplateContext'
import { demoStore } from '../data/demoStore'
import './Home.css'
export default function Home({ view = 'home' }) {
  const { platform, modules, lessons, completed, favorites } = useTemplate()
  const firstModule = modules[0]
  const visible = view === 'favorites' ? modules.filter(mod => favorites.includes(mod.id)) : modules
  return <div className="home-dashboard">
    {view === 'home' && <section className="hero-banner"><div className="hero-overlay" /><div className="hero-info">
      <span className="hero-tag">FIFA MEMBERS CLUB</span><h2 className="hero-title">{platform.headline}</h2>
      {firstModule && <div className="hero-actions">
        <a className="btn-primary" href="#mods"><ArrowRight size={20} /> Ver Mods</a>
      </div>}
    </div></section>}
    <div id="mods" className={`rows-container ${view !== 'home' ? 'standalone-rows' : ''}`}>
      {view !== 'home' && <h1 className="container collection-title">{view === 'favorites' ? 'Favoritos' : 'Catalogo de mods'}</h1>}
      {visible.length > 0 && <section className="module-row mods-shelf">
        <div className="mods-shelf-title">
          <h3>Módulos</h3>
        </div>
        <div className="modules-grid">{visible.map(mod => {
          const moduleLessons = lessons.filter(lesson => lesson.module_id === mod.id)
          const tutorial = moduleLessons[0]
          const progress = tutorial && completed.includes(tutorial.id) ? 100 : 0
          const saved = favorites.includes(mod.id)
          return <article className="mod-card" key={mod.id}><div className="mod-poster-frame">
            <Link className={`mod-poster ${mod.cover_url ? 'has-cover-image' : ''}`} to={`/guia/${mod.id}`} aria-label={`Abrir ${mod.title}`}>
              {mod.cover_url && <img className="mod-poster-image" src={mod.cover_url} alt="" loading="lazy" />}
              {!mod.cover_url && <div className="mod-poster-placeholder"><span>Em breve</span><strong>{mod.title}</strong></div>}
            </Link>
            <button className={`favorite-toggle ${saved ? 'saved' : ''}`} aria-label={`${saved ? 'Remover' : 'Adicionar'} ${mod.title} ${saved ? 'dos' : 'aos'} favoritos`} aria-pressed={saved} onClick={() => demoStore.toggle('favorites', mod.id)}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /></button>
            {progress > 0 && <div className="progress-bar" aria-label={`${progress}% concluído`}><div className="progress-fill" style={{ width: `${progress}%` }} /></div>}
          </div>
            <div className="mod-card-info">
              <span className="cover-index">MÓDULO {String(mod.order_index).padStart(2, '0')}</span>
              <h4>{mod.title}</h4>
              <div className="cover-meta"><span><LockKeyhole size={15} /> Tutorial + download</span><Link className="cover-play" to={`/guia/${mod.id}`} aria-label={`Abrir ${mod.title}`}><ArrowRight size={18} /></Link></div>
            </div>
          </article>
        })}</div>
      </section>}
      {!visible.length && <div className="empty-state"><Bookmark size={32} /><p>{view === 'favorites' ? 'Salve módulos para encontrá-los aqui.' : 'Os novos módulos aparecerão aqui.'}</p><Link className="btn-secondary" to="/tutoriais">Explorar tutoriais</Link></div>}
    </div>
  </div>
}
