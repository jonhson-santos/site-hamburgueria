import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, User, LockKeyhole, Eye, EyeOff, Play, Pause } from 'lucide-react'
import { useTemplate } from '../context/TemplateContext'
import './Login.css'

export default function Login({ onEnter }) {
  const { platform } = useTemplate()
  const location = useLocation()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [showPassword, setShowPassword] = useState(false)
  const [help, setHelp] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [reduceMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  function enter(event) {
    event.preventDefault()
    if (!login.trim() || !password.trim()) return
    setPassword('')
    onEnter()
    const destination = location.state?.from
    navigate(destination?.startsWith('/') && !destination.startsWith('//') && !destination.startsWith('/login') ? destination : '/', { replace: true })
  }

  async function toggleVideo() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      try { await video.play() } catch { setVideoError(true) }
    } else video.pause()
  }

  return <main className="login-page">
    <header className="login-brand">{platform.name}</header>
    <div className="login-layout">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card-heading"><h1 id="login-title">Entrar</h1></div>
        <form className="login-form" onSubmit={enter}>
          <div className="login-field"><label htmlFor="login-user">Login</label><div className="login-input-wrap"><User size={19} aria-hidden="true" /><input id="login-user" name="username" autoComplete="off" placeholder="Seu login" value={login} onChange={event => setLogin(event.target.value)} required pattern=".*\S.*" /></div></div>
          <div className="login-field"><label htmlFor="login-password">Senha</label><div className="login-input-wrap"><LockKeyhole size={19} aria-hidden="true" /><input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="off" placeholder="Sua senha" value={password} onChange={event => setPassword(event.target.value)} required pattern=".*\S.*" /><button type="button" className="login-password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={showPassword}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></div>
          <button type="button" className="login-forgot" onClick={() => setHelp(!help)} aria-expanded={help}>Esqueci minha senha</button>
          {help && <p className="login-help" role="status">Nesta prévia, use qualquer login e senha fictícios. A recuperação será configurada com o acesso definitivo.</p>}
          <button type="submit" className="btn-primary login-submit">Entrar <ArrowRight size={20} /></button>
        </form>
        <p className="login-demo-note">Prévia do template. Use login e senha fictícios.</p>
      </section>
      <section className="login-media" aria-label="Vídeo de apresentação">
    <video className="login-background-video" ref={videoRef} autoPlay={!reduceMotion} muted loop playsInline preload="metadata" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setVideoError(true)}>
      <source src="/media/hero-video.mp4" type="video/mp4" />
    </video>
    <footer className="login-bottom">{!videoError ? <button className="login-video-toggle" onClick={toggleVideo}>{playing ? <Pause size={16} /> : <Play size={16} />}{playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}</button> : <span role="status">Vídeo de apresentação indisponível.</span>}</footer>
      </section>
    </div>

  </main>
}
