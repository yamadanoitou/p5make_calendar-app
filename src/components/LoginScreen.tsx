import { useState } from 'react'
import { useAuth } from '../lib/auth'

export default function LoginScreen() {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password)

    setLoading(false)

    if (error) {
      setError(error)
    } else if (isSignUp) {
      setSignUpSuccess(true)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ background: '#0a0a0a' }}
    >
      {/* Background stripes */}
      <div className="stripe-bg" />
      <div className="halftone" />

      {/* Login Card */}
      <div className="modal-panel p5-slide-in w-full max-w-md mx-4 p-8" style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div
            style={{
              fontFamily: 'Doctor Punk, Bebas Neue, sans-serif',
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              letterSpacing: '.06em',
              color: '#f5f5f0',
              lineHeight: 1,
            }}
          >
            <span style={{ color: '#ff0000' }}>P5</span>//CAL
          </div>
          <div
            style={{
              fontFamily: 'Doctor Punk, Bebas Neue, sans-serif',
              fontSize: '1rem',
              letterSpacing: '.2em',
              color: '#888',
              marginTop: '.5rem',
            }}
          >
            {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </div>
        </div>

        {/* Success message for sign up */}
        {signUpSuccess && (
          <div
            className="mb-4 p-3 text-center"
            style={{
              background: 'rgba(45, 198, 83, .1)',
              border: '2px solid #2dc653',
              fontFamily: 'Noto Sans JP, sans-serif',
              fontSize: '.9rem',
              color: '#2dc653',
            }}
          >
            確認メールを送信しました。メールのリンクをクリックしてください。
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="mb-4 p-3 text-center"
            style={{
              background: 'rgba(255, 0, 0, .1)',
              border: '2px solid #ff0000',
              fontFamily: 'Noto Sans JP, sans-serif',
              fontSize: '.9rem',
              color: '#ff0000',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label
              className="block text-xs tracking-widest uppercase mb-1"
              style={{
                fontFamily: 'Doctor Punk, Bebas Neue, sans-serif',
                letterSpacing: '.15em',
                color: '#888',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="p5-input"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              className="block text-xs tracking-widest uppercase mb-1"
              style={{
                fontFamily: 'Doctor Punk, Bebas Neue, sans-serif',
                letterSpacing: '.15em',
                color: '#888',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="p5-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="p5-btn w-full disabled:opacity-50"
            style={{ marginTop: '1.5rem' }}
          >
            <span>{loading ? 'LOADING...' : isSignUp ? 'SIGN UP' : 'SIGN IN'}</span>
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              setSignUpSuccess(false)
            }}
            style={{
              fontFamily: 'Doctor Punk, Bebas Neue, sans-serif',
              fontSize: '.9rem',
              letterSpacing: '.1em',
              color: '#888',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color .3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff0000')}
            onMouseLeave={e => (e.currentTarget.style.color = '#888')}
          >
            {isSignUp ? 'ALREADY HAVE AN ACCOUNT? SIGN IN' : "DON'T HAVE AN ACCOUNT? SIGN UP"}
          </button>
        </div>
      </div>
    </div>
  )
}
