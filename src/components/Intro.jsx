import { useEffect, useRef, useState } from 'react'
import './Intro.css'

export default function Intro() {
  const [phase, setPhase] = useState('')
  const [gone, setGone] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true)
      return
    }
    document.body.style.overflow = 'hidden'
    const t = (ms, fn) => timers.current.push(setTimeout(fn, ms))
    // Mesma timeline do protótipo: desenha burger -> BRASA -> PRIME -> brilho -> saída
    t(250, () => setPhase('draw'))
    t(1080, () => setPhase('draw brand-brasa'))
    t(1520, () => setPhase('draw brand-brasa brand-prime'))
    t(2250, () => setPhase('draw brand-brasa brand-prime shine'))
    t(2950, () => setPhase('draw brand-brasa brand-prime shine exit'))
    t(4100, () => {
      setGone(true)
      document.body.style.overflow = ''
    })
    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
      document.body.style.overflow = ''
    }
  }, [])

  if (gone) return null

  return (
    <div className={`bp-intro ${phase}`} aria-hidden="true">
      <div className="bp-intro-content">
        <svg className="bp-intro-logo" viewBox="0 0 150 130" xmlns="http://www.w3.org/2000/svg">
          <path
            className="bp-intro-path p1"
            d="M27 50 C31 27 48 18 75 18 C102 18 119 27 123 50"
          />
          <path className="bp-intro-path p2" d="M25 61 H125" />
          <path
            className="bp-intro-path p3"
            d="M29 78 C38 69 43 85 52 77 C60 69 67 85 75 77 C84 69 91 85 100 77 C109 70 115 84 122 77"
          />
          <path
            className="bp-intro-path p4"
            d="M28 97 H122 C120 109 111 114 99 114 H51 C39 114 30 109 28 97 Z"
          />
        </svg>
        <div className="bp-intro-wordmark">
          <div className="bp-intro-main-mask">
            <span className="bp-intro-main">BRASA</span>
          </div>
          <div className="bp-intro-accent-mask">
            <span className="bp-intro-accent">PRIME</span>
          </div>
        </div>
        <div className="bp-intro-sub">BURGER</div>
      </div>
      <div className="bp-intro-sheen" />
    </div>
  )
}
