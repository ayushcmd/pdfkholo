import { useLocation, Link } from 'react-router-dom'
import { ArrowLeft, Hammer } from 'lucide-react'

const toolMeta: Record<string, { emoji: string; name: string; color: string; bg: string }> = {
  'compress':   { emoji: '🗜️', name: 'Compress PDF',       color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  'pdf-editor': { emoji: '✏️', name: 'PDF Editor',          color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  'merge':      { emoji: '🔗', name: 'Merge PDF',           color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  'split':      { emoji: '✂️', name: 'Split PDF',           color: '#FBBF24', bg: 'rgba(251,191,36,0.1)'  },
  'img-to-pdf': { emoji: '🖼️', name: 'Image to PDF',        color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  'bg-remove':  { emoji: '🪄', name: 'Remove Background',   color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
  'qr':         { emoji: '📱', name: 'QR Code Tools',       color: '#14B8A6', bg: 'rgba(20,184,166,0.1)' },
  'resume':     { emoji: '📋', name: 'Resume Builder',      color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
}

export default function ToolPage() {
  const location = useLocation()
  const slug = location.pathname.replace('/tools/', '')
  const meta = toolMeta[slug] || { emoji: '🛠️', name: 'Tool', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center pt-20 px-5" style={{ background: 'var(--bg)' }}>
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6">

        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
          style={{ background: meta.bg, border: `2px solid ${meta.color}22` }}
        >
          {meta.emoji}
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Hammer size={14} style={{ color: 'var(--accent)' }} />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent)', fontFamily: 'Dosis, sans-serif' }}
            >
              Coming in Phase 3
            </span>
          </div>
          <h1
            className="text-3xl font-display font-800 tracking-tight"
            style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            {meta.name}
          </h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
            This tool is under active development. Phase 1 & 2 are complete — check back soon for the full implementation.
          </p>
        </div>

        <div
          className="w-full rounded-2xl p-5 text-left"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-3)', fontFamily: 'Dosis, sans-serif' }}>
            BUILD PROGRESS
          </p>
          {['Foundation & Theme ✅', 'Landing Page ✅', 'Tool Implementations 🔨', 'Polish & Mobile 📱'].map((step, i) => (
            <div key={step} className="flex items-center gap-3 py-2" style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: i < 2 ? '#10B981' : i === 2 ? meta.color : 'var(--border)', flexShrink: 0 }}
              />
              <span className="text-xs" style={{ color: i < 2 ? 'var(--text)' : 'var(--text-3)' }}>{step}</span>
            </div>
          ))}
        </div>

        <Link
          to="/tools"
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--text-2)', fontFamily: 'Dosis, sans-serif' }}
        >
          <ArrowLeft size={15} />
          Back to all tools
        </Link>
      </div>
    </main>
  )
}
