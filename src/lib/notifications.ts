export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function scheduleReminder(title: string, startAt: string, minutesBefore = 10) {
  const eventTime = new Date(startAt).getTime()
  const now = Date.now()
  const notifyAt = eventTime - minutesBefore * 60 * 1000

  if (notifyAt <= now) return null

  const timeoutId = setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(`⏰ ${title}`, {
        body: `Starting in ${minutesBefore} minutes`,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
      })
    }
  }, notifyAt - now)

  return timeoutId
}

export function isNotificationSupported(): boolean {
  return 'Notification' in window
}
