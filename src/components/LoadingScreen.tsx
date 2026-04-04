import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setAnimating(true), 1000)
    const t2 = setTimeout(() => setHidden(true), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (hidden) return null

  return (
    <div className={`loading-screen ${animating ? 'hide' : ''}`}>
      <div className="loading-text">TAKE YOUR TIME</div>
    </div>
  )
}
