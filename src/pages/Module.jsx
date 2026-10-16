
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTemplate } from '../context/TemplateContext'
import { Play, ArrowLeft, Download } from 'lucide-react'
import './Module.css'

const Module = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const data = useTemplate()
  const module = data.modules.find(item => item.id === id)
  const lessons = data.lessons.filter(item => item.module_id === id)
  const completed = lessons.filter(item => data.completed.includes(item.id)).length
  const track = data.tracks.find(item => item.id === module?.track_id)

  if (!module) return <div className="error-screen">Módulo não encontrado.</div>

  return (
    <div className="module-page">
      <header className="module-header">
        <div className="header-bg" ></div>
        <div className="header-overlay"></div>
        
        <div className="header-content container">
          <Link to="/" className="back-link"><ArrowLeft size={20} /> Voltar para o Início</Link>
          <div className="header-info">
            <span className="track-tag">{track?.name}</span>
            <h1 className="module-title">{module.title}</h1>
            <p className="module-subtitle">{module.subtitle}</p>
            <div className="module-meta">
              <span>Tutorial de instalação</span>
              <span className="separator">•</span>
              <span>Download na descrição</span>
            </div>
            <div className="progress-section">
              <div className="progress-text">{completed ? 'Tutorial consultado' : 'Tutorial ainda não consultado'}</div>
              <div className="progress-bar-large">
                <div className="progress-fill-large" style={{ width: `${lessons.length ? completed / lessons.length * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="module-main container">
        <section className="module-description">
          <div className="description-card glass">
            <h3>Sobre este mod</h3>
            <p>{module.description}</p>
            
            <div className="learning-list">
              <h4>Neste tutorial:</h4>
              <ul>
                {(module.objectives || []).map(text => <li key={text}>{text}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="lessons-list">
          <h3 className="list-title">Tutorial e download</h3>
          <div className="lessons-grid">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="lesson-item glass">
                <div className="lesson-number">{index + 1}</div>
                <div className="lesson-info">
                  <h4>{lesson.title}</h4>
                  <p><Download size={14} /> {lesson.resources?.length || 0} arquivos</p>
                </div>
                <div className="lesson-actions">
                  <button 
                    className="btn-play-small"
                    onClick={() => navigate(`/tutorial/${lesson.id}`)}
                  >
                    <Play size={18} /> Ver tutorial
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Module
