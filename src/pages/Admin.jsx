import { useState } from 'react'
import { LayoutDashboard } from 'lucide-react'
import ModulesTab from '../components/admin/ModulesTab'
import BrandingTab from '../components/admin/BrandingTab'
import './Admin.css'
export default function Admin() {
  const [activeTab, setActiveTab] = useState('content')
  return <div className="admin-dashboard-container"><main className="admin-main-modern full-width">
    <header className="batcave-header"><div className="batcave-title"><LayoutDashboard className="gold-icon" size={28} /><h1>Members Club</h1></div>
      <nav className="batcave-tabs">
        <button className={`batcave-tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Módulos e downloads</button>
        <button className={`batcave-tab ${activeTab === 'branding' ? 'active' : ''}`} onClick={() => setActiveTab('branding')}>Identidade visual</button>
      </nav>
    </header>
    <p className="demo-notice">Prévia do template. Alterações duram até recarregar a página.</p>
    <section className="tab-render-area">{activeTab === 'content' ? <ModulesTab /> : <BrandingTab />}</section>
  </main></div>
}
