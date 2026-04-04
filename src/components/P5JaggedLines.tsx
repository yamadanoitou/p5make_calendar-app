/**
 * P5 Official-style jagged red line decorations
 * - JaggedDivider: horizontal jagged line separator
 * - JaggedFrame: animated red border/accent around sections
 * - P5Star: decorative star accent
 */

export function JaggedDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`p5-jagged-animated ${className}`} style={{ height: 50 }}>
      <svg viewBox="0 0 2000 50" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main jagged line */}
        <path
          d="M0 25 L60 8 L120 35 L200 5 L280 40 L340 10 L420 38 L500 6 L560 42 L640 12 L720 36 L800 4 L860 40 L940 14 L1000 25 L1060 8 L1120 35 L1200 5 L1280 40 L1340 10 L1420 38 L1500 6 L1560 42 L1640 12 L1720 36 L1800 4 L1860 40 L1940 14 L2000 25"
          stroke="#ff0000"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Shadow line */}
        <path
          d="M0 28 L60 11 L120 38 L200 8 L280 43 L340 13 L420 41 L500 9 L560 45 L640 15 L720 39 L800 7 L860 43 L940 17 L1000 28 L1060 11 L1120 38 L1200 8 L1280 43 L1340 13 L1420 41 L1500 9 L1560 45 L1640 15 L1720 39 L1800 7 L1860 43 L1940 17 L2000 28"
          stroke="#ff0000"
          strokeWidth="2"
          fill="none"
          opacity=".3"
        />
      </svg>
    </div>
  )
}

export function JaggedAccent({ side = 'left' }: { side?: 'left' | 'right' }) {
  const isLeft = side === 'left'
  return (
    <div
      style={{
        position: 'absolute',
        [isLeft ? 'left' : 'right']: -20,
        top: 0,
        width: 40,
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <svg
        viewBox="0 0 40 400"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: '100%',
          transform: isLeft ? 'none' : 'scaleX(-1)',
        }}
      >
        <path
          d="M20 0 L35 30 L15 60 L38 90 L10 120 L32 150 L18 180 L36 210 L12 240 L30 270 L20 300 L35 330 L15 360 L38 390 L20 400"
          stroke="#ff0000"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M20 0 L5 25 L25 55 L2 85 L30 115 L8 145 L22 175 L4 205 L28 235 L10 265 L20 295 L5 325 L25 355 L2 385 L20 400"
          stroke="#ff0000"
          strokeWidth="2"
          fill="none"
          opacity=".2"
        />
      </svg>
    </div>
  )
}

export function P5Star({ x, y, size = 20 }: { x: string; y: string; size?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        zIndex: 10,
        pointerEvents: 'none',
        animation: 'p5StarSpin 4s linear infinite',
      }}
    >
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z"
          fill="#ff0000"
          stroke="#0a0a0a"
          strokeWidth="1"
        />
      </svg>
      <style>{`
        @keyframes p5StarSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export function JaggedBorderTop() {
  return (
    <div style={{ width: '100%', height: 20, overflow: 'hidden', position: 'relative', zIndex: 5 }}>
      <svg viewBox="0 0 1200 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <path
          d="M0 10 L40 2 L80 18 L120 4 L160 16 L200 2 L240 18 L280 6 L320 14 L360 2 L400 18 L440 4 L480 16 L520 2 L560 18 L600 6 L640 14 L680 2 L720 18 L760 4 L800 16 L840 2 L880 18 L920 6 L960 14 L1000 2 L1040 18 L1080 4 L1120 16 L1160 2 L1200 10"
          stroke="#ff0000"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </div>
  )
}

export function RedSlashAccent({ className = '' }: { className?: string }) {
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', height: 80, width: '100%' }}>
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        {/* Big slashing red shapes like P5 official */}
        <polygon points="0,30 200,0 250,40 50,70" fill="#ff0000" opacity=".8" />
        <polygon points="180,20 500,5 520,50 200,60" fill="#ff0000" opacity=".6" />
        <polygon points="450,25 800,0 830,45 480,65" fill="#ff0000" opacity=".7" />
        <polygon points="750,20 1000,5 1020,55 780,60" fill="#ff0000" opacity=".5" />
        <polygon points="950,15 1200,0 1200,50 980,60" fill="#ff0000" opacity=".8" />
        {/* Outline accents */}
        <line x1="0" y1="40" x2="400" y2="25" stroke="#ff0000" strokeWidth="2" opacity=".3" />
        <line x1="300" y1="50" x2="800" y2="30" stroke="#ff0000" strokeWidth="1.5" opacity=".2" />
        <line x1="700" y1="55" x2="1200" y2="35" stroke="#ff0000" strokeWidth="2" opacity=".3" />
      </svg>
    </div>
  )
}
