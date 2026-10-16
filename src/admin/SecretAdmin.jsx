// Gatilho secreto: 5 cliques na marca + senha de admin. Leve: painel carrega sob demanda.
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { LockKeyhole, X } from 'lucide-react'
import { brasaStore, useBrasa } from '../store/brasaStore'
import './admin.css'

const Panel = lazy(() => import('./AdminPanel'))

export function useSecretUnlock(onUnlock) {
  const clicks = useRef([])
  return () => {
    const now = Date.now()
    clicks.current = [...clicks.current, now].filter(t => now - t < 2500)
    if (clicks.current.length >= 5) { clicks.current = []; onUnlock() }
  }
}

export default function SecretGate({ forceOpen, onCloseGate }) {
  const { settings } = useBrasa()
  const [stage, setStage] = useState('closed') // closed | login | panel
  const [pass, setPass] = useState('')
  const [err, setErr] = useState(false)

  useEffect(() => { if (forceOpen) setStage('login') }, [forceOpen])
  const close = () => { setStage('closed'); setPass(''); onCloseGate?.() }

  function tryLogin(e) {
    e?.preventDefault()
    if (pass === settings.adminPass) {
      sessionStorage.setItem('brasa-admin-ok', '1')
      setStage('panel'); setPass('')
    } else { setErr(true); setTimeout(() => setErr(false), 400) }
  }

  // sessão mantém aberto no refresh
  useEffect(() => {
    if (forceOpen && sessionStorage.getItem('brasa-admin-ok') === '1') setStage('panel')
  }, [forceOpen])

  if (stage === 'closed') return null

  if (stage === 'login') {
    return (
      <div className="bp-login" onClick={e => e.target === e.currentTarget && close()}>
        <form onSubmit={tryLogin} className={`bp-login-card ${err ? 'bp-shake' : ''}`}>
          <LockKeyhole size={26} color="#f58518" />
          <h2>BRASA<b>PRIME</b></h2>
          <p>Área restrita. Digite a senha de admin<br />para entrar no controle do monstro.</p>
          <input className="bp-input" type="password" autoFocus placeholder="Senha de admin" value={pass} onChange={e => setPass(e.target.value)} style={{ textAlign: 'center', marginBottom: 10 }} />
          <button className="bp-btn" style={{ width: '100%' }} type="submit">Entrar no painel</button>
          <button type="button" className="bp-btn ghost sm" style={{ width: '100%', marginTop: 8 }} onClick={close}><X size={13} /> Voltar ao site</button>
          <div className="bp-lock-hint">Padrão de fábrica: <b>brasa123</b> (troque em Loja → Senha)</div>
        </form>
      </div>
    )
  }

  return (
    <Suspense fallback={<div className="bp-login"><div className="bp-login-card">Carregando painel...</div></div>}>
      <Panel onClose={close} />
    </Suspense>
  )
}
