// Painel do monstro — Dashboard + Produtos + Pedidos + CRM + Cupons + Loja
import { Fragment, useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { LayoutDashboard, Pizza, ReceiptText, Users, TicketPercent, Store, Plus, Pencil, Trash2, Copy, Search, Download, X, ImagePlus } from 'lucide-react'
import { brasaStore, useBrasa, money, salesMetrics, topProducts, defaultSchedule, scheduleText } from '../store/brasaStore'
import Stepper from '../components/Stepper'
import NumberField from '../components/NumberField'

const CATS = ['Hambúrgueres', 'Combos', 'Porções', 'Bebidas', 'Sobremesas']
const STATUS = ['Novo', 'Preparando', 'Pronto', 'Entregue', 'Cancelado']
const TABS = [
  { id: 'dash', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'prod', label: 'Produtos', icon: Pizza },
  { id: 'orders', label: 'Pedidos', icon: ReceiptText },
  { id: 'crm', label: 'Clientes', icon: Users },
  { id: 'coupons', label: 'Cupons', icon: TicketPercent },
  { id: 'store', label: 'Loja', icon: Store },
]

function toCSV(rows) {
  if (!rows.length) return ''
  const head = Object.keys(rows[0])
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [head.join(';'), ...rows.map(r => head.map(h => esc(r[h])).join(';'))].join('\n')
}
// Enquanto um modal estiver aberto, trava o scroll do fundo (some a 2ª barra).
function useLockAdminScroll() {
  useEffect(() => {
    const body = document.querySelector('.bp-admin-overlay .bp-admin-body')
    if (!body) return
    body.classList.add('bp-locked')
    return () => body.classList.remove('bp-locked')
  }, [])
}
function download(name, text) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['\ufeff' + text], { type: 'text/csv;charset=utf-8' }))
  a.download = name; a.click(); URL.revokeObjectURL(a.href)
}
function fileToImage(file, max = 800) {
  return new Promise(res => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      res(c.toDataURL('image/jpeg', 0.82))
    }
    const r = new FileReader()
    r.onload = e => { img.src = e.target.result }
    r.readAsDataURL(file)
  })
}
const discountPct = p => (p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0)

export default function AdminPanel({ onClose }) {
  const { products, orders, customers, coupons, settings } = useBrasa()
  const [tab, setTab] = useState('dash')
  const m = useMemo(() => salesMetrics(orders), [orders])
  const top = useMemo(() => topProducts(orders), [orders])

  return (
    <div className="bp-admin-overlay" role="dialog" aria-label="Painel administrativo">
      <div className="bp-admin-top">
        <div className="bp-admin-brand">BRASA<b>PRIME</b> ADMIN<small>CONTROLE DO MONSTRO</small></div>
        <button className="bp-admin-close" onClick={onClose}>Sair ✕</button>
      </div>
      <div className="bp-admin-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`bp-admin-tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
            <t.icon size={15} />{t.label}
            {t.id === 'orders' && orders.filter(o => o.status === 'Novo').length > 0 && (
              <span className="bp-badge">{orders.filter(o => o.status === 'Novo').length}</span>
            )}
          </button>
        ))}
      </div>
      <div className="bp-admin-body">
        {tab === 'dash' && <Dash m={m} orders={orders} customers={customers} products={products} top={top} go={setTab} />}
        {tab === 'prod' && <Products products={products} />}
        {tab === 'orders' && <Orders orders={orders} />}
        {tab === 'crm' && <CRM customers={customers} orders={orders} />}
        {tab === 'coupons' && <Coupons coupons={coupons} />}
        {tab === 'store' && <StoreTab settings={settings} />}
      </div>
    </div>
  )
}

