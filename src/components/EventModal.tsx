import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Event } from '../types/database'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
  event: Event | null
  defaultStart?: string
  defaultEnd?: string
}

const COLOR_OPTIONS = [
  { value: '#ff0000', label: 'Red' },
  { value: '#ffd200', label: 'Yellow' },
  { value: '#00b4d8', label: 'Blue' },
  { value: '#2dc653', label: 'Green' },
  { value: '#9b59b6', label: 'Purple' },
  { value: '#ff6b35', label: 'Orange' },
]

export default function EventModal({ isOpen, onClose, onSaved, event, defaultStart, defaultEnd }: EventModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [color, setColor] = useState('#ff0000')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description || '')
      setStartAt(toLocalDatetime(event.start_at))
      setEndAt(toLocalDatetime(event.end_at))
      setColor(event.color || '#ff0000')
    } else {
      setTitle('')
      setDescription('')
      setStartAt(defaultStart ? toLocalDatetime(defaultStart) : '')
      setEndAt(defaultEnd ? toLocalDatetime(defaultEnd) : '')
      setColor('#ff0000')
    }
  }, [event, defaultStart, defaultEnd, isOpen])

  const toLocalDatetime = (iso: string) => {
    const d = new Date(iso)
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - offset * 60000)
    return local.toISOString().slice(0, 16)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !startAt || !endAt) return
    setSaving(true)

    const payload = {
      title,
      description: description || null,
      start_at: new Date(startAt).toISOString(),
      end_at: new Date(endAt).toISOString(),
      color,
    }

    if (event) {
      await supabase.from('events').update(payload).eq('id', event.id)
    } else {
      await supabase.from('events').insert(payload)
    }

    setSaving(false)
    onSaved()
    onClose()
  }

  const handleDelete = async () => {
    if (!event) return
    await supabase.from('events').delete().eq('id', event.id)
    onSaved()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel p5-slide-in w-full max-w-lg mx-4 p-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          {/* P5 Style Title */}
          <div style={{ transform: 'skewX(-8deg)' }}>
            <div
              style={{
                fontFamily: 'Doctor Punk, Bebas Neue, sans-serif',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                letterSpacing: '.06em',
                color: '#f5f5f0',
                background: '#ff0000',
                display: 'inline-block',
                padding: '.1em .5em',
                lineHeight: 1.2,
              }}
            >
              <span style={{ transform: 'skewX(8deg)', display: 'inline-block' }}>
                {event ? 'EDIT EVENT' : 'NEW EVENT'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xl transition-colors"
            style={{
              fontFamily: 'Doctor Punk, Bebas Neue, sans-serif',
              color: '#888',
              transform: 'skewX(-5deg)',
              letterSpacing: '.1em',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff0000')}
            onMouseLeave={e => (e.currentTarget.style.color = '#888')}
          >
            CLOSE
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Title */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1"
              style={{ fontFamily: 'Doctor Punk, Bebas Neue, sans-serif', letterSpacing: '.15em', color: '#888' }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="p5-input"
              placeholder="Event title..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-1"
              style={{ fontFamily: 'Doctor Punk, Bebas Neue, sans-serif', letterSpacing: '.15em', color: '#888' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="p5-input resize-none"
              placeholder="Details..."
            />
          </div>

          {/* Date/Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-1"
                style={{ fontFamily: 'Doctor Punk, Bebas Neue, sans-serif', letterSpacing: '.15em', color: '#888' }}>
                Start
              </label>
              <input
                type="datetime-local"
                value={startAt}
                onChange={e => setStartAt(e.target.value)}
                required
                className="p5-input"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-1"
                style={{ fontFamily: 'Doctor Punk, Bebas Neue, sans-serif', letterSpacing: '.15em', color: '#888' }}>
                End
              </label>
              <input
                type="datetime-local"
                value={endAt}
                onChange={e => setEndAt(e.target.value)}
                required
                className="p5-input"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2"
              style={{ fontFamily: 'Doctor Punk, Bebas Neue, sans-serif', letterSpacing: '.15em', color: '#888' }}>
              Color
            </label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className="w-9 h-9 transition-all"
                  style={{
                    backgroundColor: c.value,
                    border: color === c.value ? '3px solid #f5f5f0' : '2px solid transparent',
                    transform: color === c.value ? 'skewX(-8deg) scale(1.2)' : 'skewX(-8deg)',
                    boxShadow: color === c.value ? `4px 4px 0 ${c.value}50` : 'none',
                  }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="p5-btn flex-1 disabled:opacity-50"
            >
              <span>{saving ? 'SAVING...' : event ? 'UPDATE' : 'CREATE'}</span>
            </button>
            {event && (
              <button
                type="button"
                onClick={handleDelete}
                className="p5-btn p5-btn-danger"
                style={{ padding: '.8rem 1.5rem' }}
              >
                <span>DELETE</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
