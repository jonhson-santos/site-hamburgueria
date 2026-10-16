import React, { useState, useEffect } from 'react'
import { demoStore } from '../../data/demoStore'
import { getLessonLinkUrl } from '../../utils/lessonLinks'
import { getTutorialVideo } from '../../utils/tutorialVideo'
import { Plus, Edit2, Trash2, List, X, Save, FileText, BookOpen, Layers } from 'lucide-react'

const ModulesTab = () => {
  const [tracks, setTracks] = useState([])
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  const [editingModule, setEditingModule] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [selectedModuleForLessons, setSelectedModuleForLessons] = useState(null)
  const [lessons, setLessons] = useState([])
  const [editingLesson, setEditingLesson] = useState(null)
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)
  const [lessonError, setLessonError] = useState('')

  const fetchData = () => {
    setTracks(demoStore.list('tracks'))
    setModules(demoStore.list('modules'))
    setLoading(false)
  }
  useEffect(() => { const timer = setTimeout(fetchData, 0); return () => clearTimeout(timer) }, [])

  // === MÓDULOS ===
  const openModuleModal = (mod = null) => {
    if (mod) {
      setEditingModule(mod)
    } else {
      setEditingModule({ 
        title: '', 
        subtitle: '', 
        description: '', 
        cover_url: '', 
        track_id: tracks[0]?.id || '', 
        order_index: (modules.length + 1) 
      })
    }
    setIsModalOpen(true)
  }

  const saveModule = async () => {
    if (!editingModule.title.trim()) { alert('Informe o título do módulo.'); return }
    demoStore.save('modules', editingModule)
    setIsModalOpen(false)
    fetchData()
  }

  const deleteModule = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir o módulo e o tutorial?')) return
    demoStore.remove('modules', id)
    fetchData()
  }

  // === AULAS ===
  const openLessonsModal = async (mod) => {
    setSelectedModuleForLessons(mod)
    const data = demoStore.list('lessons').filter(lesson => lesson.module_id === mod.id)
    setLessons(data || [])
  }

  const closeLessonsModal = () => {
    setSelectedModuleForLessons(null)
    setLessons([])
  }

  const openLessonEdit = (lesson = null) => {
    setLessonError('')
    if (lesson) {
      setEditingLesson(lesson)
    } else {
      setEditingLesson({ 
        title: '', 
        description: '', 
        resources: [],
        video_url: '',
        order_index: (lessons.length + 1), 
        module_id: selectedModuleForLessons.id 
      })
    }
    setIsLessonModalOpen(true)
  }

  const saveLesson = async () => {
    if (!editingLesson.title.trim()) { setLessonError('Informe o título do tutorial.'); return }
    const videoUrl = (editingLesson.video_url || '').trim()
    if (videoUrl && !getTutorialVideo(videoUrl)) {
      setLessonError('Informe um link válido do YouTube, Vimeo ou de um arquivo de vídeo .mp4, .webm ou .ogg.')
      return
    }
    const resources = (editingLesson.resources || []).filter(resource => resource.title.trim() || resource.url.trim() || resource.description?.trim())
    for (const [index, resource] of resources.entries()) {
      if (!resource.title.trim() || !resource.description?.trim() || !getLessonLinkUrl(resource.url)) {
        setLessonError(`Preencha o nome, a descrição e um endereço completo (https://...) no arquivo ${index + 1}.`)
        return
      }
    }
    demoStore.save('lessons', {
      ...editingLesson,
      video_url: videoUrl,
      resources: resources.map(resource => ({ ...resource, title: resource.title.trim(), description: resource.description.trim(), url: getLessonLinkUrl(resource.url) })),
    })
    setIsLessonModalOpen(false)
    openLessonsModal(selectedModuleForLessons)
  }

  const deleteLesson = async (id) => {
    if (!window.confirm('Excluir este tutorial?')) return
    demoStore.remove('lessons', id)
    openLessonsModal(selectedModuleForLessons)
  }

  if (loading) return <div className="tab-loading">Carregando conteúdo...</div>

  return (
    <div className="admin-tab-content">
      <div className="content-header batcave-sub-header">
        <button className="btn-primary-batcave" onClick={() => openModuleModal()}>
          + NOVO MÓDULO
        </button>
      </div>

      <div className="admin-grid">
        {modules.map(mod => {
          const trackName = tracks.find(track => track.id === mod.track_id)?.name || 'Módulo'
          return <div key={mod.id} className="admin-module-card glass">
            <div className="card-media">
              {mod.cover_url ? <img src={mod.cover_url} alt="" /> : <div className="template-cover"><BookOpen size={32} /><span>MÓDULO {mod.order_index}</span></div>}
              <div className="card-badge">MÓDULO</div>
            </div>
            <div className="card-info">
              <div className="card-track">{trackName}</div>
              <h4>{mod.order_index}. {mod.title}</h4>
            </div>
            <div className="card-actions">
              <button className="btn-action-main" onClick={() => openLessonsModal(mod)}>
                <FileText size={16} /> Tutorial + download
              </button>
              <div className="btn-group">
                <button className="btn-icon-sm" onClick={() => openModuleModal(mod)}><Edit2 size={16} /></button>
                <button className="btn-icon-sm delete" onClick={() => deleteModule(mod.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        })}
      </div>

      {/* Modal Módulo */}
      {isModalOpen && (
        <div className="admin-modal">
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}></div>
          <div className="modal-content glass fade-in">
            <div className="modal-header">
              <h3>{editingModule.id ? 'Editar módulo' : 'Novo módulo'}</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="admin-form">
              <div className="form-group">
                <label>Título</label>
                <input type="text" value={editingModule.title} onChange={e => setEditingModule({...editingModule, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Subtítulo</label>
                <input type="text" value={editingModule.subtitle || ''} onChange={e => setEditingModule({...editingModule, subtitle: e.target.value})} />
              </div>
              <div className="form-group">
                <label htmlFor="guide-description">Descrição do módulo</label>
                <textarea id="guide-description" rows="3" value={editingModule.description || ''} onChange={event => setEditingModule({ ...editingModule, description: event.target.value })} />
              </div>
              <div className="form-group">
                <label>URL da capa</label>
                <input type="text" placeholder="https://..." value={editingModule.cover_url} onChange={e => setEditingModule({...editingModule, cover_url: e.target.value})} />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Seção</label>
                  <select value={editingModule.track_id} onChange={e => setEditingModule({...editingModule, track_id: e.target.value})}>
                    {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ordem</label>
                  <input type="number" value={editingModule.order_index} onChange={e => setEditingModule({...editingModule, order_index: parseInt(e.target.value)})} />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="btn-primary" onClick={saveModule}><Save size={18} /> Salvar módulo</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lista de Aulas */}
      {selectedModuleForLessons && !isLessonModalOpen && (
        <div className="admin-modal">
          <div className="modal-overlay" onClick={closeLessonsModal}></div>
          <div className="modal-content glass wide fade-in">
            <div className="modal-header">
              <div>
                <h3>Tutorial + download</h3>
                <p className="subtitle">{selectedModuleForLessons.title}</p>
              </div>
              <button className="btn-close" onClick={closeLessonsModal}><X size={24} /></button>
            </div>
            
            <div className="modal-body">
              <button className="btn-primary" style={{marginBottom: '1.5rem'}} onClick={() => openLessonEdit()}>
                <Plus size={18} /> Adicionar tutorial
              </button>

              <div className="admin-lesson-list">
                {lessons.map(lsn => (
                  <div key={lsn.id} className="lesson-item-admin slight">
                    <div className="lesson-meta">
                      <span className="lesson-order">#{lsn.order_index}</span>
                      <div className="lesson-info">
                        <h4>{lsn.title}</h4>
                        <p>{lsn.resources?.length || 0} arquivos para download</p>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="btn-icon-sm" onClick={() => openLessonEdit(lsn)}><Edit2 size={16} /></button>
                      <button className="btn-icon-sm delete" onClick={() => deleteLesson(lsn.id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {lessons.length === 0 && (
                  <div className="empty-state">
                    <p>Nenhum tutorial neste módulo.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Aula CRUD */}
      {isLessonModalOpen && (
        <div className="admin-modal lesson-edit-modal">
          <div className="modal-overlay" onClick={() => setIsLessonModalOpen(false)}></div>
          <div className="modal-content glass fade-in">
            <div className="modal-header">
              <h3>{editingLesson.id ? 'Editar Tutorial' : 'Novo Tutorial'}</h3>
              <button className="btn-close" onClick={() => setIsLessonModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="admin-form">
              <div className="form-group">
                <label>Título do Tutorial</label>
                <input type="text" value={editingLesson.title || ''} onChange={e => setEditingLesson({...editingLesson, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label htmlFor="tutorial-video-url">Link do vídeo tutorial</label>
                <input id="tutorial-video-url" type="url" placeholder="https://www.youtube.com/watch?v=..." value={editingLesson.video_url || ''} onChange={event => setEditingLesson({ ...editingLesson, video_url: event.target.value })} />
                <p className="lesson-field-hint">YouTube, Vimeo ou link direto de vídeo (.mp4, .webm ou .ogg). O vídeo aparece acima da descrição e dos downloads.</p>
              </div>
              <div className="form-group">
                <label htmlFor="lesson-description">Instruções do tutorial</label>
                <textarea id="lesson-description" rows="6" placeholder="Descreva os requisitos e o passo a passo de instalação..." value={editingLesson.description || ''} onChange={e => setEditingLesson({...editingLesson, description: e.target.value})}></textarea>
                <p className="lesson-field-hint">As quebras de linha serão mantidas na página do tutorial.</p>
              </div>
              <div className="lesson-links-editor">
                <h4>Arquivos para download</h4>
                <p className="lesson-field-hint">Cadastre o endereço do arquivo ou da página de download e explique o que a pessoa precisa baixar.</p>
                {(editingLesson.resources || []).map((resource, index) => (
                  <div className="lesson-link-editor" key={resource.id}>
                    <div className="form-group">
                      <label htmlFor={`resource-title-${resource.id}`}>Nome do arquivo {index + 1}</label>
                      <input id={`resource-title-${resource.id}`} type="text" placeholder="Ex.: Instalador para Windows" value={resource.title} onChange={event => setEditingLesson({ ...editingLesson, resources: editingLesson.resources.map(item => item.id === resource.id ? { ...item, title: event.target.value } : item) })} />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`resource-description-${resource.id}`}>Descrição do arquivo</label>
                      <textarea id={`resource-description-${resource.id}`} rows="3" placeholder="Explique para que serve, qual versão baixar e como usar este arquivo." value={resource.description || ''} onChange={event => setEditingLesson({ ...editingLesson, resources: editingLesson.resources.map(item => item.id === resource.id ? { ...item, description: event.target.value } : item) })} />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`resource-url-${resource.id}`}>Link para baixar</label>
                      <input id={`resource-url-${resource.id}`} type="url" placeholder="https://..." value={resource.url} onChange={event => setEditingLesson({ ...editingLesson, resources: editingLesson.resources.map(item => item.id === resource.id ? { ...item, url: event.target.value } : item) })} />
                    </div>
                    <button type="button" className="btn-secondary" aria-label={`Remover arquivo ${index + 1}`} onClick={() => setEditingLesson({ ...editingLesson, resources: editingLesson.resources.filter(item => item.id !== resource.id) })}><Trash2 size={16} /> Remover arquivo</button>
                  </div>
                ))}
                <button type="button" className="btn-secondary" onClick={() => setEditingLesson({ ...editingLesson, resources: [...(editingLesson.resources || []), { id: crypto.randomUUID(), title: '', description: '', url: '' }] })}><Plus size={18} /> Adicionar arquivo</button>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ordem</label>
                  <input type="number" value={editingLesson.order_index || 1} onChange={e => setEditingLesson({...editingLesson, order_index: parseInt(e.target.value)})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {lessonError && <p className="lesson-save-error" role="alert">{lessonError}</p>}
              <button className="btn-secondary" onClick={() => setIsLessonModalOpen(false)}>Cancelar</button>
              <button className="btn-primary" onClick={saveLesson}><Save size={18} /> Salvar Tutorial</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModulesTab
