import { FileText, Plus, Library } from 'lucide-react'
import './Header.css'

function Header({ onNewCard, onToggleSaved, showSaved, cardCount }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <FileText size={28} strokeWidth={2.5} />
          <h1>Card Cutter</h1>
        </div>
        
        <div className="header-right">
          <button className="btn btn-secondary" onClick={onNewCard}>
            <Plus size={20} />
            New
          </button>
          
          <button 
            className={`btn ${showSaved ? 'btn-primary' : 'btn-secondary'}`}
            onClick={onToggleSaved}
          >
            <Library size={20} />
            Library ({cardCount})
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