function Dash({ m, orders, customers, products, top, go }) {
  return (
    <>
      <div className="bp-kpis">
        <div className="bp-kpi"><span>Hoje</span><strong>{money(m.todayRevenue)}</strong><em>{m.todayCount} pedidos</em></div>
        <div className="bp-kpi"><span>Faturamento</span><strong>{money(m.revenue)}</strong><em>{m.count} vendas válidas</em></div>
        <div className="bp-kpi"><span>Ticket médio</span><strong>{money(m.ticket)}</strong><em>por pedido</em></div>
        <div className="bp-kpi"><span>Clientes</span><strong>{customers.length}</strong><em>{products.filter(p => p.available).length}/{products.length} ativos</em></div>
      </div>
      <div className="bp-card">
        <h3>Vendas — últimos 7 dias</h3>
        <div className="bp-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={m.chart}>
              <XAxis dataKey="dia" tick={{ fill: '#9c9081', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{ fill: '#2c251d' }} contentStyle={{ background: '#100d0a', border: '1px solid #3a3128', borderRadius: 8, color: '#fff' }} formatter={v => [money(v), 'Total']} />
              <Bar dataKey="total" fill="#f58518" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bp-row">
        <div className="bp-card" style={{ flex: 1, minWidth: 260 }}>
          <h3>Mais vendidos</h3>
          {top.length === 0 ? <p className="bp-note">Sem vendas ainda. Assim que entrar pedido pelo site, aparece aqui.</p> : top.map(t => (
            <div key={t.name} className="bp-row" style={{ justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #221d17' }}>
              <span style={{ fontSize: 13 }}>{t.name} <b style={{ color: '#f58518' }}>×{t.qty}</b></span>
              <b style={{ fontSize: 13 }}>{money(t.total)}</b>
            </div>
          ))}
        </div>
        <div className="bp-card" style={{ flex: 1, minWidth: 260 }}>
          <h3>Últimos pedidos</h3>
          {orders.slice(0, 4).map(o => (
            <div key={o.id} className="bp-row" style={{ justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ fontSize: 13 }}>{o.customer?.name} · {o.items?.reduce((s, i) => s + i.qty, 0)} itens</span>
              <span className="bp-badge">{o.status}</span>
            </div>
          ))}
          {!orders.length && <p className="bp-note">Nenhum pedido registrado.</p>}
          <div className="bp-row" style={{ marginTop: 10 }}>
            <button className="bp-btn sm ghost" onClick={() => go('orders')}>Ver todos</button>
            <button className="bp-btn sm" onClick={() => go('prod')}><Plus size={14} /> Novo produto</button>
          </div>
        </div>
      </div>
    </>
  )
}

function Products({ products }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todas')
  const [editing, setEditing] = useState(null) // null | {} | produto
  const list = products.filter(p =>
    (cat === 'Todas' || p.menuCategory === cat) &&
    (`${p.name} ${p.description}`.toLowerCase().includes(q.toLowerCase()))
  )
  return (
    <>
      <div className="bp-row" style={{ marginBottom: 12 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: '#8a7f70' }} />
          <input className="bp-input" style={{ paddingLeft: 34 }} placeholder="Buscar produto..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <select className="bp-select" value={cat} onChange={e => setCat(e.target.value)}>
          <option>Todas</option>{CATS.map(c => <option key={c}>{c}</option>)}
        </select>
        <button className="bp-btn sm" onClick={() => setEditing({})}><Plus size={14} /> Adicionar</button>
      </div>
      <div className="bp-list">
        {list.map(p => (
          <div className="bp-item" key={p.id} style={{ opacity: p.available ? 1 : 0.55 }}>
            {p.image ? <img src={p.image} alt="" loading="lazy" /> : <div style={{ width: 64, height: 64, borderRadius: 9, background: '#000', display: 'grid', placeItems: 'center', fontSize: 11, color: '#888' }}>sem foto</div>}
            <div className="grow">
              <strong>{p.name} {discountPct(p) > 0 && <span className="bp-badge">-{discountPct(p)}%</span>}</strong>
              <span>{p.menuCategory} · {money(p.price)}{p.available ? '' : ' · PAUSADO'}</span>
            </div>
            <div className="bp-actions">
              <button className={`bp-switch ${p.available ? 'on' : ''}`} title="Disponível / indisponível" onClick={() => brasaStore.toggleAvailable(p.id)} />
              <button className="bp-iconbtn" title="Editar" onClick={() => setEditing(p)}><Pencil size={15} /></button>
              <button className="bp-iconbtn" title="Duplicar" onClick={() => brasaStore.upsertProduct({ ...p, id: undefined, name: p.name + ' (cópia)' })}><Copy size={15} /></button>
              <button className="bp-iconbtn" title="Remover" onClick={() => confirm(`Remover "${p.name}" do cardápio?`) && brasaStore.removeProduct(p.id)}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {!list.length && <div className="bp-empty">Nada por aqui. Adicione o primeiro produto 👆</div>}
      </div>
      {editing !== null && <ProductForm initial={editing} onClose={() => setEditing(null)} />}
    </>
  )
}

function ProductForm({ initial, onClose }) {
  useLockAdminScroll()
  const isNew = !initial.id
  const [f, setF] = useState({
    name: '', description: '', price: '', oldPrice: '', menuCategory: 'Hambúrgueres', category: 'Carne',
    image: '', available: true, featured: false, ...initial, price: initial.price ?? '', oldPrice: initial.oldPrice ?? '',
  })
  const set = k => e => setF({ ...f, [k]: e.target?.type === 'checkbox' ? e.target.checked : e.target.value })
  return (
    <div className="bp-modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bp-sheet">
        <h2>{isNew ? 'Novo produto' : 'Editar produto'}</h2>
        <p className="sub">Preço, desconto, foto e disponibilidade — tudo reflete na hora no site.</p>
        {f.image && <img className="bp-preview" src={f.image} alt="" style={{ marginBottom: 10 }} />}
        <div className="bp-field"><label>Foto — URL ou upload</label>
          <input className="bp-input" placeholder="https://... ou /media/..." value={f.image} onChange={set('image')} />
          <label className="bp-btn ghost sm" style={{ marginTop: 8, cursor: 'pointer' }}><ImagePlus size={14} /> Enviar do celular/PC
            <input type="file" accept="image/*" hidden onChange={async e => { const file = e.target.files?.[0]; if (file) setF({ ...f, image: await fileToImage(file) }) }} />
          </label>
        </div>
        <div className="bp-field"><label>Nome</label><input className="bp-input" value={f.name} onChange={set('name')} placeholder="Ex: Brasa Prime Bacon" /></div>
        <div className="bp-field"><label>Descrição</label><textarea className="bp-text" rows={2} value={f.description} onChange={set('description')} /></div>
        <div className="bp-price-rows">
          <div className="bp-price-row"><span>Preço de venda</span><NumberField value={f.price} onChange={v => setF({ ...f, price: v })} step={1} prefix="R$" label="Preço de venda" /></div>
          <div className="bp-price-row"><span>De <small>(riscado, opcional)</small></span><NumberField value={f.oldPrice} onChange={v => setF({ ...f, oldPrice: v })} step={1} prefix="R$" placeholder="—" label="Preço antigo riscado" /></div>
        </div>
        <div className="bp-grid2">
          <div className="bp-field"><label>Categoria</label>
            <select className="bp-select" style={{ width: '100%' }} value={f.menuCategory} onChange={set('menuCategory')}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
          <div className="bp-field"><label>Tipo</label><input className="bp-input" value={f.category} onChange={set('category')} placeholder="Carne / Frango..." /></div>
        </div>
        <div className="bp-row">
          <label className="bp-row" style={{ gap: 8, fontSize: 13 }}><button type="button" className={`bp-switch ${f.available ? 'on' : ''}`} onClick={() => setF({ ...f, available: !f.available })} /> Disponível p/ venda</label>
          <label className="bp-row" style={{ gap: 8, fontSize: 13 }}><button type="button" className={`bp-switch ${f.featured ? 'on' : ''}`} onClick={() => setF({ ...f, featured: !f.featured })} /> Destaque</label>
        </div>
        <div className="bp-row" style={{ marginTop: 14 }}>
          <button className="bp-btn" style={{ flex: 1 }} onClick={() => {
            if (!f.name.trim() || !Number(f.price)) return alert('Preencha nome e preço.')
            brasaStore.upsertProduct({ ...f, price: Number(f.price), oldPrice: f.oldPrice === '' ? null : Number(f.oldPrice) })
            onClose()
          }}>Salvar produto</button>
          <button className="bp-btn ghost" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

function Orders({ orders }) {
  const [st, setSt] = useState('Todos')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)
  const list = orders.filter(o =>
    (st === 'Todos' || o.status === st) &&
    (`${o.customer?.name} ${o.id} ${o.customer?.phone}`.toLowerCase().includes(q.toLowerCase()))
  )
  return (
    <>
      <div className="bp-row" style={{ marginBottom: 12 }}>
        <input className="bp-input" style={{ flex: 1, minWidth: 150 }} placeholder="Buscar nome, fone ou nº..." value={q} onChange={e => setQ(e.target.value)} />
        <select className="bp-select" value={st} onChange={e => setSt(e.target.value)}>
          <option>Todos</option>{STATUS.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="bp-btn ghost sm" onClick={() => download('vendas-brasa.csv', toCSV(orders.map(o => ({ numero: o.id, data: new Date(o.createdAt).toLocaleString('pt-BR'), cliente: o.customer?.name, fone: o.customer?.phone, itens: o.items?.map(i => `${i.qty}x ${i.name}`).join(' | '), total: o.total, status: o.status, pagamento: o.payment }))))}><Download size={14} /> CSV</button>
      </div>
      {/* desktop: tabela | mobile: cards (mesmo markup, CSS resolve) */}
      <div className="bp-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="bp-table-scroll">
        <table className="bp-table">
          <thead><tr><th>Pedido</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {list.map(o => (
              <Fragment key={o.id}>
                <tr>
                  <td><b>{o.customer?.name}</b><br /><span style={{ color: '#9c9081' }}>{o.id.slice(-6)} · {new Date(o.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span></td>
                  <td><b>{money(o.total)}</b><br /><span style={{ color: '#9c9081', fontSize: 11 }}>{o.items?.reduce((s, i) => s + i.qty, 0)} itens</span></td>
                  <td><select className="bp-status" value={o.status} onChange={e => brasaStore.setOrderStatus(o.id, e.target.value)}>{STATUS.map(s => <option key={s}>{s}</option>)}</select></td>
                  <td><button className="bp-btn ghost sm" onClick={() => setOpen(open === o.id ? null : o.id)}>{open === o.id ? 'Fechar' : 'Ver'}</button></td>
                </tr>
                {open === o.id && (
                  <tr><td colSpan={4} style={{ background: '#14110d' }}>
                    <div className="bp-note" style={{ marginBottom: 8 }}>Ajuste as quantidades com o stepper — o total recalcula sozinho. Zerar remove o item.</div>
                    {o.items?.map(i => (
                      <div key={i.id} className="bp-order-item">
                        <span className="bp-order-item-name">{i.name}<small>{money(i.price)} cada</small></span>
                        <Stepper dark value={i.qty} label={`Quantidade de ${i.name} no pedido ${o.id.slice(-6)}`}
                          onMinus={() => brasaStore.updateOrderItem(o.id, i.id, i.qty - 1)}
                          onPlus={() => brasaStore.updateOrderItem(o.id, i.id, i.qty + 1)} />
                        <b className="bp-order-item-total">{money(i.qty * i.price)}</b>
                      </div>
                    ))}
                    {!o.items?.length && <div className="bp-empty">Pedido sem itens. Exclua ou aguarde novo pedido.</div>}
                    <div className="bp-row" style={{ justifyContent: 'flex-end', marginTop: 8, fontSize: 13 }}>
                      <span style={{ color: '#9c9081' }}>Subtotal {money(o.subtotal)}{(o.discount > 0 ? ` · Desc. −${money(o.discount)}` : '')} · </span>
                      <b>Total {money(o.total)}</b>
                    </div>
                    <div className="bp-note" style={{ marginTop: 8 }}>Fone: {o.customer?.phone || '—'} · Entrega: {o.address || 'retirada'} · Pgto: {o.payment}{o.coupon ? ` · Cupom ${o.coupon}` : ''}{o.obs ? ` · Obs: ${o.obs}` : ''}</div>
                    <div className="bp-row" style={{ marginTop: 8 }}>
                      <a className="bp-btn sm" style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer" href={`https://wa.me/${(o.customer?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${o.customer?.name}! Aqui é da Brasa Prime — pedido ${o.id.slice(-6)} (${o.status}).`)}`}>Chamar no WhatsApp</a>
                      <button className="bp-btn danger sm" onClick={() => confirm('Excluir pedido?') && brasaStore.removeOrder(o.id)}><Trash2 size={13} /> Excluir</button>
                    </div>
                  </td></tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        </div>
        {!list.length && <div className="bp-empty">Sem pedidos com esse filtro. Faça um pedido teste no site 👌</div>}
      </div>
      {orders.length > 0 && <button className="bp-btn danger sm" onClick={() => confirm('Apagar TODO o histórico de vendas?') && brasaStore.clearOrders()}>Limpar histórico</button>}
    </>
  )
}

function CRM({ customers, orders }) {
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const list = [...customers]
    .filter(c => `${c.name} ${c.phone}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.total - a.total)
  const recorrentes = customers.filter(c => c.orders > 1).length
  return (
    <>
      <div className="bp-kpis" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className="bp-kpi"><span>Clientes</span><strong>{customers.length}</strong></div>
        <div className="bp-kpi"><span>Recorrentes</span><strong>{recorrentes}</strong><em>{customers.length ? Math.round(recorrentes / customers.length * 100) : 0}% recompram</em></div>
        <div className="bp-kpi"><span>LTV médio</span><strong>{money(customers.length ? customers.reduce((s, c) => s + c.total, 0) / customers.length : 0)}</strong></div>
      </div>
      <div className="bp-row" style={{ marginBottom: 12 }}>
        <input className="bp-input" style={{ flex: 1 }} placeholder="Buscar cliente..." value={q} onChange={e => setQ(e.target.value)} />
        <button className="bp-btn sm" onClick={() => setAdding(true)}><Plus size={14} /> Cliente</button>
        <button className="bp-btn ghost sm" onClick={() => download('clientes-brasa.csv', toCSV(customers.map(c => ({ nome: c.name, fone: c.phone, pedidos: c.orders, total: c.total, ultimo: c.lastAt }))))}><Download size={14} /> CSV</button>
      </div>
      <div className="bp-list">
        {list.map(c => (
          <div className="bp-item" key={c.id}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#2c1c10', display: 'grid', placeItems: 'center', fontWeight: 800, color: '#ff9b37' }}>{(c.name || '?')[0]?.toUpperCase()}</div>
            <div className="grow"><strong>{c.name}</strong><span>{c.phone || 'sem fone'} · {c.orders} pedido(s) · última: {c.lastAt ? new Date(c.lastAt).toLocaleDateString('pt-BR') : '—'}</span></div>
            <b className="bp-price">{money(c.total)}</b>
            <div className="bp-actions">
              <a className="bp-iconbtn" title="WhatsApp" target="_blank" rel="noreferrer" href={`https://wa.me/${(c.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${c.name}! Sentimos sua falta na Brasa Prime 🔥 Que tal um cupom VOLTEI10?`)}`}>✆</a>
              <button className="bp-iconbtn" onClick={() => confirm(`Remover ${c.name}?`) && brasaStore.removeCustomer(c.id)}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {!list.length && <div className="bp-empty">Nenhum cliente ainda — eles entram aqui sozinhos a cada checkout. Ou cadastre manual 👆</div>}
      </div>
      {adding && <CustomerForm onClose={() => setAdding(false)} />}
    </>
  )
}

function CustomerForm({ onClose }) {
  useLockAdminScroll()
  const [f, setF] = useState({ name: '', phone: '' })
  return (
    <div className="bp-modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bp-sheet">
        <h2>Novo cliente</h2><p className="sub">Cadastro manual pro CRM.</p>
        <div className="bp-field"><label>Nome</label><input className="bp-input" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>
        <div className="bp-field"><label>WhatsApp</label><input className="bp-input" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} placeholder="(11) 99999-9999" /></div>
        <div className="bp-row"><button className="bp-btn" style={{ flex: 1 }} onClick={() => { if (!f.name.trim()) return alert('Nome obrigatório'); brasaStore.upsertCustomer({ ...f, orders: 0, total: 0, lastAt: new Date().toISOString(), createdAt: new Date().toISOString() }); onClose() }}>Salvar</button>
          <button className="bp-btn ghost" onClick={onClose}>Cancelar</button></div>
      </div>
    </div>
  )
}

function Coupons({ coupons }) {
  const [f, setF] = useState({ code: '', percent: 10 })
  return (
    <>
      <div className="bp-card">
        <h3>Criar cupom de desconto</h3>
        <div className="bp-row">
          <input className="bp-input" style={{ flex: 1, minWidth: 120, textTransform: 'uppercase' }} placeholder="EX: VOLTEI10" value={f.code} onChange={e => setF({ ...f, code: e.target.value.toUpperCase() })} />
          <select className="bp-select" value={f.percent} onChange={e => setF({ ...f, percent: Number(e.target.value) })}>
            {[5, 10, 15, 20, 25, 30, 50].map(p => <option key={p} value={p}>{p}% off</option>)}
          </select>
          <button className="bp-btn sm" onClick={() => { if (!f.code.trim()) return; brasaStore.upsertCoupon(f); setF({ code: '', percent: 10 }) }}><Plus size={14} /> Criar</button>
        </div>
      </div>
      <div className="bp-list">
        {coupons.map(c => (
          <div className="bp-item" key={c.code}>
            <div className="grow"><strong>{c.code} <span className="bp-badge">{c.percent}% OFF</span></strong><span>{c.active ? 'Ativo no checkout' : 'Pausado'}</span></div>
            <button className={`bp-switch ${c.active ? 'on' : ''}`} onClick={() => brasaStore.upsertCoupon({ ...c, active: !c.active })} />
            <button className="bp-iconbtn" onClick={() => confirm(`Excluir cupom ${c.code}?`) && brasaStore.removeCoupon(c.code)}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </>
  )
}

const TIME_OPTIONS = []
for (let h = 0; h < 24; h++) {
  for (const m of ['00', '30']) TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${m}`)
}

function StoreTab({ settings: s }) {
  const [f, setF] = useState({ ...s, schedule: Array.isArray(s.schedule) && s.schedule.length ? s.schedule : defaultSchedule() })
  const [pass, setPass] = useState('')
  const dirty = JSON.stringify({ ...f, hours: scheduleText(f.schedule) }) !== JSON.stringify({ ...s, hours: s.hours })
  const set = k => e => setF({ ...f, [k]: e.target?.type === 'checkbox' ? e.target.checked : e.target.value })
  const setDay = (idx, patch) => setF({ ...f, schedule: f.schedule.map((d, i) => (i === idx ? { ...d, ...patch } : d)) })
  const copyMonday = () => {
    const mon = f.schedule[0]
    setF({ ...f, schedule: f.schedule.map(d => ({ ...d, from: mon.from, to: mon.to })) })
  }
  const saveStore = () => brasaStore.setSettings({ ...f, hours: scheduleText(f.schedule) || f.hours })
  return (
    <>
      <div className="bp-card">
        <h3>Loja {s.storeOpen ? <span className="bp-badge ok">ABERTA</span> : <span className="bp-badge off">FECHADA</span>}</h3>
        <label className="bp-row" style={{ gap: 10, fontSize: 14, fontWeight: 700 }}><button className={`bp-switch ${f.storeOpen ? 'on' : ''}`} onClick={() => setF({ ...f, storeOpen: !f.storeOpen })} /> Loja aberta p/ pedidos</label>
        <p className="bp-note">Fechada = banner no topo do site avisando o cliente.</p>
      </div>
      <div className="bp-card">
        <h3>Dados & entrega</h3>
        <div className="bp-field"><label>WhatsApp (só números, com DDI)</label><input className="bp-input" value={f.whatsapp} onChange={set('whatsapp')} /></div>
        <div className="bp-field"><label>Endereço</label><input className="bp-input" value={f.address} onChange={set('address')} /></div>
        <div className="bp-field">
          <label>Horários de funcionamento</label>
          <div className="bp-sched">
            {f.schedule.map((d, i) => (
              <div key={d.d} className={`bp-sched-row ${d.open ? '' : 'off'}`}>
                <span className="bp-sched-day">{d.d}</span>
                <button type="button" className={`bp-switch ${d.open ? 'on' : ''}`} onClick={() => setDay(i, { open: !d.open })} aria-label={`${d.d} aberto ou fechado`} />
                {d.open ? (
                  <>
                    <select className="bp-select" value={d.from} onChange={e => setDay(i, { from: e.target.value })} aria-label={`Abre ${d.d}`}>
                      {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="bp-note">às</span>
                    <select className="bp-select" value={d.to} onChange={e => setDay(i, { to: e.target.value })} aria-label={`Fecha ${d.d}`}>
                      {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </>
                ) : (
                  <span className="bp-note">Fechado</span>
                )}
              </div>
            ))}
          </div>
          <div className="bp-row" style={{ marginTop: 8 }}>
            <button type="button" className="bp-btn ghost sm" onClick={copyMonday}>Repetir 2ª feira em todos</button>
          </div>
          <p className="bp-note" style={{ marginTop: 8 }}>No site aparece assim: <b>{scheduleText(f.schedule)}</b></p>
        </div>
        <div className="bp-field"><label>Aviso no topo (ex: promo do dia — vazio = some)</label><input className="bp-input" value={f.announcement} onChange={set('announcement')} /></div>
        <div className="bp-price-rows">
          <div className="bp-price-row"><span>Taxa de entrega</span><NumberField value={f.deliveryFee} onChange={v => setF({ ...f, deliveryFee: v === '' ? 0 : v })} step={1} prefix="R$" label="Taxa de entrega" /></div>
          <div className="bp-price-row"><span>Grátis acima de</span><NumberField value={f.freeAbove} onChange={v => setF({ ...f, freeAbove: v === '' ? 0 : v })} step={5} prefix="R$" label="Grátis acima de" /></div>
        </div>
        <div className="bp-field"><label>Chave Pix</label><input className="bp-input" value={f.pixKey} onChange={set('pixKey')} /></div>
        {dirty && <button className="bp-btn" onClick={saveStore}>Salvar loja</button>}
      </div>
      <div className="bp-card">
        <h3>Senha do admin</h3>
        <div className="bp-row"><input className="bp-input" style={{ flex: 1 }} type="text" placeholder="Nova senha" value={pass} onChange={e => setPass(e.target.value)} />
          <button className="bp-btn sm" onClick={() => { if (pass.trim().length < 4) return alert('Mínimo 4 caracteres'); brasaStore.setSettings({ adminPass: pass.trim() }); setPass(''); alert('Senha trocada!') }}>Trocar</button></div>
      </div>
      <div className="bp-card">
        <h3>Zona de perigo</h3>
        <div className="bp-row">
          <button className="bp-btn ghost sm" onClick={() => confirm('Restaurar cardápio original?') && brasaStore.resetCatalog()}>Restaurar cardápio</button>
          <button className="bp-btn danger sm" onClick={() => confirm('APAGAR TUDO (produtos, vendas, clientes)?') && brasaStore.resetAll()}><Trash2 size={13} /> Zerar tudo</button>
        </div>
      </div>
    </>
  )
}
