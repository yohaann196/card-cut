
# Card Cutter - Debate Evidence Manager (to use go to https://card-cut.vercel.app/)
Modern web app for cutting debate evidence cards with smart metadata extraction and keyboard shortcuts.
## Features
✅ **Auto-Metadata Extraction** - Paste URL, get citation info automatically
✅ **Keyboard Shortcuts** - Select text, press 1 (highlight) or 2 (underline)
✅ **Three Format Levels**:
  - Highlighted (1) → What you read aloud (big, blue)
  - Underlined (2) → Important context
  - Regular → Background text (small, gray)
✅ **Save & Organize** - Card library with search
✅ **Copy to Clipboard** - Export formatted cards
✅ **Clean UI** - Fast, intuitive workflow
## Quick Start
```bash
cd card-cutter
npm install
npm run dev
```
## How to Use
1. **Paste Article URL** → Auto-extracts author, date, title, publication
2. **Add Pocket/Tag** → Main argument of the card
3. **Paste Evidence Text** into editor
4. **Format with Keyboard**:
   - Select text → Press `1` for highlight (what you read)
   - Select text → Press `2` for underline (context)
   - Unformatted text → Automatically becomes small subtext
5. **Preview & Save** → See formatted card, save to library
## Keyboard Shortcuts
- `1` - Apply blue highlight (read aloud text)
- `2` - Apply underline (important context)
- `Backspace/Delete` on selected formatted text - Remove formatting
## Deployment
### Vercel
```bash
npm install -g vercel
vercel
```
### Build
```bash
npm run build
```
## Tech Stack
- React 18
- Vite
- Lucide React
- AllOrigins API (CORS proxy for metadata extraction)
Built for debaters who want to cut cards faster.
=======
# card-cut
a debate card cutter with customization.


