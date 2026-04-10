import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import { useState } from 'react'
import { ToolIcon } from '../components/ui/index'

const allTools = [
  { name: 'Compress PDF',     desc: 'Reduce file size, keep quality intact.',            href: '/tools/compress',   color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',  tag: 'Popular'  },
  { name: 'Edit PDF',         desc: 'Add text, images and annotations.',                 href: '/tools/pdf-editor', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',   tag: 'Featured' },
  { name: 'Merge PDF',        desc: 'Combine PDFs with drag-and-drop reorder.',          href: '/tools/merge',      color: '#10B981', bg: 'rgba(16,185,129,0.1)', tag: null },
  { name: 'Split PDF',        desc: 'Extract pages or split into separate files.',       href: '/tools/split',      color: '#F97316', bg: 'rgba(249,115,22,0.1)', tag: null },
  { name: 'Image to PDF',     desc: 'JPG/PNG to PDF — A4 or original size.',            href: '/tools/img-to-pdf', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', tag: null },
  { name: 'Remove Background',desc: 'AI-powered BG removal, fully private.',            href: '/tools/bg-remove',  color: '#EC4899', bg: 'rgba(236,72,153,0.1)', tag: 'AI' },
  { name: 'QR Code Tools',    desc: 'Generate and scan QR codes live.',                  href: '/tools/qr',         color: '#14B8A6', bg: 'rgba(20,184,166,0.1)', tag: null },
  { name: 'Resume Builder',   desc: 'Build and export a professional resume.',           href: '/tools/resume',     color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', tag: null },
]

export default function Tools() {
  const [query, setQuery] = useState('')
  const filtered = allTools.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.desc.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 md:px-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)', fontFamily: 'Dosis, sans-serif' }}>All Tools</span>
          <h1 className="text-4xl md:text-5xl font-display font-800 mt-3 tracking-tight"
            style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.025em' }}>
            Pick your tool.
          </h1>
          <p className="mt-3 text-base" style={{ color: 'var(--text-2)', maxWidth: '360px', margin: '12px auto 0' }}>
            All tools run locally in your browser — fast, private, free.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-10 animate-fade-up-delay">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
          <input
            type="text"
            placeholder="Search tools..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'Dosis, sans-serif' }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up-delay2">
            {filtered.map(tool => (
              <Link key={tool.href} to={tool.href} className="card-glass rounded-2xl p-5 flex flex-col gap-3 group">
                <div className="flex items-start justify-between">
                  <ToolIcon label={tool.name} color={tool.color} bg={tool.bg} />
                  {tool.tag && <span className="badge" style={{ background: tool.bg, color: tool.color }}>{tool.tag}</span>}
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: 'Dosis, sans-serif', color: 'var(--text)' }}>{tool.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{tool.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium mt-auto" style={{ color: tool.color, fontFamily: 'Dosis, sans-serif' }}>
                  Open tool <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>No tools found for "{query}"</p>
          </div>
        )}
      </div>
    </main>
  )
}
