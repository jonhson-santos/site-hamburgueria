import { Settings, LogOut } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { useTemplate } from '../../context/TemplateContext'
import './Navbar.css'
export default function Navbar({ onLeave }) {
  const { platform } = useTemplate()
  return <nav className="navbar" aria-label="Menu principal">
    <div className="nav-left"><Link to="/" className="nav-logo">{platform.name}</Link>
      <div className="nav-links nav-links-desktop">
        <NavLink to="/" end>Início</NavLink><NavLink to="/tutoriais">Tutoriais</NavLink><NavLink to="/favoritos">Favoritos</NavLink>
      </div>
    </div>
    <div className="nav-right"><Link to="/admin" className="nav-admin-toggle" title="Gerenciar tutoriais"><Settings size={20} /></Link><button onClick={onLeave} className="logout-btn" title="Voltar à entrada" aria-label="Voltar à entrada"><LogOut size={20} /></button></div>
  </nav>
}
