import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Task } from '../types/database'
import { P5Star } from './P5JaggedLines'

const PRIORITY_LABELS = ['LOW', 'MID', 'HIGH'] as const
const PRIORITY_COLORS = ['#888', '#ffd200', '#ff0000'] as const

export default function TaskPanel() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState(0)
  const [showCompleted, setShowCompleted] = useState(false)

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('is_completed', { ascending: true })
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
    if (data) setTasks(data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    await supabase.from('tasks').insert({
      title: newTitle.trim(),
      priority: newPriority,
    })
    setNewTitle('')
    setNewPriority(0)
    fetchTasks()
  }

  const toggleComplete = async (task: Task) => {
    await supabase.from('tasks').update({ is_completed: !task.is_completed }).eq('id', task.id)
    fetchTasks()
  }

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  const incomplete = tasks.filter(t => !t.is_completed)
  const completed = tasks.filter(t => t.is_completed)

  return (
    <div className="p5-slide-in-right">
      {/* P5 Section Title */}
      <div className="p5-section-title" style={{ position: 'relative' }}>
        <div className="title-plate">
          <span className="title-text">TASKS</span>
        </div>
        <P5Star x="100%" y="-10px" size={22} />
      </div>

      {/* Task Panel Container */}
      <div className="p5-red-frame p-4" style={{ position: 'relative' }}>
        <P5Star x="-12px" y="-12px" size={18} />

        {/* Add Task Form */}
        <form onSubmit={addTask} className="flex gap-2 mb-4" style={{ transform: 'skewX(-2deg)' }}>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="New task..."
            className="p5-input flex-1"
          />
          <select
            value={newPriority}
            onChange={e => setNewPriority(Number(e.target.value))}
            className="p5-input"
            style={{ width: 80, padding: '.8rem .5rem' }}
          >
            <option value={0}>LOW</option>
            <option value={1}>MID</option>
            <option value={2}>HIGH</option>
          </select>
          <button type="submit" className="p5-btn" style={{ padding: '.6rem 1.2rem', fontSize: '1rem' }}>
            <span>ADD</span>
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
          {incomplete.length === 0 && (
            <div
              className="text-center py-8"
              style={{ fontFamily: 'Doctor Punk, Bebas Neue, sans-serif', letterSpacing: '.1em', color: '#888', fontSize: '1.1rem' }}
            >
              NO TASKS. TAKE YOUR TIME.
            </div>
          )}

          {incomplete.map((task, i) => (
            <div
              key={task.id}
              className="task-card p5-fade-up group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-3 py-3 px-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(task)}
                  className="w-5 h-5 border-2 flex-shrink-0 transition-all hover:scale-110"
                  style={{
                    borderColor: PRIORITY_COLORS[task.priority],
                    transform: 'skewX(-5deg)',
                  }}
                />

                {/* Title */}
                <span className="flex-1 text-sm font-bold" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                  {task.title}
                </span>

                {/* Priority Badge */}
                <span
                  className="text-xs font-bold px-2 py-0.5"
                  style={{
                    fontFamily: 'Doctor Punk, Bebas Neue, sans-serif',
                    letterSpacing: '.1em',
                    color: PRIORITY_COLORS[task.priority],
                    background: `${PRIORITY_COLORS[task.priority]}15`,
                    transform: 'skewX(-5deg)',
                    fontSize: '.85rem',
                  }}
                >
                  {PRIORITY_LABELS[task.priority]}
                </span>

                {/* Delete */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all text-lg"
                  style={{ color: '#888' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ff0000')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#888')}
                >
                  &times;
                </button>
              </div>
            </div>
          ))}

          {/* Completed Section */}
          {completed.length > 0 && (
            <>
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="w-full text-left py-3 px-2 transition-colors"
                style={{
                  fontFamily: 'Doctor Punk, Bebas Neue, sans-serif',
                  fontSize: '.95rem',
                  letterSpacing: '.15em',
                  color: '#888',
                  transform: 'skewX(-3deg)',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f5f5f0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
              >
                {showCompleted ? '\u25BC' : '\u25B6'} COMPLETED ({completed.length})
              </button>

              {showCompleted && completed.map(task => (
                <div key={task.id} className="flex items-center gap-3 py-2 px-4 opacity-40 group">
                  <button
                    onClick={() => toggleComplete(task)}
                    className="w-5 h-5 border-2 border-gray-600 bg-gray-800 flex-shrink-0 flex items-center justify-center text-xs"
                    style={{ transform: 'skewX(-5deg)' }}
                  >
                    &#10003;
                  </button>
                  <span className="flex-1 text-sm line-through" style={{ color: '#888' }}>
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-lg transition-all"
                    style={{ color: '#888' }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
