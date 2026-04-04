import { useEffect, useRef } from 'react'

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mx = 0, my = 0, dx = 0, dy = 0
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    document.addEventListener('mousemove', onMove)

    let raf: number
    const animate = () => {
      dx += (mx - dx) * 0.15
      dy += (my - dy) * 0.15
      if (dotRef.current) {
        dotRef.current.style.left = `${dx}px`
        dotRef.current.style.top = `${dy}px`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot" />
}
