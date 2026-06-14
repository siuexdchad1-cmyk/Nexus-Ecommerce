import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', isLoading = false }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-nexus-card border border-nexus-border rounded-xl p-6 w-full max-w-md shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-md hover:bg-nexus-border transition-colors"><X className="w-4 h-4 text-nexus-muted" /></button>
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-nexus-danger/10 flex-shrink-0"><AlertTriangle className="w-6 h-6 text-nexus-danger" /></div>
          <div className="flex-1"><h3 className="text-lg font-semibold mb-1">{title}</h3><p className="text-sm text-nexus-muted leading-relaxed">{message}</p></div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium rounded-lg border border-nexus-border hover:bg-nexus-border/50 transition-colors disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={isLoading} className="px-4 py-2 text-sm font-medium rounded-lg bg-nexus-danger hover:bg-nexus-danger/90 text-white transition-colors disabled:opacity-50 flex items-center gap-2">
            {isLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}