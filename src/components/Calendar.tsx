import { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core'
import type { EventResizeDoneArg } from '@fullcalendar/interaction'
import { supabase } from '../lib/supabase'
import type { Event } from '../types/database'
import { P5Star } from './P5JaggedLines'

interface CalendarProps {
  onEventClick: (event: Event) => void
  onDateSelect: (start: string, end: string) => void
  refreshKey: number
}

export default function Calendar({ onEventClick, onDateSelect, refreshKey }: CalendarProps) {
  const [events, setEvents] = useState<Event[]>([])
  const calendarRef = useRef<FullCalendar>(null)

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('start_at', { ascending: true })
    if (data) setEvents(data)
  }

  useEffect(() => {
    fetchEvents()
  }, [refreshKey])

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    onDateSelect(selectInfo.startStr, selectInfo.endStr)
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const ev = events.find(e => e.id === clickInfo.event.id)
    if (ev) onEventClick(ev)
  }

  const handleEventDrop = async (info: EventDropArg) => {
    await supabase.from('events').update({
      start_at: info.event.startStr,
      end_at: info.event.endStr || info.event.startStr,
    }).eq('id', info.event.id)
  }

  const handleEventResize = async (info: EventResizeDoneArg) => {
    await supabase.from('events').update({
      start_at: info.event.startStr,
      end_at: info.event.endStr || info.event.startStr,
    }).eq('id', info.event.id)
  }

  const calendarEvents = events.map(e => ({
    id: e.id,
    title: e.title,
    start: e.start_at,
    end: e.end_at,
    backgroundColor: e.color || '#ff0000',
    borderColor: e.color || '#ff0000',
  }))

  return (
    <div className="p5-slide-in">
      {/* P5 Section Title */}
      <div className="p5-section-title" style={{ position: 'relative' }}>
        <div className="title-plate">
          <span className="title-text">SCHEDULE</span>
        </div>
        <P5Star x="100%" y="-10px" size={22} />
      </div>

      {/* Calendar Card */}
      <div className="calendar-wrapper" style={{ position: 'relative' }}>
        <P5Star x="-12px" y="-12px" size={18} />
        <P5Star x="calc(100% - 6px)" y="calc(100% - 30px)" size={16} />
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          locale="ja"
          selectable
          editable
          events={calendarEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          height="auto"
          dayMaxEvents={3}
          buttonText={{
            today: 'TODAY',
            month: 'MONTH',
            week: 'WEEK',
          }}
        />
      </div>
    </div>
  )
}
