import { Copy, Save, Trash2, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import './CardPreview.css'

function CardPreview({ metadata, evidenceText, onSave, onClear, isEditing }) {
  const [copied, setCopied] = useState(false)

  const formatCitation = () => {
    const parts = []
    if (metadata.author) parts.push(metadata.author)
    if (metadata.date) parts.push(metadata.date)
    
    const details = []
    if (metadata.title) details.push(`"${metadata.title}"`)
    if (metadata.publication) details.push(metadata.publication)
    
    if (details.length > 0) {
      parts.push(`(${details.join(', ')})`)
    }
    
    return parts.join(' ')
  }

  const getPlainText = (html) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.innerText
  }

  const copyToClipboard = () => {
    const citation = formatCitation()
    const pocket = metadata.pocket ? `[${metadata.pocket}]` : ''
    const text = getPlainText(evidenceText)
    
    const fullCard = `${pocket}\n${citation}\n\n${text}`
    
    navigator.clipboard.writeText(fullCard).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const canSave = metadata.author && metadata.date && metadata.pocket && evidenceText

  return (
    <div className="card preview-card">
      <h2 className="card-title">Card Preview</h2>

      <div className="preview-content">
        {metadata.pocket && (
          <div className="preview-pocket">[{metadata.pocket}]</div>
        )}
        
        {formatCitation() && (
          <div className="preview-citation">{formatCitation()}</div>
        )}
        
        {evidenceText && (
          <div 
            className="preview-text"
            dangerouslySetInnerHTML={{ __html: evidenceText }}
          />
        )}

        {!metadata.pocket && !formatCitation() && !evidenceText && (
          <div className="preview-empty">
            Fill in source info and paste evidence to see preview
          </div>
        )}
      </div>

      <div className="preview-actions">
        <button 
          onClick={copyToClipboard}
          disabled={!canSave}
          className="btn btn-secondary"
        >
          {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <button 
          onClick={onClear}
          className="btn btn-danger"
        >
          <Trash2 size={18} />
        </button>

        <button 
          onClick={onSave}
          disabled={!canSave}
          className="btn btn-primary btn-save"
        >
          <Save size={18} />
          {isEditing ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default CardPreview
