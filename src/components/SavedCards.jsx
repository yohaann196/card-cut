import { useState } from 'react'
import { Search, Edit, Trash2, Calendar, ExternalLink } from 'lucide-react'
import './SavedCards.css'

function SavedCards({ cards, onLoad, onDelete }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCards = cards.filter(card => {
    const query = searchQuery.toLowerCase()
    return (
      card.pocket?.toLowerCase().includes(query) ||
      card.author?.toLowerCase().includes(query) ||
      card.publication?.toLowerCase().includes(query) ||
      card.evidenceText?.toLowerCase().includes(query)
    )
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPreview = (html) => {
    const div = document.createElement('div')
    div.innerHTML = html
    const text = div.textContent || div.innerText || ''
    return text.slice(0, 200) + (text.length > 200 ? '...' : '')
  }

  return (
    <div className="saved-cards">
      <div className="saved-header">
        <h2>Saved Cards ({filteredCards.length})</h2>
        
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="cards-grid">
        {filteredCards.length === 0 ? (
          <div className="empty-state">
            <p>{searchQuery ? 'No cards match your search' : 'No saved cards yet. Create your first card!'}</p>
          </div>
        ) : (
          filteredCards.map(card => (
            <div key={card.id} className="saved-card">
              <div className="saved-card-header">
                {card.pocket && (
                  <h3 className="saved-pocket">{card.pocket}</h3>
                )}
                <div className="saved-card-actions">
                  <button 
                    onClick={() => onLoad(card)}
                    className="icon-btn"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('Delete this card?')) {
                        onDelete(card.id)
                      }
                    }}
                    className="icon-btn icon-btn-danger"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="saved-citation">
                {card.author && <span className="cite-author">{card.author}</span>}
                {card.date && <span className="cite-date">{card.date}</span>}
                {card.publication && <span className="cite-pub">{card.publication}</span>}
              </div>

              {card.evidenceText && (
                <p className="saved-preview">{getPreview(card.evidenceText)}</p>
              )}

              <div className="saved-meta">
                <span className="meta-item">
                  <Calendar size={14} />
                  {formatDate(card.updatedAt)}
                </span>
                {card.url && (
                  <a 
                    href={card.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="meta-link"
                  >
                    <ExternalLink size={14} />
                    Source
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SavedCards
