import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { brasaStore, useBrasa, money } from './store/brasaStore'
import SecretGate, { useSecretUnlock } from './admin/SecretAdmin'
import Stepper from './components/Stepper'
import Intro from './components/Intro'

function Logo({ onClick }) {
  return (
    <a className="brand" href="#inicio" onClick={onClick} aria-label="Brasa Prime início">
      <span>BRASA<span className="brand-prime">PRIME</span></span>
      <small>BURGER & BRASA</small>
    </a>
  )
}

function ProductPhoto({ product }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className="product-card-image" loading="lazy" />
  }
  if (product.photo !== undefined) {
    return (
      <div
        className={`product-photo photo-${product.photo}${String(product.id).startsWith('combo-') ? ' combo-photo' : ''}`}
        role="img" aria-label={`Hambúrguer ${product.name}`}
      />
    )
  }
  return null
}

function DiscountBadge({ product }) {
  if (product.oldPrice && product.oldPrice > product.price) {
    const pct = Math.round((1 - product.price / product.oldPrice) * 100)
    return <span className="promo-badge">-{pct}%</span>
  }
  return null
}

function ProductCard({ product, onAdd, isCombo = false, onClickPhoto }) {
  const out = product.available === false
  return (
    <article className={`product-card ${isCombo ? 'combo-card' : ''} ${out ? 'is-out' : ''} ${onClickPhoto ? 'clickable-card' : ''}`}>
      <div onClick={onClickPhoto} style={{ cursor: onClickPhoto ? 'pointer' : 'default', position: 'relative' }}>
        <ProductPhoto product={product} />
        <DiscountBadge product={product} />
        {out && <span className="out-badge">Indisponível</span>}
      </div>
      <div className="product-content">
        <h3 onClick={onClickPhoto} style={{ cursor: onClickPhoto ? 'pointer' : 'default' }}>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>
            {product.oldPrice && product.oldPrice > product.price && (
              <small className="old-price">{money(product.oldPrice)}</small>
            )}
            {money(product.price)}
          </strong>
          <button
            className="add-button" disabled={out}
            onClick={(e) => { e.stopPropagation(); onAdd(product) }}
            aria-label={`Adicionar ${product.name} ao pedido`}
          >
            {!out && (
              <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <line x1="7" y1="2" x2="7" y2="12" />
                <line x1="2" y1="7" x2="12" y2="7" />
              </svg>
            )}
            {out ? 'Esgotado' : 'Adicionar'}
          </button>
        </div>
      </div>
    </article>
  )
}

