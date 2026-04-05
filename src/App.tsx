import { useCallback, useEffect, useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import LoginScreen from './components/LoginScreen'
import CursorDot from './components/CursorDot'
import Marquee from './components/Marquee'
import Header from './components/Header'
import Calendar from './components/Calendar'
import EventModal from './components/EventModal'
import TaskPanel from './components/TaskPanel'
import { JaggedDivider, RedSlashAccent, JaggedBorderTop, P5Star } from './components/P5JaggedLines'
import { requestNotificationPermission, scheduleReminder, isNotificationSupported } from './lib/notifications'
import { supabase } from './lib/supabase'
import { useAuth } from './lib/auth'
import type { Event } from './types/database'
import './index.css'

function AuthenticatedApp() {
  const { user, signOut } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [defaultStart, setDefaultStart] = useState<string>()
  const [defaultEnd, setDefaultEnd] = useState<string>()
  const [refreshKey, setRefreshKey] = useState(0)
  const [notificationEnabled, setNotificationEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState<'calendar' | 'tasks'>('calendar')

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

  useEffect(() => {
    if (!notificationEnabled || !user) return
    const scheduleAll = async () => {
      const now = new Date().toISOString()
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_at', now)
        .order('start_at', { ascending: true })
        .limit(20)
      events?.forEach(ev => { scheduleReminder(ev.title, ev.start_at) })
    }
    scheduleAll()
  }, [notificationEnabled, refreshKey, user])

  const handleNotificationToggle = async () => {
    if (!isNotificationSupported()) {
      alert('This browser does not support notifications')
      return
    }
    if (!notificationEnabled) {
      const granted = await requestNotificationPermission()
      setNotificationEnabled(granted)
      if (!granted) alert('Notification permission denied')
    } else {
      setNotificationEnabled(false)
    }
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setDefaultStart(undefined)
    setDefaultEnd(undefined)
    setModalOpen(true)
  }

  const handleDateSelect = (start: string, end: string) => {
    setSelectedEvent(null)
    setDefaultStart(start)
    setDefaultEnd(end)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedEvent(null)
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0a' }}>
      {/* Overlays */}
      <LoadingScreen />
      <CursorDot />
      <div className="halftone" />
      <div className="stripe-bg" />

      {/* Nav */}
      <Header
        onNotificationToggle={handleNotificationToggle}
        notificationEnabled={notificationEnabled}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* === Red Slash Accent (hero area) === */}
      <div className="pt-14">
        <RedSlashAccent />
      </div>

      {/* Marquee */}
      <Marquee />

      {/* Jagged Line after marquee */}
      <JaggedDivider />

      {/* Main Content */}
      <main className="relative z-1 max-w-7xl mx-auto px-4 py-6" style={{ position: 'relative' }}>
        {/* Decorative stars */}
        <P5Star x="2%" y="20px" size={16} />
        <P5Star x="95%" y="80px" size={20} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Calendar */}
          <div className={activeTab === 'tasks' ? 'hidden lg:block' : ''}>
            <Calendar
              onEventClick={handleEventClick}
              onDateSelect={handleDateSelect}
              refreshKey={refreshKey}
            />
          </div>

          {/* Task Panel */}
          <div className={activeTab === 'calendar' ? 'hidden lg:block' : ''}>
            <TaskPanel />
          </div>
        </div>
      </main>

      {/* Bottom jagged line */}
      <JaggedBorderTop />
      <RedSlashAccent />

      {/* Mobile Tab Bar */}
      <div className="mobile-tab-bar">
        <button
          className={activeTab === 'calendar' ? 'active' : ''}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
        <button
          className={activeTab === 'tasks' ? 'active' : ''}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button onClick={signOut}>
          Logout
        </button>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => {
          setSelectedEvent(null)
          setDefaultStart(undefined)
          setDefaultEnd(undefined)
          setModalOpen(true)
        }}
        className="fab-button fixed bottom-8 right-8 z-40 w-16 h-16 text-3xl font-bold flex items-center justify-center transition-all"
        style={{
          background: '#ff0000',
          color: '#f5f5f0',
          fontFamily: 'Doctor Punk, Bebas Neue, sans-serif',
          clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)',
          boxShadow: '4px 4px 0 rgba(255,210,0,.4)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#ffd200'
          e.currentTarget.style.color = '#0a0a0a'
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#ff0000'
          e.currentTarget.style.color = '#f5f5f0'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        +
      </button>

      {/* Footer */}
      <footer
        className="relative z-1 text-center py-6"
        style={{
          fontFamily: 'Doctor Punk, Bebas Neue, sans-serif',
          fontSize: '.85rem',
          letterSpacing: '.2em',
          color: 'rgba(255,255,255,.3)',
        }}
      >
        &copy; 2026 <span style={{ color: '#ff0000' }}>P5</span> CALENDAR &mdash; TAKE YOUR TIME
      </footer>

      {/* Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSaved={refresh}
        event={selectedEvent}
        defaultStart={defaultStart}
        defaultEnd={defaultEnd}
      />
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <LoginScreen />

  return <AuthenticatedApp />
}
