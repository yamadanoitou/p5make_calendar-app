import { useAuth } from '../lib/auth'

interface HeaderProps {
  onNotificationToggle: () => void
  notificationEnabled: boolean
  activeTab: 'calendar' | 'tasks'
  onTabChange: (tab: 'calendar' | 'tasks') => void
}

export default function Header({ onNotificationToggle, notificationEnabled, activeTab, onTabChange }: HeaderProps) {
  const { signOut } = useAuth()

  return (
    <nav className="p5-nav">
      {/* Logo */}
      <div className="p5-nav-logo">P5//CAL</div>

      {/* Nav Links */}
      <ul className="p5-nav-links">
        <li>
          <button
            onClick={() => onTabChange('calendar')}
            style={{ color: activeTab === 'calendar' ? '#ff0000' : undefined }}
          >
            Calendar
          </button>
        </li>
        <li>
          <button
            onClick={() => onTabChange('tasks')}
            style={{ color: activeTab === 'tasks' ? '#ff0000' : undefined }}
          >
            Tasks
          </button>
        </li>
        <li>
          <button onClick={onNotificationToggle}>
            {notificationEnabled ? 'NOTIF:ON' : 'NOTIF:OFF'}
          </button>
        </li>
        <li>
          <button onClick={signOut}>
            LOGOUT
          </button>
        </li>
      </ul>
    </nav>
  )
}
