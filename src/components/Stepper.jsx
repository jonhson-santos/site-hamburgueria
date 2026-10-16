// Stepper compartilhado — mesmo +/− do carrinho, com tema claro (site) e escuro (admin).
// Ícones SVG sempre centralizados (sem glifo de texto torto).
export default function Stepper({ value, onMinus, onPlus, label, dark = false }) {
  return (
    <div className={`stepper${dark ? ' stepper-dark' : ''}`} role="group" aria-label={label}>
      <button
        type="button" className="stepper-action stepper-minus"
        onClick={onMinus} aria-label="Diminuir uma unidade"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <line x1="2" y1="7" x2="12" y2="7" />
        </svg>
      </button>
      <span className="stepper-count" aria-live="polite">{value}</span>
      <button
        type="button" className="stepper-action stepper-plus"
        onClick={onPlus} aria-label="Aumentar uma unidade"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <line x1="7" y1="2" x2="7" y2="12" />
          <line x1="2" y1="7" x2="12" y2="7" />
        </svg>
      </button>
    </div>
  )
}
