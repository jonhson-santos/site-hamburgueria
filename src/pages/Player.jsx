import { useEffect, useRef } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { demoStore } from '../data/demoStore'
import { useTemplate } from '../context/TemplateContext'
import { ArrowLeft, ArrowRight, CheckCircle, Download, FileText, ExternalLink, Play } from 'lucide-react'
import { getLessonLinkUrl } from '../utils/lessonLinks'
import { getTutorialVideo } from '../utils/tutorialVideo'
import './Player.css'

export default function Player() {
  const { id } = useParams()
  const { hash } = useLocation()
  const downloadsRef = useRef(null)
  const navigate = useNavigate()
  const data = useTemplate()
  const tutorial = data.lessons.find(item => item.id === id)
  const video = getTutorialVideo(tutorial?.video_url)
  const guide = data.modules.find(item => item.id === tutorial?.module_id)
  const modules = [...data.modules].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  const moduleSequence = modules.map(item => ({ module: item, tutorial: data.lessons.find(lesson => lesson.module_id === item.id) })).filter(item => item.tutorial)
  const currentIndex = moduleSequence.findIndex(item => item.tutorial.id === id)
  const isCompleted = data.completed.includes(id)
  const resources = (tutorial?.resources || []).filter(resource => getLessonLinkUrl(resource.url))
  const next = moduleSequence[currentIndex + 1]

  useEffect(() => {
    if (hash === '#downloads') downloadsRef.current?.scrollIntoView({ block: 'start' })
  }, [hash, id])

  if (!tutorial) return <div className="error-screen">Tutorial não encontrado. <Link to="/tutoriais">Ver tutoriais</Link></div>

  return <div className="player-page tutorial-page"><div className="player-container">
    <article className="video-section">
      <header className="video-header">
        <Link to={`/guia/${guide?.id}`} className="back-btn"><ArrowLeft size={20} /> {guide?.title}</Link>
        <span className="tutorial-label"><Play size={16} /> VIDEOAULA · TUTORIAL DE INSTALAÇÃO</span>
        <h1 className="current-lesson-title">{tutorial.title}</h1>
      </header>
      <section className="tutorial-video" aria-label="Vídeo tutorial">
        <div className="video-wrapper">
          {video?.type === 'embed' ? <iframe key={`${id}-${video.src}`} src={video.src} title={`Vídeo tutorial: ${tutorial.title}`} allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
            : video?.type === 'file' ? <video key={`${id}-${video.src}`} src={video.src} controls playsInline preload="metadata" aria-label={`Vídeo tutorial: ${tutorial.title}`}>
              Seu navegador não suporta este vídeo. <a href={video.src}>Abrir vídeo</a>
            </video>
            : <div className="video-placeholder"><Play size={48} /><h2>Video tutorial</h2><p>O vídeo de instalação será disponibilizado aqui.</p></div>}
        </div>
      </section>
      <section className="lesson-description tutorial-instructions" aria-labelledby="instructions-title">
        <h2 id="instructions-title">Instruções</h2>
        <p className="lesson-body-text">{tutorial.description || 'As instruções deste tutorial serão adicionadas em breve.'}</p>
      </section>
      <section className="lesson-resources tutorial-downloads" id="downloads" ref={downloadsRef} aria-labelledby="downloads-title">
        <h2 id="downloads-title"><Download size={22} /> Downloads</h2>
        <p className="downloads-intro">Use a descrição e os links abaixo para acessar o download deste mod.</p>
        {resources.length ? <ul className="lesson-resource-list">
          {resources.map(resource => <li key={resource.id} className="tutorial-download-card">
            <div className="download-file-heading"><FileText size={24} aria-hidden="true" /><h3>{resource.title || 'Arquivo para instalação'}</h3></div>
            {resource.description && <p className="download-file-description">{resource.description}</p>}
            <a href={getLessonLinkUrl(resource.url)} target="_blank" rel="noopener noreferrer" className="download-file-action">
              <Download size={18} /> Acessar download <ExternalLink size={16} /><span className="sr-only"> de {resource.title} (abre em uma nova aba)</span>
            </a>
          </li>)}
        </ul> : <p className="lesson-resources-empty">Os arquivos deste tutorial ainda não foram disponibilizados.</p>}
      </section>
      <footer className="tutorial-actions">
        <button className={`btn-complete ${isCompleted ? 'completed' : ''}`} onClick={() => demoStore.toggle('completed', id)}><CheckCircle size={20} />{isCompleted ? 'Etapas realizadas' : 'Marcar etapas como realizadas'}</button>
        {next && <button className="btn-next" onClick={() => navigate(`/tutorial/${next.tutorial.id}`)}>Próximo módulo <ArrowRight size={20} /></button>}
      </footer>
    </article>
    <aside className="player-sidebar">
      <div className="sidebar-header"><h3>Próximos módulos</h3><p>Sequência sincronizada dos tutoriais</p></div>
      <div className="sidebar-list">{moduleSequence.map((item, index) => <button key={item.tutorial.id} className={`sidebar-item ${item.tutorial.id === id ? 'active' : ''}`} aria-current={item.tutorial.id === id ? 'page' : undefined} onClick={() => navigate(`/tutorial/${item.tutorial.id}`)}>
        <span className="item-number">{index + 1}</span><span className="item-info"><span className="item-title tutorial-item-title">{item.module.title}</span><span className="item-duration">Tutorial + download</span></span>
        {item.tutorial.id === id && <ArrowRight size={16} className="active-icon" />}
      </button>)}</div>
    </aside>
  </div></div>
}
