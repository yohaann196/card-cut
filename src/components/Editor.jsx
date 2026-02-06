import { useRef, useEffect, useState } from 'react'
import { Info, Settings as SettingsIcon } from 'lucide-react'
import './Editor.css'

function Editor({ text, onChange }) {
  const editorRef = useRef(null)
  const [showSettings, setShowSettings] = useState(false)
  const [colors, setColors] = useState(() => {
    const saved = localStorage.getItem('cardCutterColors')
    return saved ? JSON.parse(saved) : {
      highlight: '#bfdbfe',
      underline: '#2d3748',
      subtext: '#718096'
    }
  })

  useEffect(() => {
    if (editorRef.current && text !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = text
    }
  }, [text])

  useEffect(() => {
    localStorage.setItem('cardCutterColors', JSON.stringify(colors))
    
    const style = document.createElement('style')
    style.id = 'dynamic-card-colors'
    const existing = document.getElementById('dynamic-card-colors')
    if (existing) existing.remove()
    
    style.textContent = `
      .text-editor .highlight-text {
        background: ${colors.highlight} !important;
      }
      .preview-text .highlight-text {
        background: ${colors.highlight} !important;
      }
      .text-editor .underline-text {
        text-decoration-color: ${colors.underline} !important;
        color: ${colors.underline} !important;
      }
      .preview-text .underline-text {
        text-decoration-color: ${colors.underline} !important;
        color: ${colors.underline} !important;
      }
      .text-editor .subtext {
        color: ${colors.subtext} !important;
      }
      .preview-text .subtext {
        color: ${colors.subtext} !important;
      }
    `
    document.head.appendChild(style)
  }, [colors])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!editorRef.current.contains(document.activeElement)) return

      const selection = window.getSelection()
      if (!selection.rangeCount || selection.isCollapsed) return

      if (e.key === '1') {
        e.preventDefault()
        toggleFormat('preset1')
      } else if (e.key === '2') {
        e.preventDefault()
        toggleFormat('preset2')
      } else if (e.key === '3') {
        e.preventDefault()
        toggleFormat('subtext')
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        const range = selection.getRangeAt(0)
        const parent = range.commonAncestorContainer.parentElement
        if (parent && parent.hasAttribute('data-format')) {
          e.preventDefault()
          removeFormat()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleFormat = (preset) => {
    const selection = window.getSelection()
    if (!selection.rangeCount) return

    const range = selection.getRangeAt(0)
    const parent = range.commonAncestorContainer.parentElement

    if (parent && parent.hasAttribute('data-format') && parent.getAttribute('data-format') === preset) {
      const text = parent.textContent
      const textNode = document.createTextNode(text)
      parent.replaceWith(textNode)
      selection.removeAllRanges()
      onChange(editorRef.current.innerHTML)
      return
    }

    const selectedText = range.toString()
    if (!selectedText) return

    if (parent && parent.hasAttribute('data-format')) {
      const text = parent.textContent
      const textNode = document.createTextNode(text)
      parent.replaceWith(textNode)
      
      const newRange = document.createRange()
      newRange.selectNodeContents(textNode)
      selection.removeAllRanges()
      selection.addRange(newRange)
    }

    const span = document.createElement('span')
    span.setAttribute('data-format', preset)
    
    if (preset === 'preset1') {
      span.className = 'highlight-text'
      span.textContent = selectedText
    } else if (preset === 'preset2') {
      span.className = 'underline-text'
      span.textContent = selectedText
    } else if (preset === 'subtext') {
      span.className = 'subtext'
      span.textContent = selectedText
    }

    range.deleteContents()
    range.insertNode(span)

    selection.removeAllRanges()
    onChange(editorRef.current.innerHTML)
  }

  const removeFormat = () => {
    const selection = window.getSelection()
    if (!selection.rangeCount) return

    const range = selection.getRangeAt(0)
    const parent = range.commonAncestorContainer.parentElement
    
    if (parent && parent.hasAttribute('data-format')) {
      const text = parent.textContent
      const textNode = document.createTextNode(text)
      parent.replaceWith(textNode)
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div className="card editor-card">
      <div className="editor-header">
        <h2 className="card-title">Evidence Text</h2>
        <div className="header-controls">
          <button 
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            <SettingsIcon size={16} />
            Colors
          </button>
          <div className="keyboard-hint">
            <Info size={16} />
            <span>Select text → <kbd>1</kbd> highlight, <kbd>2</kbd> underline, <kbd>3</kbd> subtext</span>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="settings-panel">
          <h3>Customize Colors</h3>
          <div className="color-controls">
            <div className="color-input-group">
              <label>Highlight Color (1)</label>
              <input 
                type="color" 
                value={colors.highlight}
                onChange={(e) => setColors({...colors, highlight: e.target.value})}
              />
              <button 
                className="reset-btn"
                onClick={() => setColors({...colors, highlight: '#bfdbfe'})}
              >
                Reset
              </button>
            </div>
            <div className="color-input-group">
              <label>Underline Color (2)</label>
              <input 
                type="color" 
                value={colors.underline}
                onChange={(e) => setColors({...colors, underline: e.target.value})}
              />
              <button 
                className="reset-btn"
                onClick={() => setColors({...colors, underline: '#2d3748'})}
              >
                Reset
              </button>
            </div>
            <div className="color-input-group">
              <label>Subtext Color (3)</label>
              <input 
                type="color" 
                value={colors.subtext}
                onChange={(e) => setColors({...colors, subtext: e.target.value})}
              />
              <button 
                className="reset-btn"
                onClick={() => setColors({...colors, subtext: '#718096'})}
              >
                Reset
              </button>
            </div>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => setColors({
              highlight: '#bfdbfe',
              underline: '#2d3748',
              subtext: '#718096'
            })}
          >
            Reset All to Default
          </button>
        </div>
      )}

      <div className="format-legend">
        <div className="legend-item">
          <span className="legend-demo highlight-text">Highlighted</span>
          <span className="legend-key">Press <kbd>1</kbd></span>
          <span className="legend-desc">→ What you read aloud (bigger, blue highlight)</span>
        </div>
        <div className="legend-item">
          <span className="legend-demo underline-text">Underlined</span>
          <span className="legend-key">Press <kbd>2</kbd></span>
          <span className="legend-desc">→ Important context (underlined)</span>
        </div>
        <div className="legend-item">
          <span className="legend-demo subtext">Subtext</span>
          <span className="legend-key">Press <kbd>3</kbd></span>
          <span className="legend-desc">→ Background text (small, gray)</span>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="text-editor"
        onInput={(e) => onChange(e.target.innerHTML)}
        placeholder="Paste your evidence text here, then select parts to format them..."
      />
    </div>
  )
}

export default Editor
