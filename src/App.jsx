import { useState, useEffect } from 'react'
import Header from './components/Header'
import URLInput from './components/URLInput'
import Editor from './components/Editor'
import CardPreview from './components/CardPreview'
import SavedCards from './components/SavedCards'
import './App.css'

function App() {
  const [metadata, setMetadata] = useState({
    author: '',
    date: '',
    title: '',
    publication: '',
    url: '',
    pocket: ''
  })

  const [evidenceText, setEvidenceText] = useState('')
  const [savedCards, setSavedCards] = useState([])
  const [showSaved, setShowSaved] = useState(false)
  const [editingCard, setEditingCard] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('debateCards')
    if (saved) {
      setSavedCards(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('debateCards', JSON.stringify(savedCards))
  }, [savedCards])

  const saveCard = () => {
    const card = {
      id: editingCard?.id || Date.now(),
      ...metadata,
      evidenceText,
      createdAt: editingCard?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingCard) {
      setSavedCards(savedCards.map(c => c.id === editingCard.id ? card : c))
      setEditingCard(null)
    } else {
      setSavedCards([card, ...savedCards])
    }

    clearForm()
  }

  const clearForm = () => {
    setMetadata({
      author: '',
      date: '',
      title: '',
      publication: '',
      url: '',
      pocket: ''
    })
    setEvidenceText('')
  }

  const loadCard = (card) => {
    setMetadata({
      author: card.author,
      date: card.date,
      title: card.title,
      publication: card.publication,
      url: card.url,
      pocket: card.pocket
    })
    setEvidenceText(card.evidenceText)
    setEditingCard(card)
    setShowSaved(false)
  }

  const deleteCard = (id) => {
    setSavedCards(savedCards.filter(c => c.id !== id))
  }

  return (
    <div className="app">
      <Header 
        onNewCard={clearForm}
        onToggleSaved={() => setShowSaved(!showSaved)}
        showSaved={showSaved}
        cardCount={savedCards.length}
      />

      <div className="container">
        {showSaved ? (
          <SavedCards 
            cards={savedCards}
            onLoad={loadCard}
            onDelete={deleteCard}
          />
        ) : (
          <div className="editor-layout">
            <div className="left-panel">
              <URLInput 
                metadata={metadata}
                onMetadataChange={setMetadata}
              />
              <Editor 
                text={evidenceText}
                onChange={setEvidenceText}
              />
            </div>

            <div className="right-panel">
              <CardPreview 
                metadata={metadata}
                evidenceText={evidenceText}
                onSave={saveCard}
                onClear={clearForm}
                isEditing={!!editingCard}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
