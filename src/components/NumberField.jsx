// Campo de valor bonito — substitui o input number com setinhas feias do navegador.
// Botões − / + laterais (SVG centralizado) + digitação livre com vírgula. Teclado numérico no mobile.
import { useState } from 'react'

function parseBR(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return null
  const n = parseFloat(s.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

export default function NumberField({ value, onChange, step = 1, min = 0, max = 99999, prefix = '', placeholder = '0,00', label = 'Alterar valor' }) {
  const [text, setText] = useState(null) // rascunho enquanto digita
  const shown = text ?? (value === '' || value == null ? '' : Number(value).toFixed(2).replace('.', ','))

  function commit(raw) {
    setText(null)
    const n = parseBR(raw)
    if (n == null) { onChange(''); return }
    onChange(+Math.max(min, Math.min(max, n)).toFixed(2))
  }
  function nudge(dir) {
    setText(null)
    const base = parseBR(value) ?? 0
    onChange(+Math.max(min, Math.min(max, base + dir * step)).toFixed(2))
  }

  return (
    <div className="bp-num">
      <button type="button" className="bp-num-btn" onClick={() => nudge(-1)} aria-label={`Diminuir ${label}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <line x1="2" y1="7" x2="12" y2="7" />
        </svg>
      </button>
      {prefix && <span className="bp-num-prefix">{prefix}</span>}
      <input
        className="bp-num-input" value={shown} placeholder={placeholder}
        inputMode="decimal" autoComplete="off"
        onChange={e => setText(e.target.value)}
        onBlur={e => commit(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
        aria-label={label}
      />
      <button type="button" className="bp-num-btn bp-num-plus" onClick={() => nudge(1)} aria-label={`Aumentar ${label}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <line x1="7" y1="2" x2="7" y2="12" />
          <line x1="2" y1="7" x2="12" y2="7" />
        </svg>
      </button>
    </div>
  )
}
