import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
        {/* Grid decorativo de fondo */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
          <div style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
            width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          }} />
        </div>

        <div className="relative w-full max-w-[360px] animate-fade-in">
          {/* Logo mark */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2.5 mb-6">
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(59,130,246,0.35)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>InvManager</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.03em', margin: 0 }}>
              Bienvenido de vuelta
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 6 }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Form card */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-2)',
            borderRadius: 16,
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
          }}>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="label">Correo electrónico</label>
                <input
                    type="email" className="field" required
                    placeholder="nombre@empresa.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                      type={show ? 'text' : 'password'} className="field" required
                      placeholder="••••••••" style={{ paddingRight: 40 }}
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                      type="button" onClick={() => setShow(!show)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-3)', display: 'flex', padding: 0,
                      }}>
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                  type="submit" className="btn-blue" disabled={loading}
                  style={{ width: '100%', marginTop: 4, height: 38, borderRadius: 10 }}>
                {loading ? (
                    <svg className="animate-spin-slow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
                    </svg>
                ) : null}
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: 20 }}>
            EFSRT · CIBERTEC 2026 · Computación e Informática
          </p>
        </div>
      </div>
  )
}