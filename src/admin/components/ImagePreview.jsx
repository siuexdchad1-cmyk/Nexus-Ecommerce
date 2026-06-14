import { useState } from 'react'
import { ImageOff, ExternalLink } from 'lucide-react'

export default function ImagePreview({ url, size = 'md' }) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const sizeClasses = { sm: 'w-10 h-10', md: 'w-20 h-20', lg: 'w-32 h-32', xl: 'w-48 h-48' }
  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'))

  if (!url || !isValidUrl) {
    return (<div className={`${sizeClasses[size]} rounded-lg bg-nexus-border/50 flex items-center justify-center`}><ImageOff className="w-5 h-5 text-nexus-muted" /></div>)
  }
  if (error) {
    return (<div className={`${sizeClasses[size]} rounded-lg bg-nexus-danger/10 border border-nexus-danger/20 flex flex-col items-center justify-center gap-1`}><ImageOff className="w-5 h-5 text-nexus-danger" /><span className="text-[10px] text-nexus-danger">Failed</span></div>)
  }
  return (
    <div className={`${sizeClasses[size]} rounded-lg overflow-hidden bg-nexus-border/50 relative group`}>
      {!loaded && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-5 border-2 border-nexus-muted border-t-transparent rounded-full animate-spin" /></div>}
      <img src={url} alt="Preview" className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setLoaded(true)} onError={() => setError(true)} />
      {loaded && <a href={url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"><ExternalLink className="w-4 h-4 text-white" /></a>}
    </div>
  )
}