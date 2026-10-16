// Brasa Prime — Store central (leve, localStorage, sem backend)
// Tudo que o admin precisa persiste no navegador. Pronto p/ migrar p/ API depois.
import { useSyncExternalStore } from 'react'

const K = {
  products: 'brasa-products-v1',
  orders: 'brasa-orders-v1',
  customers: 'brasa-customers-v1',
  coupons: 'brasa-coupons-v1',
  settings: 'brasa-settings-v1',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const v = JSON.parse(raw)
    return v ?? fallback
  } catch { return fallback }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* memória */ }
}

const DEFAULT_PRODUCTS = [
  { id: 'prime', name: 'Brasa Prime', description: 'Blend de 180 g com cheddar, bacon crocante, cebola caramelizada e molho da casa.', price: 34.9, oldPrice: null, image: '/media/burger-0.jpg', photo: 0, menuCategory: 'Hambúrgueres', category: 'Carne', available: true, featured: true, badge: 'MAIS PEDIDO', badgeIcon: 'tag', badgeClass: 'badge-orange' },
  { id: 'cheddar', name: 'Cheddar Lover', description: 'Blend de 180 g com muito cheddar cremoso, bacon e pão brioche da casa.', price: 32.9, oldPrice: null, image: '/media/burger-1.jpg', photo: 1, menuCategory: 'Hambúrgueres', category: 'Carne', available: true, featured: true, badge: 'NOVO', badgeIcon: 'star', badgeClass: 'badge-cream' },
  { id: 'barbecue', name: 'Barbecue Supreme', description: 'Blend de 180 g com barbecue artesanal, bacon, onion rings e queijo prato.', price: 36.9, oldPrice: null, image: '/media/burger-2.jpg', photo: 2, menuCategory: 'Hambúrgueres', category: 'Carne', available: true, featured: false },
  { id: 'chicken', name: 'Chicken Crispy', description: 'Frango empanado crocante com cheddar, alface, tomate e maionese da casa.', price: 29.9, oldPrice: null, image: '/media/burger-3.jpg', photo: 3, menuCategory: 'Hambúrgueres', category: 'Frango', available: true, featured: false },
  { id: 'combo-prime', name: 'Combo Brasa Prime', description: 'Brasa Prime com batata frita e refrigerante de 350 ml', price: 44.9, oldPrice: null, image: '/media/combo-0.jpg', menuCategory: 'Combos', category: 'Carne', available: true, featured: true, badge: 'MAIS PEDIDO', badgeIcon: 'tag', badgeClass: 'badge-orange' },
  { id: 'combo-cheddar', name: 'Combo Cheddar Lover', description: 'Cheddar Lover com batata frita e refrigerante de 350 ml', price: 42.9, oldPrice: null, image: '/media/combo-1.jpg', menuCategory: 'Combos', category: 'Carne', available: true, featured: false, badge: 'NOVO', badgeIcon: 'star', badgeClass: 'badge-cream' },
  { id: 'combo-barbecue', name: 'Combo Barbecue', description: 'Barbecue Supreme com batata frita e refrigerante de 350 ml', price: 46.9, oldPrice: null, image: '/media/combo-2.jpg', menuCategory: 'Combos', category: 'Carne', available: true, featured: false },
  { id: 'combo-chicken', name: 'Combo Chicken', description: 'Chicken Crispy com batata frita e refrigerante de 350 ml', price: 39.9, oldPrice: null, image: '/media/combo-3.jpg', menuCategory: 'Combos', category: 'Frango', available: true, featured: false },
  { id: 'fritas-brasa', name: 'Batata Frita Brasa', description: 'Batatas fritas crocantes com creme de cheddar e bacon crocante em cubos', price: 24.9, oldPrice: null, image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=700&auto=format&fit=crop&q=80', menuCategory: 'Porções', category: 'Porção', available: true, featured: false, badge: 'MAIS PEDIDO', badgeIcon: 'tag', badgeClass: 'badge-orange' },
  { id: 'rustica-alecrim', name: 'Batata Rústica com Alecrim', description: 'Cortes rústicos temperados com alecrim fresco e sal de parrilla', price: 22.9, oldPrice: null, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=700&auto=format&fit=crop&q=80', menuCategory: 'Porções', category: 'Porção', available: true, featured: false },
  { id: 'onion-rings', name: 'Onion Rings', description: 'Anéis de cebola empanados crocantes acompanhados de maionese da casa', price: 20.9, oldPrice: null, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=700&auto=format&fit=crop&q=80', menuCategory: 'Porções', category: 'Porção', available: true, featured: false },
  { id: 'dadinhos-tapioca', name: 'Dadinhos de Tapioca', description: 'Dadinhos de queijo coalho e tapioca crocantes com geleia de pimenta', price: 22.9, oldPrice: null, image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=700&auto=format&fit=crop&q=80', menuCategory: 'Porções', category: 'Porção', available: true, featured: false },
  { id: 'shake-doce-leite', name: 'Milk-shake Doce de Leite', description: 'Sorvete batido com doce de leite artesanal, chantilly e farofa de bacon', price: 19.9, oldPrice: null, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&auto=format&fit=crop&q=80', menuCategory: 'Bebidas', category: 'Bebida', available: true, featured: false, badge: 'MAIS PEDIDO', badgeIcon: 'tag', badgeClass: 'badge-orange' },
  { id: 'shake-chocolate', name: 'Milk-shake Chocolate Belga', description: 'Sorvete artesanal com cacau nobre, calda de chocolate e chantilly', price: 19.9, oldPrice: null, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=700&auto=format&fit=crop&q=80', menuCategory: 'Bebidas', category: 'Bebida', available: true, featured: false },
  { id: 'chopp-artesanal', name: 'Chopp Artesanal 500ml', description: 'Chopp puro malte tirado na hora trincando de gelado', price: 14.9, oldPrice: null, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=700&auto=format&fit=crop&q=80', menuCategory: 'Bebidas', category: 'Bebida', available: true, featured: false },
  { id: 'refrigerante-lata', name: 'Refrigerante em Lata', description: 'Lata 350 ml: Coca-Cola, Coca Zero, Guaraná Antarctica ou Sprite', price: 6.9, oldPrice: null, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=700&auto=format&fit=crop&q=80', menuCategory: 'Bebidas', category: 'Bebida', available: true, featured: false },
  { id: 'brownie-brasa', name: 'Brownie na Brasa', description: 'Brownie de chocolate aquecido na brasa com sorvete de baunilha e calda', price: 21.9, oldPrice: null, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&auto=format&fit=crop&q=80', menuCategory: 'Sobremesas', category: 'Doce', available: true, featured: false, badge: 'MAIS PEDIDO', badgeIcon: 'tag', badgeClass: 'badge-orange' },
  { id: 'petit-gateau', name: 'Petit Gâteau', description: 'Bolinho quente de chocolate com recheio cremoso e sorvete de creme', price: 23.9, oldPrice: null, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&auto=format&fit=crop&q=80', menuCategory: 'Sobremesas', category: 'Doce', available: true, featured: false },
  { id: 'churros-gourmet', name: 'Mini Churros com Doce de Leite', description: 'Churros espanhóis sequinhos polvilhados em açúcar e canela com doce de leite', price: 18.9, oldPrice: null, image: 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?w=700&auto=format&fit=crop&q=80', menuCategory: 'Sobremesas', category: 'Doce', available: true, featured: false },
]

const DEFAULT_COUPONS = [{ code: 'BRASA10', percent: 10, active: true }]

// Horário estruturado: um por dia, sem digitar nada (editor visual no admin).
export const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
export function defaultSchedule() {
  return [
    { d: 'Seg', open: true, from: '11:00', to: '23:00' },
    { d: 'Ter', open: true, from: '11:00', to: '23:00' },
    { d: 'Qua', open: true, from: '11:00', to: '23:00' },
    { d: 'Qui', open: true, from: '11:00', to: '23:00' },
    { d: 'Sex', open: true, from: '11:00', to: '00:00' },
    { d: 'Sáb', open: true, from: '11:00', to: '00:00' },
    { d: 'Dom', open: true, from: '11:00', to: '00:00' },
  ]
}
// Gera o texto bonito do site a partir da agenda ("Seg a Qui · 11h às 23h | ...").
export function scheduleText(sched) {
  if (!Array.isArray(sched) || !sched.length) return ''
  const fmt = t => String(t).replace(':30', 'h30').replace(':00', 'h')
  const groups = []
  sched.forEach(s => {
    const key = s.open ? `${s.from}-${s.to}` : 'off'
    const last = groups[groups.length - 1]
    if (last && last.key === key) last.days.push(s.d)
    else groups.push({ key, days: [s.d], s })
  })
  return groups.map(g => {
    const range = g.days.length > 1 ? `${g.days[0]} a ${g.days[g.days.length - 1]}` : g.days[0]
    if (!g.s.open) return `${range} fechado`
    const toTxt = g.s.to === '00:00' ? 'à meia-noite' : `às ${fmt(g.s.to)}`
    return `${range} · ${fmt(g.s.from)} ${toTxt}`
  }).join('  |  ')
}

const DEFAULT_SETTINGS = {
  storeName: 'Burger & Brasa',
  whatsapp: '5511999999999',
  address: 'Av Paulista 1234 — Bela Vista, São Paulo SP',
  hours: 'Seg a qui · 11h às 23h | Sex a dom · 11h à meia-noite',
  schedule: defaultSchedule(),
  deliveryFee: 6.9,
  freeAbove: 60,
  pixKey: '',
  storeOpen: true,
  adminPass: 'brasa123',
  announcement: '',
}

function getInitialProducts() {
  const stored = load(K.products, DEFAULT_PRODUCTS)
  return DEFAULT_PRODUCTS.map(dp => {
    const found = stored.find(s => s.id === dp.id)
    return found ? { ...dp, ...found, image: dp.image, badge: dp.badge, badgeIcon: dp.badgeIcon, badgeClass: dp.badgeClass } : dp
  })
}

const STORED_SETTINGS = { ...DEFAULT_SETTINGS, ...load(K.settings, {}) }
if (!Array.isArray(STORED_SETTINGS.schedule) || !STORED_SETTINGS.schedule.length) {
  STORED_SETTINGS.schedule = defaultSchedule()
}
let state = {
  products: getInitialProducts(),
  orders: load(K.orders, []),
  customers: load(K.customers, []),
  coupons: load(K.coupons, DEFAULT_COUPONS),
  settings: STORED_SETTINGS,
}
const listeners = new Set()
function emit() { listeners.forEach(l => l()) }
function persist() {
  save(K.products, state.products)
  save(K.orders, state.orders)
  save(K.customers, state.customers)
  save(K.coupons, state.coupons)
  save(K.settings, state.settings)
}
function set(patch) { state = { ...state, ...patch }; persist(); emit() }

export const money = v => (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const uid = (p = 'id') => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
export const todayKey = (d = new Date()) => d.toISOString().slice(0, 10)

export const brasaStore = {
  subscribe(l) { listeners.add(l); return () => listeners.delete(l) },
  getSnapshot: () => state,

  // — Produtos (controle do monstro) —
  upsertProduct(p) {
    const rec = { available: true, featured: false, oldPrice: null, ...p, id: p.id || uid('prod') }
    rec.price = Number(rec.price) || 0
    rec.oldPrice = rec.oldPrice === '' || rec.oldPrice == null ? null : Number(rec.oldPrice)
    const list = state.products.some(r => r.id === rec.id)
      ? state.products.map(r => (r.id === rec.id ? rec : r))
      : [rec, ...state.products]
    set({ products: list })
    return rec
  },
  removeProduct(id) { set({ products: state.products.filter(p => p.id !== id) }) },
  toggleAvailable(id) { set({ products: state.products.map(p => p.id === id ? { ...p, available: !p.available } : p) }) },
  resetCatalog() { set({ products: DEFAULT_PRODUCTS }) },

  // — Cupons —
  upsertCoupon(c) {
    const code = String(c.code || '').trim().toUpperCase()
    if (!code) return null
    const rec = { code, percent: Math.min(90, Math.max(1, Number(c.percent) || 10)), active: c.active !== false }
    const list = state.coupons.some(r => r.code === rec.code)
      ? state.coupons.map(r => (r.code === rec.code ? rec : r))
      : [...state.coupons, rec]
    set({ coupons: list })
    return rec
  },
  removeCoupon(code) { set({ coupons: state.coupons.filter(c => c.code !== code) }) },
  validCoupon(code) {
    const f = state.coupons.find(c => c.code === String(code || '').trim().toUpperCase())
    return f && f.active ? f : null
  },

  // — Pedidos / Vendas (onboarding completo) —
  createOrder({ customer, items, subtotal, discount, total, payment, coupon, address, obs }) {
    const order = {
      id: uid('ped').toUpperCase(),
      createdAt: new Date().toISOString(),
      customer: { name: customer?.name || 'Cliente', phone: customer?.phone || '' },
      address: address || '', obs: obs || '',
      items: items.map(i => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price })),
      subtotal, discount: discount || 0, total, payment: payment || 'Pix', coupon: coupon || '',
      status: 'Novo',
    }
    set({ orders: [order, ...state.orders] })
    // CRM: cria/atualiza cliente
    const phone = (order.customer.phone || '').replace(/\D/g, '')
    if (phone || order.customer.name) {
      const key = phone || order.customer.name.toLowerCase()
      const found = state.customers.find(c => (c.phone.replace(/\D/g, '') || c.name.toLowerCase()) === key)
      if (found) {
        set({
          customers: state.customers.map(c => c.id === found.id ? {
            ...c, name: order.customer.name || c.name, orders: c.orders + 1,
            total: +(c.total + total).toFixed(2), lastAt: order.createdAt,
          } : c),
        })
      } else {
        set({
          customers: [{ id: uid('cli'), name: order.customer.name, phone: order.customer.phone, orders: 1, total, lastAt: order.createdAt, createdAt: order.createdAt }, ...state.customers],
        })
      }
    }
    return order
  },
  setOrderStatus(id, status) { set({ orders: state.orders.map(o => o.id === id ? { ...o, status } : o) }) },
  // Ajusta qtd de um item do pedido (igual o stepper do carrinho) e recalcula totais.
  // zera (0) remove a linha. Desconto proporcional mantido; taxa de entrega preservada.
  updateOrderItem(orderId, itemId, qty) {
    const q = Math.max(0, Math.min(99, Math.round(Number(qty) || 0)))
    set({
      orders: state.orders.map(o => {
        if (o.id !== orderId) return o
        const items = o.items.map(i => (i.id === itemId ? { ...i, qty: q } : i)).filter(i => i.qty > 0)
        const subtotal = +items.reduce((s, i) => s + i.qty * i.price, 0).toFixed(2)
        const ratio = o.subtotal > 0 ? (o.discount || 0) / o.subtotal : 0
        const discount = +(subtotal * ratio).toFixed(2)
        const delivery = Math.max(0, +((o.total || 0) - ((o.subtotal || 0) - (o.discount || 0))).toFixed(2))
        return { ...o, items, subtotal, discount, total: +(subtotal - discount + delivery).toFixed(2) }
      }),
    })
  },
  removeOrder(id) { set({ orders: state.orders.filter(o => o.id !== id) }) },
  clearOrders() { set({ orders: [] }) },

  // — CRM manual —
  upsertCustomer(c) {
    const rec = { orders: 0, total: 0, ...c, id: c.id || uid('cli') }
    set({ customers: state.customers.some(r => r.id === rec.id) ? state.customers.map(r => r.id === rec.id ? rec : r) : [rec, ...state.customers] })
    return rec
  },
  removeCustomer(id) { set({ customers: state.customers.filter(c => c.id !== id) }) },

  // — Loja —
  setSettings(patch) { set({ settings: { ...state.settings, ...patch } }) },
  resetAll() {
    localStorage.removeItem(K.products); localStorage.removeItem(K.orders)
    localStorage.removeItem(K.customers); localStorage.removeItem(K.coupons); localStorage.removeItem(K.settings)
    state = { products: DEFAULT_PRODUCTS, orders: [], customers: [], coupons: DEFAULT_COUPONS, settings: DEFAULT_SETTINGS }
    emit()
  },
}

export function useBrasa() {
  return useSyncExternalStore(brasaStore.subscribe, brasaStore.getSnapshot, brasaStore.getSnapshot)
}

// Métricas p/ dashboard
export function salesMetrics(orders, days = 7) {
  const map = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    map[d.toISOString().slice(0, 10)] = 0
  }
  let revenue = 0
  const valid = orders.filter(o => o.status !== 'Cancelado')
  valid.forEach(o => {
    revenue += Number(o.total) || 0
    const k = String(o.createdAt).slice(0, 10)
    if (k in map) map[k] += Number(o.total) || 0
  })
  const today = todayKey()
  const todayOrders = orders.filter(o => String(o.createdAt).slice(0, 10) === today && o.status !== 'Cancelado')
  const chart = Object.entries(map).map(([date, total]) => ({
    dia: date.slice(8, 10) + '/' + date.slice(5, 7), total: +total.toFixed(2),
  }))
  return {
    revenue, count: valid.length,
    ticket: valid.length ? revenue / valid.length : 0,
    todayRevenue: todayOrders.reduce((s, o) => s + (Number(o.total) || 0), 0),
    todayCount: todayOrders.length,
    chart,
  }
}

export function topProducts(orders, limit = 5) {
  const m = {}
  orders.filter(o => o.status !== 'Cancelado').forEach(o => o.items?.forEach(i => {
    m[i.name] = m[i.name] || { name: i.name, qty: 0, total: 0 }
    m[i.name].qty += Number(i.qty) || 0
    m[i.name].total += (Number(i.qty) || 0) * (Number(i.price) || 0)
  }))
  return Object.values(m).sort((a, b) => b.qty - a.qty).slice(0, limit)
}