function SvgIcon({ name, className = '' }) {
  if (name === 'search') {
    return (
      <svg className={`svg-icon ${className}`} width="19" height="19" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    )
  }
  if (name === 'cart') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    )
  }
  if (name === 'grid') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      </svg>
    )
  }
  if (name === 'burger') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11a8 8 0 0 1 16 0H4z" />
        <path d="M4 14h16" />
        <path d="M3 17.5c1 0 1.5.5 2.5.5s1.5-.5 2.5-.5 1.5.5 2.5.5 1.5-.5 2.5-.5 1.5.5 2.5.5 1.5-.5 2.5-.5 1.5.5 2.5.5 1.5-.5 2.5-.5" />
        <path d="M5 20h14a2 2 0 0 1 2 2H3a2 2 0 0 1 2-2z" />
      </svg>
    )
  }
  if (name === 'combos') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8h4l-1.5 13h-4.5" />
        <path d="M17.5 8V4l-2-2" />
        <path d="M3 13a5 5 0 0 1 10 0H3z" />
        <path d="M3 16h10" />
        <path d="M4 19h8a2 2 0 0 1 2 2H2a2 2 0 0 1 2-2z" />
      </svg>
    )
  }
  if (name === 'fries') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 11l2 11h10l2-11H5z" />
        <path d="M8 11V4" />
        <path d="M12 11V2" />
        <path d="M16 11V5" />
        <path d="M10 11V6" />
        <path d="M14 11V4" />
      </svg>
    )
  }
  if (name === 'cup') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8l1.5 13a2 2 0 0 0 2 1.8h5a2 2 0 0 0 2-1.8L18 8H6z" />
        <path d="M5 8h14" />
        <path d="M12 8V3l4-1" />
      </svg>
    )
  }
  if (name === 'dessert') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 11l1.5 10a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1L18 11H6z" />
        <path d="M6 11a3 3 0 0 1 6-1 3 3 0 0 1 6 1" />
        <circle cx="12" cy="5" r="2" fill="currentColor" />
      </svg>
    )
  }
  if (name === 'heart') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  }
  if (name === 'heart-filled') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#d46416" stroke="#d46416" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  }
  if (name === 'tag' || name === 'bag') {
    return (
      <svg className={`svg-icon ${className}`} width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    )
  }
  if (name === 'star') {
    return (
      <svg className={`svg-icon ${className}`} width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
  if (name === 'leaf') {
    return (
      <svg className={`svg-icon ${className}`} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 4 13C4 6 12 3 20 3c0 8-3 16-9 17Z" />
        <path d="M11 20v-7" />
        <path d="M8 10l3 3" />
      </svg>
    )
  }
  if (name === 'flame') {
    return (
      <svg className={`svg-icon ${className}`} width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#f58518" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c.5 3-1.5 5-2.5 7.5S9 12.5 10 14c.5-1.5 1.5-2.5 3-3 0 3 2 4.5 2 7a6 6 0 1 1-12 0c0-4 4-6.5 5.5-9.5C9.5 7 11.5 5 12 2z" />
      </svg>
    )
  }
  if (name === 'chef-hat') {
    return (
      <svg className={`svg-icon ${className}`} width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#f58518" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 13.8a4.5 4.5 0 1 1 2-8.5 5 5 0 0 1 8 0 4.5 4.5 0 1 1 2 8.5" />
        <path d="M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" />
        <line x1="6" y1="17" x2="18" y2="17" />
      </svg>
    )
  }
  if (name === 'info-circle') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    )
  }
  if (name === 'whatsapp') {
    return (
      <svg className={`svg-icon svg-whatsapp ${className}`} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    )
  }
  if (name === 'ifood') {
    return (
      <svg className={`svg-icon svg-ifood ${className}`} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
        <path d="M8.428 1.67c-4.65 0-7.184 4.149-7.184 6.998 0 2.294 2.2 3.299 4.25 3.299l-.006-.006c4.244 0 7.184-3.854 7.184-6.998 0-2.29-2.175-3.293-4.244-3.293zm11.328 0c-4.65 0-7.184 4.149-7.184 6.998 0 2.294 2.2 3.299 4.25 3.299l-.006-.006C21.061 11.96 24 8.107 24 4.963c0-2.29-2.18-3.293-4.244-3.293zM14.172 14.52l2.435 1.834c-2.17 2.07-6.124 3.525-9.353 3.17A8.913 8.913 0 01.23 14.541H0a9.598 9.598 0 008.828 7.758c3.814.24 7.323-.905 9.947-3.13l-.004.007 1.08 2.988 1.555-7.623-7.234-.02Z" />
      </svg>
    )
  }
  if (name === 'instagram') {
    return (
      <svg className={`svg-icon ${className}`} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    )
  }
  if (name === 'facebook') {
    return (
      <svg className={`svg-icon ${className}`} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
      </svg>
    )
  }
  if (name === 'tiktok') {
    return (
      <svg className={`svg-icon ${className}`} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    )
  }
  if (name === 'pin') {
    return (
      <svg className={`svg-icon ${className}`} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg className={`svg-icon ${className}`} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    )
  }
  if (name === 'trash') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    )
  }
  if (name === 'expand') {
    return (
      <svg className={`svg-icon ${className}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    )
  }
  return null
}

const categoryPillList = [
  { id: 'Todos', label: 'Todos', icon: 'grid' },
  { id: 'Hambúrgueres', label: 'Hambúrgueres', icon: 'burger' },
  { id: 'Combos', label: 'Combos', icon: 'combos' },
  { id: 'Porções', label: 'Porções', icon: 'fries' },
  { id: 'Bebidas', label: 'Bebidas', icon: 'cup' },
  { id: 'Sobremesas', label: 'Sobremesas', icon: 'dessert' },
]

function CardapioSection({
  products,
  menuFilter,
  setMenuFilter,
  onAdd,
  favorites,
  toggleFavorite,
  id = 'cardapio',
  showBackButton = false,
  onBack,
}) {
  const filtered = useMemo(() => {
    return products.filter(p => menuFilter === 'Todos' || p.menuCategory === menuFilter)
  }, [products, menuFilter])

  return (
    <section
      className="cardapio-section cardapio-view-enter"
      id={id}
    >
      <div className="container"
      >
        {/* Top Eyebrow */}
        <div className="cardapio-eyebrow-row">
          <span className="cardapio-eyebrow">NOSSO CARDÁPIO</span>
          <div className="cardapio-eyebrow-line" />
        </div>

        {/* Header with Title and Decorative Elements */}
        <div className="cardapio-header-top">
          <div className="cardapio-title-col">
            <h2 className="cardapio-display-title">Cardápio completo</h2>
            <p className="cardapio-subtitle">
              Hambúrgueres na brasa, combos, porções, bebidas e sobremesas.<br />
              Tudo feito com ingredientes selecionados e muito sabor.
            </p>
          </div>

          <div className="cardapio-decor-col">
            {/* Rotating circular seal with flame SVG in center */}
            <div className="circular-seal" aria-hidden="true">
              <svg viewBox="0 0 120 120" className="circular-seal-svg">
                <path
                  id="sealCirclePath"
                  d="M 60, 60 m -43, 0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
                  fill="none"
                />
                <text className="circular-seal-text">
                  <textPath href="#sealCirclePath" startOffset="0%">
                    BURGER &amp; BRASA · SABOR SEM IGUAL ·
                  </textPath>
                </text>
              </svg>
              <div className="circular-seal-flame">
                <SvgIcon name="flame" />
              </div>
            </div>

            {/* Handwritten script with flourish curve */}
            <div className="cardapio-calligraphy">
              <span>Pão macio · Brasa forte</span>
              <span>Sabor sem igual.</span>
              <svg className="calligraphy-swash" viewBox="0 0 140 20" fill="none" aria-hidden="true">
                <path d="M5 8 C 45 18, 95 18, 135 4" stroke="#8b522b" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Pills Navigation - 100% SVG, NO EMOJIS */}
        <nav className="cardapio-categories-nav" aria-label="Categorias do cardápio">
          {categoryPillList.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill ${menuFilter === cat.id ? 'active' : ''}`}
              onClick={() => setMenuFilter(cat.id)}
              aria-pressed={menuFilter === cat.id}
            >
              <SvgIcon name={cat.icon} />
              <span>{cat.label}</span>
            </button>
          ))}
          {showBackButton && (
            <button
              type="button"
              className="cat-pill cat-pill-back"
              onClick={onBack}
              style={{ marginLeft: 'auto' }}
            >
              <span>Voltar ao início</span>
            </button>
          )}
        </nav>

        {/* 4-Columns Product Cards Grid */}
        <div className="cardapio-grid" key={menuFilter}>
            {filtered.map((product, index) => {
              const out = product.available === false
              const isCombo = product.menuCategory === 'Combos' || String(product.id).startsWith('combo-')
              return (
                <article
                  key={product.id}
                  style={{ animationDelay: `${Math.min(index * 0.055, 0.44)}s` }}
                  className={`cardapio-card cardapio-card-enter is-revealed ${isCombo ? 'cardapio-combo-card' : ''} ${out ? 'is-out' : ''}`}
                >
                <div className="cardapio-card-img-wrap">
                  {product.badge && (
                    <span className={`cardapio-badge ${product.badgeClass || (isCombo ? 'badge-combo' : 'badge-orange')}`}>
                      <SvgIcon name={product.badgeIcon || 'tag'} />
                      <span>{product.badge}</span>
                    </span>
                  )}
                  {out && <span className="cardapio-out-badge">Indisponível</span>}
                  <button
                    type="button"
                    className={`cardapio-fav-btn ${favorites[product.id] ? 'is-fav' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id) }}
                    aria-label={`Favoritar ${product.name}`}
                  >
                    <SvgIcon name={favorites[product.id] ? 'heart-filled' : 'heart'} />
                  </button>
                  <img
                    src={product.image || '/media/burgers.jpg'}
                    alt={product.name}
                    className="cardapio-card-img"
                    loading="lazy"
                  />
                </div>

                <div className="cardapio-card-body">
                  <h3 className="cardapio-card-title">{product.name}</h3>
                  <p className="cardapio-card-desc">{product.description}</p>

                  <div className="cardapio-card-footer">
                    <div className="cardapio-card-price">
                      {product.oldPrice && product.oldPrice > product.price && (
                        <small className="cardapio-old-price">{money(product.oldPrice)}</small>
                      )}
                      <span>{money(product.price)}</span>
                    </div>
                    <button
                      type="button"
                      className="cardapio-card-add-btn"
                      disabled={out}
                      onClick={() => onAdd(product)}
                      aria-label={`Adicionar ${product.name} ao pedido`}
                    >
                      <SvgIcon name="cart" />
                      <span>{out ? 'Esgotado' : 'Adicionar'}</span>
                    </button>
                  </div>
                </div>
                </article>
              )
            })}
        </div>

        {/* Bottom Benefits Bar with Pure SVGs */}
        <div className="cardapio-features-bar">
          <div className="cardapio-feature-item">
            <div className="feature-icon">
              <SvgIcon name="leaf" />
            </div>
            <div className="feature-text">
              <strong>INGREDIENTES SELECIONADOS</strong>
              <span>Qualidade em cada detalhe</span>
            </div>
          </div>

          <div className="cardapio-feature-item">
            <div className="feature-icon">
              <SvgIcon name="flame" />
            </div>
            <div className="feature-text">
              <strong>HAMBÚRGUERES NA BRASA</strong>
              <span>Sabor defumado de verdade</span>
            </div>
          </div>

          <div className="cardapio-feature-item">
            <div className="feature-icon">
              <SvgIcon name="chef-hat" />
            </div>
            <div className="feature-text">
              <strong>RECEITAS EXCLUSIVAS</strong>
              <span>Criadas pela nossa casa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PaymentMark({ name }) {
  const norm = name.toLowerCase()
  if (norm === 'pix') {
    return (
      <svg className="payment-mark payment-mark-pix" viewBox="0 0 74 24" width="74" height="24" role="img" aria-label="Pix">
        {/* Símbolo Oficial do Pix (Banco Central do Brasil) */}
        <g fill="#32BCAD">
          <path d="M5.283 18.36a3.505 3.505 0 0 0 2.493-1.032l3.6-3.6a.684.684 0 0 1 .946 0l3.613 3.613a3.504 3.504 0 0 0 2.493 1.032h.71l-4.56 4.56a3.647 3.647 0 0 1-5.156 0L4.85 18.36ZM18.428 5.627a3.505 3.505 0 0 0-2.493 1.032l-3.613 3.614a.67.67 0 0 1-.946 0l-3.6-3.6A3.505 3.505 0 0 0 5.283 5.64h-.434l4.573-4.572a3.646 3.646 0 0 1 5.156 0l4.559 4.559ZM1.068 9.422 3.79 6.699h1.492a2.483 2.483 0 0 1 1.744.722l3.6 3.6a1.73 1.73 0 0 0 2.443 0l3.614-3.613a2.482 2.482 0 0 1 1.744-.723h1.767l2.737 2.737a3.646 3.646 0 0 1 0 5.156l-2.736 2.736h-1.768a2.482 2.482 0 0 1-1.744-.722l-3.613-3.613a1.77 1.77 0 0 0-2.444 0l-3.6 3.6a2.483 2.483 0 0 1-1.744.722H3.791l-2.723-2.723a3.646 3.646 0 0 1 0-5.156" />
        </g>
        <text x="32" y="17.5" fill="currentColor" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" fontWeight="800" fontSize="16" letterSpacing="-0.6">pix</text>
      </svg>
    )
  }
  if (norm === 'mastercard') {
    return (
      <svg className="payment-mark payment-mark-badge" viewBox="0 0 48 30" width="48" height="30" role="img" aria-label="Mastercard">
        <rect width="48" height="30" rx="6" fill="#1f1c19" />
        <circle cx="19" cy="15" r="9" fill="#EB001B" />
        <circle cx="29" cy="15" r="9" fill="#F79E1B" />
        <path d="M24 7.52A9 9 0 0 1 24 22.48A9 9 0 0 0 24 7.52Z" fill="#FF5F00" />
      </svg>
    )
  }
  if (norm === 'visa') {
    return (
      <svg className="payment-mark payment-mark-badge" viewBox="0 0 44 28" width="44" height="28" role="img" aria-label="Visa">
        <rect width="44" height="28" rx="5" fill="#FFFFFF" />
        <path fill="#1434CB" d="M18.8 20.2h-2.7l1.7-10.8h2.7l-1.7 10.8zm10.4-10.5c-.6-.2-1.5-.4-2.6-.4-2.8 0-4.8 1.5-4.8 3.6 0 1.6 1.4 2.4 2.5 2.9 1.1.5 1.5.8 1.5 1.3 0 .8-.9 1.1-1.4 1.1-.9 0-1.9-.2-2.9-.7l-.4-.2-.4 2.6c.7.3 2.1.6 3.5.6 3.3 0 5.5-1.6 5.5-3.9 0-3-4.2-3.2-4.2-4.5 0-.4.4-.8 1.3-.9.4 0 1.6.1 2.8.6l.3.2.5-2.7zm5.9 6.9l1.4-3.7.2 1.2.7 3.7h-2.8l.5-1.2zm4.2-6.9h-2.1c-.7 0-1.2.2-1.4.8l-5 11.2h2.9l.6-1.6h3.6l.3 1.6h2.6l-2.2-12zm-26.4.8l-2.6 7.5-.2-1.5c-.5-1.7-2.1-3.5-3.8-4.4l2.5 9.4h2.9l4.3-11h-3z" />
        <path fill="#FAA61A" d="M8.7 9.6H4.2L4 10.5c3.1.8 5.2 2.7 6.1 5.1l.8-4.4c.2-1-.3-1.6-1.6-1.6z" />
      </svg>
    )
  }
  if (norm === 'elo') {
    return (
      <svg className="payment-mark payment-mark-elo" viewBox="0 0 50 28" width="50" height="28" role="img" aria-label="Elo">
        {/* Authentic Elo: three colored circles + elo typography */}
        <circle cx="9" cy="9" r="4.2" fill="#E81E25" />
        <circle cx="16" cy="9" r="4.2" fill="#FFC709" />
        <circle cx="12.5" cy="16" r="4.2" fill="#00A4E8" />
        <text x="24" y="19" fill="#FFFFFF" fontFamily="'Montserrat', 'Arial Black', sans-serif" fontWeight="800" fontSize="16" letterSpacing="-0.3">elo</text>
      </svg>
    )
  }
  if (norm === 'hipercard') {
    return (
      <svg className="payment-mark payment-mark-badge" viewBox="0 0 48 28" width="48" height="28" role="img" aria-label="Hipercard">
        <rect width="48" height="28" rx="5" fill="#8B0E14" />
        <text x="24" y="17.5" fill="#FFFFFF" fontFamily="'Montserrat', sans-serif" fontWeight="900" fontSize="7.5" textAnchor="middle" letterSpacing="0.4">HIPERCARD</text>
      </svg>
    )
  }
  if (norm === 'dinheiro') {
    return (
      <svg className="payment-mark payment-mark-cash" viewBox="0 0 48 30" width="48" height="30" role="img" aria-label="Dinheiro">
        {/* Cédula: verde sólido + moldura clara + selo central com R$ */}
        <rect width="48" height="30" rx="6" fill="#2E7D32" />
        <rect x="4.5" y="4.5" width="39" height="21" rx="3.5" fill="none" stroke="#C8E6C9" strokeWidth="1.3" opacity="0.9" />
        <circle cx="24" cy="15" r="7" fill="#1B5E20" stroke="#C8E6C9" strokeWidth="1.2" />
        <text x="24" y="18.6" fill="#FFFFFF" fontFamily="'Montserrat', sans-serif" fontWeight="900" fontSize="9.5" textAnchor="middle">R$</text>
      </svg>
    )
  }
  return (
    <svg className="payment-mark" viewBox="0 0 44 28" width="44" height="28" role="img" aria-label={name}>
      <rect width="44" height="28" rx="5" fill="#FFFFFF" />
      <text x="22" y="17" fontSize="10" textAnchor="middle" fill="#252321" fontWeight="700">{name}</text>
    </svg>
  )
}


// Shapes de onda exclusivos por tipo de transição — cada divisão tem personalidade própria
const DIVIDER_SHAPES = {
  'hero-to-cream':   'M0,28 C240,68 480,72 720,44 C960,18 1200,64 1440,36 L1440,80 L0,80 Z',
  'cream-to-dark':   'M0,32 C260,76 540,16 820,58 C1100,82 1300,24 1440,46 L1440,80 L0,80 Z',
  'dark-to-cream':   'M0,44 C260,12 560,78 860,32 C1120,0 1320,62 1440,38 L1440,80 L0,80 Z',
  'cream-to-app':    'M0,16 C360,76 720,0  1080,60 C1260,80 1380,32 1440,48 L1440,80 L0,80 Z',
  'app-to-offer':    'M0,52 C200,20 560,76 800,32 C1040,0  1280,60 1440,28 L1440,80 L0,80 Z',
  'offer-to-cream':  'M0,24 C280,80 640,4  960,56 C1120,80 1300,20 1440,44 L1440,80 L0,80 Z',
  'cream-to-footer': 'M0,40 C320,80 640,0  960,60 C1200,80 1360,24 1440,40 L1440,80 L0,80 Z',
}

function SectionDivider({ from = 'cream', to = 'dark', flip = false }) {
  const key = `${from}-to-${to}`
  const d = DIVIDER_SHAPES[key] || 'M0,20 C360,72 1080,0 1440,48 L1440,80 L0,80 Z'
  return (
    <div className={`section-divider divider-from-${from}-to-${to}${flip ? ' divider-flip' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" focusable="false">
        <path d={d} />
      </svg>
    </div>
  )
}

function InstallAppModal({ isOpen, onClose, onOpenCardapio }) {
  if (!isOpen) return null

  return (
    <div className="pwa-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="pwa-modal-title">
      <div className="pwa-modal-card" onClick={e => e.stopPropagation()}>
        <button className="pwa-modal-close" onClick={onClose} aria-label="Fechar modal de instalação">✕</button>
        <div className="pwa-modal-header">
          <div className="pwa-modal-icon">
            <img src="/media/burgers.jpg" alt="Brasa Prime App" />
          </div>
          <h3 id="pwa-modal-title">Instalar Web App Brasa Prime</h3>
          <p>Tenha acesso instantâneo direto da tela inicial do seu celular ou PC, sem precisar baixar na loja de aplicativos!</p>
        </div>

        <div className="pwa-instructions-tabs">
          <div className="pwa-device-instruction">
            <div className="pwa-device-title">
              <span>🍎 iPhone / iPad (Safari)</span>
            </div>
            <ol>
              <li>Toque no botão de <strong>Compartilhar</strong> (ícone de quadrado com seta para cima na barra inferior).</li>
              <li>Role a lista para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.</li>
              <li>Toque em <strong>"Adicionar"</strong> no canto superior direito.</li>
            </ol>
          </div>

          <div className="pwa-device-instruction">
            <div className="pwa-device-title">
              <span>🤖 Android (Chrome / Navegador)</span>
            </div>
            <ol>
              <li>Toque nos <strong>3 pontinhos</strong> no canto superior direito do navegador.</li>
              <li>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
              <li>Confirme e o ícone aparecerá junto aos seus outros apps.</li>
            </ol>
          </div>

          <div className="pwa-device-instruction">
            <div className="pwa-device-title">
              <span>💻 Computador (Chrome / Edge / Mac)</span>
            </div>
            <ol>
              <li>Clique no ícone de <strong>Instalar (+)</strong> na barra de endereços do seu navegador.</li>
              <li>Clique em <strong>"Instalar"</strong> para fixar o app no seu computador.</li>
            </ol>
          </div>
        </div>

        <div className="pwa-modal-footer">
          <button className="button button-primary" onClick={() => { onClose(); onOpenCardapio(); }}>
            Fazer pedido agora no navegador
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionIndicator({ currentView, onNavigate }) {
  const sectionElements = useMemo(() => [
    { id: 'inicio', label: 'INÍCIO', color: '#d46416' },
    { id: 'cardapio', label: 'BURGERS', color: '#b84f09' },
    { id: 'combos', label: 'COMBOS', color: '#f58518' },
    { id: 'sobre', label: 'SOBRE NÓS', color: '#8b522b' },
    { id: 'pedido-rapido', label: 'BAIXAR APP', color: '#f5a623' },
    { id: 'delivery', label: 'OFERTA', color: '#ea1d2c' },
    { id: 'contato', label: 'CONTATO', color: '#25201c' },
  ], [])

  const [displaySection, setDisplaySection] = useState(sectionElements[0])
  const [animState, setAnimState] = useState('is-visible') // 'is-visible' | 'is-leaving' | 'is-entering'
  const targetSectionRef = useRef(sectionElements[0])
  const currentSectionRef = useRef(sectionElements[0])
  const changingRef = useRef(false)

  useEffect(() => {
    if (currentView !== 'home') return

    let ticking = false
    function detectSection() {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight

      // If at bottom of page, highlight contact
      if (scrollY + winHeight >= docHeight - 60) {
        triggerChange(sectionElements[sectionElements.length - 1])
        return
      }

      // If at top
      if (scrollY < 120) {
        triggerChange(sectionElements[0])
        return
      }

      const viewportTarget = winHeight * 0.4
      let closestSection = sectionElements[0]
      let minDistance = Infinity

      for (const item of sectionElements) {
        const el = document.getElementById(item.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.top - viewportTarget)
        if (rect.top <= viewportTarget && rect.bottom >= viewportTarget) {
          closestSection = item
          break
        }
        if (dist < minDistance) {
          minDistance = dist
          closestSection = item
        }
      }

      triggerChange(closestSection)
    }

    function triggerChange(newSec) {
      if (!newSec || newSec.id === currentSectionRef.current.id) return
      targetSectionRef.current = newSec

      if (changingRef.current) return
      changingRef.current = true

      // Step 1: Fade out / slide out (is-leaving)
      setAnimState('is-leaving')

      setTimeout(() => {
        const nextSec = targetSectionRef.current
        currentSectionRef.current = nextSec
        setDisplaySection(nextSec)

        // Step 2: Prepare entry position (is-entering)
        setAnimState('is-entering')

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Step 3: Enter smoothly (is-visible)
            setAnimState('is-visible')

            setTimeout(() => {
              changingRef.current = false
              // If target changed while animating, re-trigger
              if (targetSectionRef.current.id !== currentSectionRef.current.id) {
                triggerChange(targetSectionRef.current)
              }
            }, 300)
          })
        })
      }, 250)
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          detectSection()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    detectSection()

    return () => window.removeEventListener('scroll', onScroll)
  }, [currentView, sectionElements])

  if (currentView !== 'home') return null

  return (
    <aside className="section-indicator" aria-label="Indicador de seção atual">
      <div
        className={`section-tag ${animState}`}
        style={{ backgroundColor: displaySection.color }}
        onClick={() => onNavigate(displaySection.id)}
        role="button"
        tabIndex={0}
        title={`Seção atual: ${displaySection.label} (clique para rolar)`}
      >
        <span>{displaySection.label}</span>
      </div>
    </aside>
  )
}

export default function App() {
  const { products, settings } = useBrasa()
  const [currentView, setCurrentView] = useState('home')
  const [menuFilter, setMenuFilter] = useState('Todos')
  const [category, setCategory] = useState('Todos')
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(null) // {code, percent}
  const [couponMessage, setCouponMessage] = useState('')
  const [step, setStep] = useState('cart') // cart | info | done
  const [checkoutStage, setCheckoutStage] = useState('dados') // dados | endereco | pagamento
  const [checkoutError, setCheckoutError] = useState('')
  const [orderType, setOrderType] = useState('delivery') // 'delivery' | 'retirada'
  const [lastOrder, setLastOrder] = useState(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo - SP',
    payment: 'Pix',
    troco: '',
    obs: '',
  })
  const [loadingCep, setLoadingCep] = useState(false)
  const [cepError, setCepError] = useState('')
  const [showWhatsapp, setShowWhatsapp] = useState(false)
  const [gateSignal, setGateSignal] = useState(0)
  const secretTap = useSecretUnlock(() => setGateSignal(s => s + 1))
  const dialog = useRef(null)

  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
          setDeferredPrompt(null)
          setIsInstallable(false)
          setNotice('Aplicativo instalado com sucesso!')
        }
      } catch {
        setShowInstallModal(true)
      }
    } else {
      setShowInstallModal(true)
    }
  }

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('brasa-favorites') || '{}')
    } catch { return {} }
  })
  function toggleFavorite(id) {
    setFavorites(prev => {
      const next = { ...prev, [id]: !prev[id] }
      try { localStorage.setItem('brasa-favorites', JSON.stringify(next)) } catch {}
      return next
    })
  }

  const menuCategories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.menuCategory).filter(Boolean))]
    const order = ['Hambúrgueres', 'Combos', 'Porções', 'Bebidas', 'Sobremesas']
    cats.sort((a, b) => (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 99 : order.indexOf(b)))
    return ['Todos', ...cats]
  }, [products])

  const burgers = useMemo(() => products.filter(p => p.menuCategory === 'Hambúrgueres'), [products])
  const combos = useMemo(() => products.filter(p => p.menuCategory === 'Combos'), [products])

  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('brasa-cart') || '[]')
      if (!Array.isArray(saved)) return []
      return saved.filter(i => Number.isInteger(i.quantity) && i.quantity > 0).map(i => ({ id: i.id, quantity: Math.min(i.quantity, 99) }))
    } catch { return [] }
  })

  const cartDetailed = useMemo(() => cart
    .map(c => { const p = products.find(p => p.id === c.id); return p ? { ...p, quantity: c.quantity } : null })
    .filter(Boolean), [cart, products])

  const totalItems = cartDetailed.reduce((s, i) => s + i.quantity, 0)
  const subtotal = cartDetailed.reduce((s, i) => s + i.price * i.quantity, 0)
  const discount = couponApplied ? subtotal * (couponApplied.percent / 100) : 0
  const delivery = orderType === 'retirada' || cartDetailed.length === 0
    ? 0
    : (subtotal - discount >= (settings.freeAbove || 60) ? 0 : (settings.deliveryFee || 0))
  const total = Math.max(0, subtotal - discount + (step === 'info' || step === 'done' ? delivery : 0))

  useEffect(() => {
    try { localStorage.setItem('brasa-cart', JSON.stringify(cart)) } catch { /* memória */ }
  }, [cart])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 3000)
    return () => clearTimeout(t)
  }, [notice])

  useEffect(() => {
    const h = () => setShowWhatsapp(window.scrollY > 100)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  // High-performance IntersectionObserver for scroll-reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      })
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    })

    const elements = document.querySelectorAll('.reveal-on-scroll, .product-card, .quality-item, .qualities-grid > div, .about-copy, .location-card, .coupon-box, .delivery-inner, .review-card, .cardapio-card')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [currentView, category, menuFilter])

  async function fetchAddressByCep(rawCep) {
    const cleanCep = rawCep.replace(/\D/g, '')
    if (cleanCep.length !== 8) return
    setLoadingCep(true)
    setCepError('')
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await res.json()
      if (data.erro) {
        setCepError('CEP não encontrado. Digite o endereço manualmente.')
      } else {
        setForm(prev => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade ? `${data.localidade} - ${data.uf}` : prev.city,
        }))
        setCepError('')
      }
    } catch {
      setCepError('Não foi possível buscar o CEP automaticamente.')
    } finally {
      setLoadingCep(false)
    }
  }

  function handleCepChange(e) {
    let val = e.target.value.replace(/\D/g, '').slice(0, 8)
    if (val.length > 5) {
      val = `${val.slice(0, 5)}-${val.slice(5)}`
    }
    setForm(prev => ({ ...prev, cep: val }))
    if (val.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(val)
    }
  }

  function handlePhoneChange(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (v.length > 10) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`
    } else if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`
    } else if (v.length > 0) {
      v = `(${v}`
    }
    setForm(prev => ({ ...prev, phone: v }))
  }

  const [cartBump, setCartBump] = useState(false)

  function addToCart(product) {
    if (product.available === false) { setNotice(`${product.name} está indisponível no momento`); return }
    setCart(c => c.some(i => i.id === product.id)
      ? c.map(i => (i.id === product.id ? { ...i, quantity: Math.min(i.quantity + 1, 99) } : i))
      : [...c, { id: product.id, quantity: 1 }])
    setNotice(`${product.name} adicionado ao pedido`)
    setCartBump(true)
    setTimeout(() => setCartBump(false), 450)
  }
  function openCart() { setStep('cart'); setCheckoutStage('dados'); setCheckoutError(''); dialog.current?.showModal(); document.body.style.overflow = 'hidden' }
  function closeCart() { dialog.current?.close(); document.body.style.overflow = '' }
  function changeQuantity(id, q) { setCart(c => c.map(i => (i.id === id ? { ...i, quantity: q } : i)).filter(i => i.quantity > 0)) }
  function tryCoupon(code) {
    const found = brasaStore.validCoupon(code)
    if (found) { setCouponApplied(found); setCouponMessage(`${found.percent}% de desconto aplicado`); return true }
    setCouponApplied(null); setCouponMessage('Cupom não encontrado'); return false
  }
  function activateCoupon() { setCoupon('BRASA10'); tryCoupon('BRASA10'); setNotice('Cupom BRASA10 aplicado com 10% de desconto') }
  function openCardapioSection(cat = 'Todos') { setCurrentView('cardapio'); setMenuFilter(cat); window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false) }
  function goToHomeSection(id) {
    setCurrentView('home'); setMenuOpen(false)
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function brandClick(e, target) {
    e.preventDefault(); secretTap()
    if (target === 'home') goToHomeSection('inicio')
  }
  // Checkout progressivo: dados -> endereco -> pagamento (retirada pula o endereco)
  const checkoutFlow = orderType === 'delivery' ? ['dados', 'endereco', 'pagamento'] : ['dados', 'pagamento']
  const checkoutLabels = { dados: 'Seus dados', endereco: 'Endereço', pagamento: 'Pagamento' }
  function checkoutNext() {
    setCheckoutError('')
    if (checkoutStage === 'dados') {
      if (!form.name.trim() || form.phone.replace(/\D/g, '').length < 10) {
        setCheckoutError('Preencha seu nome e WhatsApp com DDD para continuar.')
        return
      }
      setCheckoutStage(orderType === 'delivery' ? 'endereco' : 'pagamento')
    } else if (checkoutStage === 'endereco') {
      if (!form.street.trim() || !form.number.trim()) {
        setCheckoutError('Informe a rua e o número para entrega.')
        return
      }
      setCheckoutStage('pagamento')
    }
  }
  function checkoutBack() {
    setCheckoutError('')
    if (checkoutStage === 'pagamento') setCheckoutStage(orderType === 'delivery' ? 'endereco' : 'dados')
    else if (checkoutStage === 'endereco') setCheckoutStage('dados')
  }
  function pickOrderType(t) {
    setOrderType(t)
    setCheckoutError('')
    if (t === 'retirada' && checkoutStage === 'endereco') setCheckoutStage('pagamento')
  }
  function finishOrder(e) {
    e.preventDefault()
    if (!form.name.trim() || form.phone.replace(/\D/g, '').length < 10) {
      alert('Preencha seu nome e WhatsApp com DDD.')
      return
    }

    let fullAddress = 'Retirada no balcão'
    if (orderType === 'delivery') {
      if (!form.street.trim() || !form.number.trim()) {
        alert('Por favor, informe a Rua e o Número para entrega.')
        return
      }
      fullAddress = `${form.street.trim()}, ${form.number.trim()}${form.complement ? ' (' + form.complement.trim() + ')' : ''} - ${form.neighborhood || 'Bairro'}, ${form.city || ''}${form.cep ? ' (CEP: ' + form.cep + ')' : ''}`
    }

    const order = brasaStore.createOrder({
      customer: { name: form.name.trim(), phone: form.phone.trim() },
      items: cartDetailed,
      subtotal,
      discount,
      total: subtotal - discount + delivery,
      payment: form.payment + (form.payment === 'Dinheiro' && form.troco ? ` (Troco p/ ${form.troco})` : ''),
      coupon: couponApplied?.code || '',
      address: fullAddress,
      obs: form.obs.trim(),
    })
    setLastOrder(order)
    setCart([])
    setStep('done')
  }
  const waLink = lastOrder
    ? `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`*NOVO PEDIDO ${lastOrder.id.slice(-6)} — ${settings.storeName}*\nCliente: ${lastOrder.customer.name} (${lastOrder.customer.phone})\nTipo: ${orderType === 'delivery' ? 'Delivery' : 'Retirada no Balcão'}\nEndereço: ${lastOrder.address}\n\n*Itens:*\n${lastOrder.items.map(i => `• ${i.qty}x ${i.name}`).join('\n')}\n\nForma de Pagamento: ${lastOrder.payment}\n${lastOrder.obs ? `Observações: ${lastOrder.obs}\n` : ''}*Total: ${money(lastOrder.total)}*`)}`
    : ''

  return (
    <>
      <Intro />
      {settings.announcement && <div className="store-announcement">{settings.announcement}</div>}
      {!settings.storeOpen && (
        <div className="store-closed">
          <SvgIcon name="info-circle" /> Loja fechada no momento — volte no horário de funcionamento ({settings.hours})
        </div>
      )}
      <header className="site-header">
        <div className="container header-inner">
          <Logo onClick={(e) => brandClick(e, 'home')} />
          <nav className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Navegação principal">
            <a
              href="#inicio"
              className={currentView === 'home' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); goToHomeSection('inicio') }}
            >
              Início
            </a>
            <a
              href="#cardapio"
              className={currentView === 'cardapio' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); openCardapioSection('Todos') }}
            >
              Cardápio
            </a>
            <a
              href="#sobre"
              onClick={(e) => { e.preventDefault(); goToHomeSection('sobre') }}
            >
              Sobre nós
            </a>
            <a
              href="#delivery"
              onClick={(e) => { e.preventDefault(); goToHomeSection('delivery') }}
            >
              Delivery
            </a>
            <a
              href="#contato"
              onClick={(e) => { e.preventDefault(); goToHomeSection('contato') }}
            >
              Contato
            </a>
          </nav>
          <div className="header-actions">
            <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>Menu</button>
            <button className={`button button-primary header-order ${cartBump ? 'cart-bump-anim' : ''}`} onClick={openCart}>
              <SvgIcon name="cart" className="header-cart-icon" />
              <span>{totalItems ? `Meu pedido (${totalItems})` : 'Peça agora'}</span>
            </button>
          </div>
        </div>
      </header>

      <main>
          {currentView === 'home' ? (
          <>
            <section className="hero" id="inicio">
              <div className="hero-video-wrapper">
                <video
                  className="hero-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  poster="/media/hero.jpg"
                  aria-hidden="true"
                >
                  <source src="/videos/hero-burger.mp4" type="video/mp4" />
                </video>
                <div className="hero-video-overlay" />
              </div>

              <div className="container hero-inner">
                <div className="hero-copy">
                  <div className="hero-eyebrow-line-wrap">
                    <span className="hero-eyebrow-text">100% ARTESANAL E NA BRASA</span>
                    <span className="hero-eyebrow-bar" />
                  </div>
                  <h1>
                    <span className="hero-title-main">O VERDADEIRO</span>
                    <span className="hero-title-light">SABOR DA BRASA</span>
                    <span className="hero-title-accent">EM CADA DENTADA</span>
                  </h1>
                  <p className="hero-description">Carne suculenta grelhada no fogo, cheddar derretido no ponto certo e pão brioche selado na manteiga.<br className="desktop-break" /> Não é apenas um hambúrguer, é o seu novo vício.</p>
                  <div className="hero-actions">
                    <a className="button button-primary" href="#cardapio" onClick={(e) => { e.preventDefault(); openCardapioSection('Todos') }}>
                      <span>Matar a minha fome agora</span>
                    </a>
                    <a className="button button-outline" href="#cardapio" onClick={(e) => { e.preventDefault(); openCardapioSection('Todos') }}>Ver o menu</a>
                  </div>
                  <div className="hero-details-svg">
                    <div className="hero-detail-item">
                      <div className="hero-detail-icon">
                        <SvgIcon name="flame" />
                      </div>
                      <div className="hero-detail-labels">
                        <strong>Defumado autêntico</strong>
                        <span>Feito na grelha de verdade</span>
                      </div>
                    </div>
                    <div className="hero-detail-item">
                      <div className="hero-detail-icon">
                        <SvgIcon name="burger" />
                      </div>
                      <div className="hero-detail-labels">
                        <strong>Sempre fresco</strong>
                        <span>Carne picada diariamente</span>
                      </div>
                    </div>
                  </div>
                </div>

                </div>

              <div className="hero-note">
                <p className="handwritten">Crocância e<br />suculência no limite</p>
                <svg className="hero-note-arrow" viewBox="0 0 65 65" fill="none" stroke="#f58518" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M 45 5 Q 50 35, 10 50" />
                  <polyline points="20 40 10 50 25 55" />
                </svg>
              </div>

              <div className="hero-bottom">
                <span>BRASA ACESA · FOME RESOLVIDA</span>
                <span>ARTESANAL DA PRIMEIRA À ÚLTIMA MORDIDA</span>
              </div>
            </section>

            <SectionDivider from="hero" to="cream" />

            <section className="qualities-features-bar" id="diferenciais">
              <div className="container qualities-features-container">
                <div className="qualities-features-grid">
                  {/* Item 1: INGREDIENTES SELECIONADOS */}
                  <div className="quality-feature-item">
                    <div className="quality-feature-icon">
                      <svg className="feature-item-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M10 28 C10 14, 22 8, 32 8 C42 8, 54 14, 54 28 Z" strokeWidth="3" />
                        <circle cx="22" cy="18" r="1.3" fill="currentColor" stroke="none" />
                        <circle cx="32" cy="14" r="1.3" fill="currentColor" stroke="none" />
                        <circle cx="42" cy="18" r="1.3" fill="currentColor" stroke="none" />
                        <circle cx="27" cy="22" r="1.2" fill="currentColor" stroke="none" />
                        <circle cx="37" cy="22" r="1.2" fill="currentColor" stroke="none" />
                        <path d="M8 32 C12 32, 14 36, 18 36 C22 36, 24 32, 28 32 C32 32, 34 36, 38 36 C42 36, 44 32, 48 32 C52 32, 54 35, 56 35" strokeWidth="2.8" />
                        <rect x="8" y="39" width="48" height="8" rx="4" strokeWidth="3" />
                        <path d="M11 50 H53 C55 50, 56 52, 55 54 C53 58, 44 60, 32 60 C20 60, 11 58, 9 54 C8 52, 9 50, 11 50 Z" strokeWidth="3" />
                      </svg>
                    </div>
                    <div className="quality-feature-text">
                      <strong>INGREDIENTES SELECIONADOS</strong>
                      <span>Qualidade em cada mordida</span>
                    </div>
                  </div>

                  {/* Item 2: PRODUTOS FRESCOS */}
                  <div className="quality-feature-item">
                    <div className="quality-feature-icon">
                      <svg className="feature-item-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M52 12 C52 12, 32 14, 20 26 C8 38, 10 52, 10 52 C10 52, 24 54, 36 42 C48 30, 52 12, 52 12 Z" strokeWidth="3" />
                        <path d="M10 52 L34 28" strokeWidth="3" />
                        <path d="M26 36 L34 44" strokeWidth="2.6" />
                        <path d="M31 31 L39 36" strokeWidth="2.6" />
                        <path d="M21 41 L25 48" strokeWidth="2.6" />
                      </svg>
                    </div>
                    <div className="quality-feature-text">
                      <strong>PRODUTOS FRESCOS</strong>
                      <span>Sabor de verdade</span>
                    </div>
                  </div>

                  {/* Item 3: ENTREGA RÁPIDA */}
                  <div className="quality-feature-item">
                    <div className="quality-feature-icon">
                      <svg className="feature-item-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="16" cy="46" r="8" strokeWidth="3" />
                        <circle cx="16" cy="46" r="2.5" fill="currentColor" stroke="none" />
                        <circle cx="48" cy="46" r="8" strokeWidth="3" />
                        <circle cx="48" cy="46" r="2.5" fill="currentColor" stroke="none" />
                        <rect x="8" y="20" width="16" height="16" rx="2.5" strokeWidth="3" />
                        <line x1="8" y1="28" x2="24" y2="28" strokeWidth="2" />
                        <path d="M24 33 H32 L39 44 H48" strokeWidth="3" />
                        <path d="M39 44 L45 18 H38" strokeWidth="3" />
                        <path d="M48 18 H54" strokeWidth="3" />
                        <circle cx="53" cy="20" r="1.8" fill="currentColor" stroke="none" />
                        <path d="M3 24 H5" strokeWidth="2.5" />
                        <path d="M2 30 H5" strokeWidth="2.5" />
                      </svg>
                    </div>
                    <div className="quality-feature-text">
                      <strong>ENTREGA RÁPIDA</strong>
                      <span>Seu lanche no menor tempo</span>
                    </div>
                  </div>

                  {/* Item 4: SATISFAÇÃO GARANTIDA */}
                  <div className="quality-feature-item">
                    <div className="quality-feature-icon">
                      <svg className="feature-item-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M32 8 L36 12 L41.5 11 L44 16 L49.5 17.5 L50 23 L55 26 L53 31.5 L56 36 L52.5 40.5 L53.5 46 L48 48 L46.5 53.5 L41 53 L37.5 57.5 L32 54.5 L26.5 57.5 L23 53 L17.5 53.5 L16 48 L10.5 46 L11.5 40.5 L8 36 L11 31.5 L9 26 L14 23 L14.5 17.5 L20 16 L22.5 11 L28 12 Z" strokeWidth="2.6" />
                        <polygon points="32,19 35.5,26.5 43.5,27.5 37.5,33 39,41 32,37 25,41 26.5,33 20.5,27.5 28.5,26.5" fill="currentColor" stroke="none" />
                        <path d="M23 48 L17 60 L26 56 L31 60 L30 52" strokeWidth="2.6" strokeLinejoin="round" />
                        <path d="M41 48 L47 60 L38 56 L33 60 L34 52" strokeWidth="2.6" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="quality-feature-text">
                      <strong>SATISFAÇÃO GARANTIDA</strong>
                      <span>Ou seu dinheiro de volta</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Seção 1: Hambúrgueres (Página Principal) */}
            <section className="menu-section light-section" id="cardapio">
              <div className="container">
                <div className="section-heading">
                  <h2>Escolha a sua<br /><span>próxima obsessão</span></h2>
                  <div className="menu-heading-side">
                    <div className="menu-handwritten-wrap">
                      <svg className="menu-handwritten-arrow left" viewBox="0 0 60 70" fill="none" stroke="#a1643c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M 16 6 C 22 26, 32 34, 38 52" />
                        <polyline points="27 43 38 54 47 45" />
                      </svg>
                      <p className="handwritten">Difícil vai ser<br />escolher só um!</p>
                    </div>
                    <button className="button button-outline dark-outline" onClick={() => openCardapioSection('Hambúrgueres')}>Ver menu completo</button>
                  </div>
                </div>
                <div className="menu-tabs" aria-label="Filtrar cardápio">
                  {['Todos', 'Carne', 'Frango'].map(item => (
                    <button key={item} onClick={() => setCategory(item)} className={category === item ? 'active' : ''} aria-pressed={category === item}>
                      {item === 'Todos' ? 'Todos os burgers' : item === 'Carne' ? 'Na brasa' : 'Frango crocante'}
                    </button>
                  ))}
                  <span>Brioche selado • Carne alta e suculenta • Molhos exclusivos</span>
                </div>
                <div className="products-grid">
                  {burgers.filter(i => category === 'Todos' || i.category === category).map(p => (
                    <ProductCard key={p.id} product={p} onAdd={addToCart} onClickPhoto={() => openCardapioSection('Hambúrgueres')} />
                  ))}
                </div>
              </div>
            </section>

            <SectionDivider from="cream" to="dark" />

            <section className="combos-section" id="combos">
              <div className="container">
                <div className="section-heading"><h2>Os favoritos <span>da galera</span></h2><p>Burger com batata e bebida<br />A combinação que não tem erro</p></div>
                <div className="products-grid">
                  {combos.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} isCombo onClickPhoto={() => openCardapioSection('Combos')} />)}
                </div>
                <p className="combo-footnote">Todos os combos acompanham batata frita e refrigerante de 350 ml</p>
              </div>
            </section>

            <SectionDivider from="dark" to="cream" />

            <section className="about-section light-section" id="sobre">
              <div className="container about-container">
                <div className="about-image">
                  <img src="/media/chef-burger-express.png" alt="Chef preparando hambúrgueres em uma churrasqueira com brasa acesa" loading="lazy" />
                  <p className="handwritten">Aqui o sabor<br />é coisa séria</p>
                </div>
                <div className="about-copy">
                  <h2>Muito mais que<br />uma hamburgueria</h2>
                  <p>A Brasa Prime nasceu de uma paixão simples — fazer um hambúrguer que dá vontade de comer de novo</p>
                  <p>Por aqui a carne encontra a brasa no ponto certo e os molhos têm receita própria<br />Cada ingrediente tem um motivo para estar ali e tudo é feito com calma e cuidado</p>
                  <div className="about-values">
                    <div className="about-value-item">
                      <div className="about-value-icon">
                        <svg className="value-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                          <polygon points="12 5 13.09 7.26 15.5 7.63 13.75 9.38 14.18 11.8 12 10.64 9.82 11.8 10.25 9.38 8.5 7.63 10.91 7.26 12 5" fill="currentColor" stroke="none" />
                        </svg>
                      </div>
                      <div className="about-value-text">
                        <strong>Qualidade</strong>
                        <span>em cada detalhe</span>
                      </div>
                    </div>

                    <div className="about-value-item">
                      <div className="about-value-icon">
                        <svg className="value-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                          <path d="M6 6h10" />
                          <path d="M6 10h10" />
                          <path d="M6 14h6" />
                          <path d="M17 14.5c.5-.5 1-1.2 1-1.8a1.2 1.2 0 1 0-2.4 0c0 .6.5 1.3 1 1.8Z" fill="currentColor" stroke="none" />
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        </svg>
                      </div>
                      <div className="about-value-text">
                        <strong>Receitas</strong>
                        <span>com personalidade</span>
                      </div>
                    </div>

                    <div className="about-value-item">
                      <div className="about-value-icon">
                        <svg className="value-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                          <path d="M12 7.5c1 1.5 2 2.5 2 3.8a2 2 0 0 1-4 0c0-1.3 1-2.3 2-3.8z" fill="currentColor" stroke="none" />
                        </svg>
                      </div>
                      <div className="about-value-text">
                        <strong>Paixão</strong>
                        <span>pelo que fazemos</span>
                      </div>
                    </div>
                  </div>
                  <a className="button button-outline dark-outline" href="#contato" onClick={(e) => { e.preventDefault(); goToHomeSection('contato') }}>Vem conhecer a casa</a>
                </div>
              </div>
            </section>

            <SectionDivider from="cream" to="app" />

            {/* Seção Baixe Nosso Aplicativo (Banner Promocional Integrado) */}
            <section className="app-download-section" id="pedido-rapido">
              <div className="container app-promo-container">
                {/* Coluna Esquerda: Textos, Botão e Pilares */}
                <div className="app-promo-left">
                  <div className="app-new-eyebrow">
                    <span className="app-eyebrow-text">NOSSO APP</span>
                    <span className="app-eyebrow-line" aria-hidden="true" />
                  </div>

                  <h2 className="app-new-headline">
                    <span className="app-title-white">BAIXE NOSSO</span>
                    <span className="app-title-yellow">APLICATIVO</span>
                  </h2>

                  <p className="app-new-description">
                    Peça mais rápido, receba ofertas exclusivas<br className="desktop-break" />
                    e acompanhe tudo direto do celular.
                  </p>

                  <div className="app-new-action-wrap">
                    <button
                      type="button"
                      className="app-new-btn"
                      onClick={handleInstallApp}
                      aria-label="Baixar aplicativo da Brasa Prime"
                    >
                      BAIXAR AGORA
                    </button>
                    <span className="app-new-note">Instala em segundos pelo navegador.</span>
                  </div>

                  <div className="app-new-pillars">
                    <div className="app-new-pillar">
                      <strong>CUPONS</strong>
                      <span>EXCLUSIVOS</span>
                    </div>
                    <div className="app-pillar-divider" aria-hidden="true" />
                    <div className="app-new-pillar">
                      <strong>PEDIDO EM</strong>
                      <span>SEGUNDOS</span>
                    </div>
                    <div className="app-pillar-divider" aria-hidden="true" />
                    <div className="app-new-pillar">
                      <strong>ACOMPANHE</strong>
                      <span>EM TEMPO REAL</span>
                    </div>
                  </div>
                </div>

                {/* Coluna Direita: Cena 3D em Alta Definição */}
                <div className="app-promo-right">
                  <img
                    src="/media/app-phone-isolated.png"
                    alt="Aplicativo Brasa Prime no Smartphone"
                    className="app-promo-scene-img"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>

            <SectionDivider from="app" to="offer" />

            <section className="offer-section" id="delivery">
              <div className="container offer-inner">
                <div className="offer-photo" role="img" aria-label="Hambúrguer artesanal com cheddar e bacon" />
                <div className="offer-copy">
                  <h2>A PRIMEIRA MORDIDA<br />TEM <span>10% OFF</span></h2>
                  <p>Seu primeiro pedido merece um presente da casa</p>
                  <div className="coupon-row"><span>Use o cupom</span><button className="coupon-code" onClick={activateCoupon}>BRASA10</button></div>
                  <a className="button button-primary" href="#cardapio" onClick={(e) => { e.preventDefault(); activateCoupon(); openCardapioSection('Todos') }}>Pedir com desconto</a>
                </div>
              </div>
            </section>

            <SectionDivider from="offer" to="cream" />

            <section className="contact-section light-section" id="contato">
              <div className="container contact-grid">
                <div className="contact-copy">
                  <h2>Venha nos visitar ou<br /><span>peça sem sair de casa</span></h2>
                  <p>Escolha como quer sentir o sabor da Brasa Prime</p>
                  <div className="contact-details">
                    <div className="contact-detail"><SvgIcon name="pin" /><div><strong>{settings.address}</strong><address>{settings.hours}</address></div></div>
                    <div className="contact-detail"><SvgIcon name="clock" /><div><strong>{settings.hours}</strong><p>Entrega: {money(settings.deliveryFee)}{(settings.freeAbove ? ` · grátis acima de ${money(settings.freeAbove)}` : '')}</p></div></div>
                  </div>
                  <div className="contact-buttons">
                    <a className="button order-whatsapp" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"><SvgIcon name="whatsapp" />Peça pelo WhatsApp</a>
                    <a className="button order-ifood" href="https://www.ifood.com.br/" target="_blank" rel="noreferrer"><SvgIcon name="ifood" />Peça pelo iFood</a>
                  </div>
                </div>
                <div className="location-card">
                  <div className="storefront-photo">
                    <img src="/media/brasa-prime-storefront.jpg" alt="Fachada aconchegante da Brasa Prime à noite" loading="lazy" />
                    <div className="storefront-vignette" />
                    <div className="storefront-handwriting">
                      <span>Ambiente acolhedor</span>
                      <span>para bons momentos</span>
                      <svg className="handwriting-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M19 14c-1.5 4-5 7-10 6-3-.5-5-3-5-6" />
                        <polyline points="7 10 4 14 8 16" />
                      </svg>
                    </div>
                  </div>
                  <div className="map-wrap">
                    <iframe
                      title="Mapa da Brasa Prime"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.9999999999995!2d-46.6533333!3d-23.5616667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a2b2a1a1a1a%3A0x123456789abcdef!2sAvenida%20Paulista%2C%201234%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt-BR!2sbr!4v1699999999999!5m2!1spt-BR!2sbr"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                    <a
                      className="map-pin-card"
                      href="https://www.google.com/maps/search/?api=1&query=Avenida+Paulista+1234+Sao+Paulo"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Abrir localização da Brasa Prime no Google Maps"
                    >
                      <div className="map-pin-icon-wrap">
                        <SvgIcon name="pin" />
                      </div>
                      <div className="map-pin-text">
                        <strong>Brasa Prime Burger</strong>
                        <span>Av. Paulista, 1234 - SP</span>
                      </div>
                    </a>
                    <a
                      className="map-expand-btn"
                      href="https://www.google.com/maps/search/?api=1&query=Avenida+Paulista+1234+Sao+Paulo"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Expandir mapa em tela cheia no Google Maps"
                      title="Ver rotas no Google Maps"
                    >
                      <SvgIcon name="expand" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <SectionDivider from="cream" to="footer" />
          </>
        ) : (
          <CardapioSection
            products={products}
            menuFilter={menuFilter}
            setMenuFilter={setMenuFilter}
            onAdd={addToCart}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            id="cardapio-view"
            showBackButton
            onBack={() => goToHomeSection('inicio')}
          />
        )}
      </main>

      <footer>
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <Logo onClick={(e) => brandClick(e, 'home')} />
              <p>Hambúrgueres artesanais<br />Momentos que ficam</p>
            </div>
            <div className="footer-links">
              <h3>Links</h3>
              <a href="#inicio" onClick={(e) => { e.preventDefault(); goToHomeSection('inicio') }}>Início</a>
              <a href="#cardapio" onClick={(e) => { e.preventDefault(); openCardapioSection('Todos') }}>Cardápio</a>
              <a href="#sobre" onClick={(e) => { e.preventDefault(); goToHomeSection('sobre') }}>Sobre nós</a>
              <a href="#delivery" onClick={(e) => { e.preventDefault(); goToHomeSection('delivery') }}>Delivery</a>
              <a href="#contato" onClick={(e) => { e.preventDefault(); goToHomeSection('contato') }}>Contato</a>
            </div>
            <div className="footer-social">
              <h3>Siga-nos</h3>
              <div>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><SvgIcon name="instagram" /></a>
                <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><SvgIcon name="facebook" /></a>
                <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok"><SvgIcon name="tiktok" /></a>
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><SvgIcon name="whatsapp" /></a>
              </div>
            </div>
            <div className="footer-payments">
              <h3>Formas de pagamento</h3>
              <div className="footer-payment-marks">
                <PaymentMark name="pix" />
                <PaymentMark name="mastercard" />
                <PaymentMark name="visa" />
                <PaymentMark name="elo" />
                <PaymentMark name="hipercard" />
                <PaymentMark name="dinheiro" />
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {settings.storeName} · Todos os direitos reservados</span>
            <span>Feito com paixão por hambúrguer</span>
          </div>
        </div>
      </footer>

      {showWhatsapp && (
        <a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de fazer um pedido na Burger & Brasa.')}`} target="_blank" rel="noreferrer" className="floating-whatsapp" aria-label="Peça pelo WhatsApp">
          <SvgIcon name="whatsapp" /><span className="floating-whatsapp-tooltip">Peça no WhatsApp</span>
        </a>
      )}

      {notice && <div className="toast" role="status"><span className="toast-text">{notice}</span>{totalItems > 0 && <span className="toast-total">{totalItems} {totalItems === 1 ? 'item' : 'itens'} · {money(subtotal - discount)}</span>}<button onClick={openCart}>Ver pedido</button></div>}

      <SectionIndicator currentView={currentView} onNavigate={goToHomeSection} />

      <dialog ref={dialog} className="cart-dialog" aria-label="Seu pedido" onCancel={closeCart} onClick={e => { if (e.target === dialog.current) closeCart() }}>
        <div className="cart-panel">
          <div className="cart-header">
            <div><h2>{step === 'done' ? 'Pedido confirmado!' : 'Seu pedido'}</h2><p>{totalItems} {totalItems === 1 ? 'item escolhido' : 'itens escolhidos'}</p></div>
            <button className="text-button" onClick={closeCart}>Fechar</button>
          </div>

          {step === 'done' && lastOrder ? (
            <div className="order-success">
              <div className="success-check">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>Valeu, {lastOrder.customer.name.split(' ')[0]}!</h3>
              <p>Pedido <b>{lastOrder.id.slice(-6)}</b> de <b>{money(lastOrder.total)}</b> registrado.<br />Vamos te chamar no WhatsApp pra confirmar.</p>
              <a className="button order-whatsapp" style={{ width: '100%' }} href={waLink} target="_blank" rel="noreferrer"><SvgIcon name="whatsapp" /> Enviar pedido no WhatsApp</a>
              <button className="button button-outline dark-outline" style={{ width: '100%', marginTop: 10 }} onClick={() => { closeCart(); openCardapioSection('Todos') }}>Voltar ao cardápio</button>
            </div>
          ) : cartDetailed.length === 0 ? (
            <div className="cart-empty">
              <h3>A brasa já está acesa</h3><p>Só falta escolher seu favorito</p>
              <button className="button button-primary" onClick={() => { closeCart(); openCardapioSection('Todos') }}>Explorar cardápio</button>
            </div>
          ) : step === 'cart' ? (
            <>
              <div className="cart-items">
                {cartDetailed.map(item => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-media">{item.image ? <img src={item.image} alt={item.name} className="cart-item-photo" /> : <ProductPhoto product={item} />}</div>
                    <div className="cart-item-main">
                      <div className="cart-item-top">
                        <div className="cart-item-info"><h3 className="cart-item-title">{item.name}</h3><span className="cart-item-unit-price">{money(item.price)} cada</span></div>
                        <button type="button" className="cart-remove-button" onClick={() => changeQuantity(item.id, 0)} aria-label={`Remover ${item.name}`}><SvgIcon name="trash" /></button>
                      </div>
                      <div className="cart-item-bottom">
                        <Stepper
                          value={item.quantity}
                          label={`Quantidade de ${item.name}`}
                          onMinus={() => changeQuantity(item.id, item.quantity - 1)}
                          onPlus={() => changeQuantity(item.id, Math.min(item.quantity + 1, 99))}
                        />
                        <strong className="cart-item-total">{money(item.price * item.quantity)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <form className="coupon-form" onSubmit={e => { e.preventDefault(); tryCoupon(coupon) }}>
                <label htmlFor="coupon">Tem um cupom?</label>
                <div><input id="coupon" value={coupon} placeholder="Digite o cupom" onChange={e => setCoupon(e.target.value)} /><button className="button button-outline dark-outline" type="submit">Aplicar</button></div>
                <p role="status">{couponMessage}</p>
              </form>
              <div className="cart-totals">
                <p><span>Subtotal</span><span>{money(subtotal)}</span></p>
                {couponApplied && <p className="discount"><span>Desconto {couponApplied.code}</span><span>− {money(discount)}</span></p>}
                <p className="total"><strong>Total</strong><strong>{money(subtotal - discount)}</strong></p>
                <small>Taxa de entrega calculada no próximo passo</small>
              </div>
              <button className="button button-primary checkout-button" onClick={() => { setCheckoutStage('dados'); setCheckoutError(''); setStep('info') }}>Continuar · dados de entrega</button>
            </>
          ) : (
            <form className="checkout-form" onSubmit={finishOrder}>
              {/* Indicador de etapas do checkout progressivo */}
              <div className="checkout-steps" aria-label="Etapas do pedido">
                {checkoutFlow.map(s => {
                  const idx = checkoutFlow.indexOf(s)
                  const cur = checkoutFlow.indexOf(checkoutStage)
                  const cls = s === checkoutStage ? 'active' : idx < cur ? 'done' : ''
                  return (
                    <div key={s} className={`checkout-step ${cls}`} aria-current={s === checkoutStage ? 'step' : undefined}>
                      <span className="step-bar" />
                      <span className="step-label">{idx + 1}. {checkoutLabels[s]}</span>
                    </div>
                  )
                })}
              </div>

              {checkoutStage === 'dados' && (<>
              {/* Toggle Delivery vs Retirada */}
              <div className="checkout-mode-toggle" role="group" aria-label="Forma de recebimento">
                <button
                  type="button"
                  className={`checkout-mode-btn ${orderType === 'delivery' ? 'active' : ''}`}
                  onClick={() => pickOrderType('delivery')}
                >
                  <SvgIcon name="bag" />
                  <span>Entrega Delivery</span>
                </button>
                <button
                  type="button"
                  className={`checkout-mode-btn ${orderType === 'retirada' ? 'active' : ''}`}
                  onClick={() => pickOrderType('retirada')}
                >
                  <SvgIcon name="pin" />
                  <span>Retirar no Balcão</span>
                </button>
              </div>

              {/* Contato do Cliente */}
              <div className="checkout-section-box">
                <span className="checkout-box-title">Seus Dados</span>
                <div className="checkout-grid-2">
                  <label>
                    Nome completo*
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Ex: Carlos Oliveira"
                    />
                  </label>
                  <label>
                    WhatsApp com DDD*
                    <input
                      required
                      value={form.phone}
                      onChange={handlePhoneChange}
                      placeholder="(11) 99999-9999"
                      inputMode="tel"
                    />
                  </label>
                </div>
              </div>
              {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
              <div className="checkout-nav">
                <button className="button button-outline dark-outline" type="button" onClick={() => setStep('cart')}>← Carrinho</button>
                <button className="button button-primary" type="button" onClick={checkoutNext}>Continuar</button>
              </div>
              </>)}

              {checkoutStage === 'endereco' && (<>
                <div className="checkout-section-box">
                  <div className="checkout-box-title-row">
                    <span className="checkout-box-title">Endereço de Entrega</span>
                    {loadingCep && <span className="cep-loading-text">Buscando CEP...</span>}
                  </div>
                  
                  {/* CEP row with auto-lookup */}
                  <div className="checkout-grid-cep">
                    <label>
                      CEP*
                      <input
                        value={form.cep}
                        onChange={handleCepChange}
                        placeholder="00000-000"
                        inputMode="numeric"
                        maxLength={9}
                      />
                    </label>
                    <label>
                      Cidade / UF
                      <input
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                        placeholder="São Paulo - SP"
                      />
                    </label>
                  </div>
                  {cepError && <span className="cep-error-msg">{cepError}</span>}

                  {/* Rua e Número */}
                  <div className="checkout-grid-street">
                    <label className="field-street">
                      Rua / Logradouro*
                      <input
                        required
                        value={form.street}
                        onChange={e => setForm({ ...form, street: e.target.value })}
                        placeholder="Ex: Av. Paulista"
                      />
                    </label>
                    <label className="field-number">
                      Número*
                      <input
                        required
                        value={form.number}
                        onChange={e => setForm({ ...form, number: e.target.value })}
                        placeholder="123"
                      />
                    </label>
                  </div>

                  {/* Bairro e Complemento */}
                  <div className="checkout-grid-2">
                    <label>
                      Bairro*
                      <input
                        value={form.neighborhood}
                        onChange={e => setForm({ ...form, neighborhood: e.target.value })}
                        placeholder="Ex: Bela Vista"
                      />
                    </label>
                    <label>
                      Complemento / Ref.
                      <input
                        value={form.complement}
                        onChange={e => setForm({ ...form, complement: e.target.value })}
                        placeholder="Apto 42, Bloco B"
                      />
                    </label>
                  </div>
                </div>
              {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
              <div className="checkout-nav">
                <button className="button button-outline dark-outline" type="button" onClick={checkoutBack}>← Voltar</button>
                <button className="button button-primary" type="button" onClick={checkoutNext}>Continuar</button>
              </div>
              </>)}

              {checkoutStage === 'pagamento' && (<>
              {/* Resumo do que já foi preenchido */}
              {orderType === 'retirada' ? (
                <div className="checkout-retirada-card">
                  <div className="retirada-icon-wrap"><SvgIcon name="pin" /></div>
                  <div>
                    <strong>Retirada na Unidade Brasa</strong>
                    <p>{settings.address}</p>
                    <small>Seu pedido fica pronto em ~20 a 30 minutos.</small>
                  </div>
                </div>
              ) : (
                <div className="checkout-section-box checkout-recap">
                  <span className="checkout-box-title">Resumo da entrega</span>
                  <p><strong>{form.name}</strong> · {form.phone}</p>
                  <p>{form.street}, {form.number}{form.complement ? ` (${form.complement})` : ''} — {form.neighborhood || 'Bairro'}</p>
                </div>
              )}

              {/* Formas de Pagamento Selecionáveis com SVGs */}
              <div className="checkout-section-box">
                <span className="checkout-box-title">Forma de Pagamento</span>
                <div className="payment-select-cards">
                  <button
                    type="button"
                    className={`payment-option-card ${form.payment === 'Pix' ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, payment: 'Pix' })}
                  >
                    <PaymentMark name="pix" />
                    <span>Pix (Instantâneo)</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-option-card ${form.payment === 'Cartão na entrega' ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, payment: 'Cartão na entrega' })}
                  >
                    <div className="card-mini-badges">
                      <PaymentMark name="mastercard" />
                      <PaymentMark name="visa" />
                    </div>
                    <span>Cartão na entrega</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-option-card ${form.payment === 'Dinheiro' ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, payment: 'Dinheiro' })}
                  >
                    <PaymentMark name="dinheiro" />
                    <span>Dinheiro</span>
                  </button>
                </div>

                {/* Se Dinheiro, pedir troco */}
                {form.payment === 'Dinheiro' && (
                  <div className="troco-input-box">
                    <label>
                      Precisa de troco para quanto?
                      <input
                        value={form.troco}
                        onChange={e => setForm({ ...form, troco: e.target.value })}
                        placeholder="Ex: R$ 50,00 ou Não preciso"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Observações */}
              <label className="checkout-obs-label">
                Observações do pedido (opcional)
                <input
                  value={form.obs}
                  onChange={e => setForm({ ...form, obs: e.target.value })}
                  placeholder="Ex: Tirar cebola, ponto da carne bem passado..."
                />
              </label>

              {/* Totais do Pedido */}
              <div className="cart-totals">
                <p><span>Subtotal</span><span>{money(subtotal)}</span></p>
                {couponApplied && <p className="discount"><span>Desconto</span><span>− {money(discount)}</span></p>}
                <p>
                  <span>Taxa de Entrega</span>
                  <span>{orderType === 'retirada' ? 'Grátis (Retirada)' : delivery === 0 ? 'Grátis' : money(delivery)}</span>
                </p>
                <p className="total"><strong>Total a pagar</strong><strong>{money(total)}</strong></p>
              </div>

              <button className="button button-primary checkout-button" type="submit">
                Confirmar pedido · {money(total)}
              </button>
              <button className="text-button" type="button" onClick={checkoutBack}>
                ← Voltar
              </button>
              </>)}
            </form>
          )}
        </div>
      </dialog>

      {gateSignal > 0 && <SecretGate forceOpen={gateSignal} onCloseGate={() => {}} />}

      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onOpenCardapio={() => openCardapioSection('Todos')}
      />
    </>
  )
}