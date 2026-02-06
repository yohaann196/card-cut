import { useState } from 'react'
import { Link, Download } from 'lucide-react'
import './URLInput.css'

function URLInput({ metadata, onMetadataChange }) {
  const [isLoading, setIsLoading] = useState(false)

  const extractMetadata = async (url) => {
    setIsLoading(true)
    try {
      const corsProxy = 'https://api.allorigins.win/raw?url='
      const response = await fetch(corsProxy + encodeURIComponent(url))
      const html = await response.text()
      
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      const getMetaContent = (name) => {
        const meta = doc.querySelector(`meta[property="${name}"], meta[name="${name}"]`)
        return meta?.getAttribute('content') || ''
      }
      
      const author = getMetaContent('author') || getMetaContent('article:author') || 
                     doc.querySelector('[rel="author"]')?.textContent?.trim() || ''
      
      const title = getMetaContent('og:title') || getMetaContent('twitter:title') || 
                   doc.querySelector('title')?.textContent?.trim() || ''
      
      const publication = getMetaContent('og:site_name') || 
                         new URL(url).hostname.replace('www.', '') || ''
      
      const dateStr = getMetaContent('article:published_time') || 
                     getMetaContent('datePublished') || ''
      const date = dateStr ? new Date(dateStr).getFullYear().toString() : ''
      
      onMetadataChange({
        ...metadata,
        url,
        author,
        title,
        publication,
        date
      })
    } catch (error) {
      console.error('Metadata extraction error:', error)
      onMetadataChange({
        ...metadata,
        url
      })
      alert('Could not extract metadata automatically. Please fill in manually.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleURLSubmit = (e) => {
    e.preventDefault()
    const url = e.target.url.value.trim()
    if (url) {
      extractMetadata(url)
    }
  }

  return (
    <div className="card url-input-card">
      <h2 className="card-title">Source Information</h2>

      <form onSubmit={handleURLSubmit} className="url-form">
        <div className="url-input-group">
          <Link size={20} />
          <input
            type="url"
            name="url"
            placeholder="Paste article URL here..."
            defaultValue={metadata.url}
            className="url-input"
            required
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            <Download size={18} />
            {isLoading ? 'Loading...' : 'Extract'}
          </button>
        </div>
      </form>

      <div className="metadata-grid">
        <div className="form-group">
          <label>Author*</label>
          <input
            type="text"
            placeholder="Last Name"
            value={metadata.author}
            onChange={(e) => onMetadataChange({ ...metadata, author: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Date*</label>
          <input
            type="text"
            placeholder="2024"
            value={metadata.date}
            onChange={(e) => onMetadataChange({ ...metadata, date: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group span-2">
          <label>Title</label>
          <input
            type="text"
            placeholder='"Article Title"'
            value={metadata.title}
            onChange={(e) => onMetadataChange({ ...metadata, title: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group span-2">
          <label>Publication</label>
          <input
            type="text"
            placeholder="New York Times, Nature, etc."
            value={metadata.publication}
            onChange={(e) => onMetadataChange({ ...metadata, publication: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group span-2">
          <label>Pocket/Tag*</label>
          <input
            type="text"
            placeholder="Main argument (e.g., Climate change causes extinction)"
            value={metadata.pocket}
            onChange={(e) => onMetadataChange({ ...metadata, pocket: e.target.value })}
            className="form-input"
          />
        </div>
      </div>
    </div>
  )
}

export default URLInput
