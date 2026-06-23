import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { movimientoService, productoService } from '../services'
import toast from 'react-hot-toast'

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
        <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 16, width: '100%', maxWidth: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }} className="animate-slide-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Registrar movimiento</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div style={{ padding: 20 }}>{children}</div>
        </div>
      </div>
  )
}

export default function MovimientosPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [form, setForm]   = useState({ productoId: '', tipo: 'ENTRADA', cantidad: '', motivo: '' })

  const { data: movimientos, isLoading } = useQuery({
    queryKey: ['movimientos'],
    queryFn: () => movimientoService.listar({ size: 100 }).then(r => r.data.data),
  })
  const { data: productos } = useQuery({
    queryKey: ['productos-all'],
    queryFn: () => productoService.listar({ size: 200 }).then(r => r.data.data?.content || []),
  })

  const registrar = useMutation({
    mutationFn: d => movimientoService.registrar(d),
    onSuccess: () => {
      qc.invalidateQueries(['movimientos']); qc.invalidateQueries(['productos']); qc.invalidateQueries(['dashboard'])
      toast.success('Movimiento registrado')
      setModal(false); setForm({ productoId: '', tipo: 'ENTRADA', cantidad: '', motivo: '' })
    },
    onError: e => toast.error(e.response?.data?.message || 'Error al registrar'),
  })

  const lista = movimientos?.content || []

  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.03em' }}>Movimientos</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 3 }}>Historial de entradas y salidas</p>
          </div>
          <button className="btn-blue" onClick={() => setModal(true)} style={{ borderRadius: 8, height: 34, paddingInline: 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Registrar movimiento
          </button>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
              <tr>
                <th>Tipo</th><th>Producto</th>
                <th style={{ textAlign: 'right' }}>Cantidad</th>
                <th style={{ textAlign: 'right' }}>Antes</th>
                <th style={{ textAlign: 'right' }}>Después</th>
                <th>Motivo</th><th>Fecha</th>
              </tr>
              </thead>
              <tbody>
              {isLoading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}><div style={{ width: 20, height: 20, border: '2px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} /></td></tr>}
              {!isLoading && lista.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)', fontSize: 13 }}>No hay movimientos registrados</td></tr>}
              {lista.map(m => (
                  <tr key={m.id}>
                    <td>
                      {m.tipo === 'ENTRADA'
                          ? <span className="badge-green">↑ Entrada</span>
                          : <span className="badge-yellow">↓ Salida</span>}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-1)', fontSize: 13 }}>{m.productoNombre}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace' }}>{m.productoCodigo}</div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-1)' }}>{m.cantidad}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', color: 'var(--text-3)' }}>{m.stockAnterior}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', color: 'var(--text-1)' }}>{m.stockPosterior}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.motivo || '—'}</td>
                    <td style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                      {new Date(m.fechaMovimiento).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal open={modal} onClose={() => setModal(false)}>
          <form onSubmit={e => { e.preventDefault(); registrar.mutate({ ...form, productoId: parseInt(form.productoId), cantidad: parseInt(form.cantidad) }) }}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="label">Producto *</label>
              <select className="field" value={form.productoId} onChange={e => setForm({...form, productoId: e.target.value})} required>
                <option value="">Seleccionar producto...</option>
                {productos?.map(p => <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stockActual})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tipo *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[['ENTRADA', '↑ Entrada', '#3fb950', 'rgba(63,185,80,0.12)', 'rgba(63,185,80,0.25)'],
                  ['SALIDA',  '↓ Salida',  '#e3b341', 'rgba(227,179,65,0.12)', 'rgba(227,179,65,0.25)']].map(([val, label, color, bg, border]) => (
                    <button key={val} type="button" onClick={() => setForm({...form, tipo: val})}
                            style={{ padding: '9px', borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.1s', border: `1px solid ${form.tipo === val ? border : 'var(--border-2)'}`, background: form.tipo === val ? bg : 'transparent', color: form.tipo === val ? color : 'var(--text-2)' }}>
                      {label}
                    </button>
                ))}
              </div>
            </div>
            <div><label className="label">Cantidad *</label><input className="field" type="number" min="1" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} required /></div>
            <div><label className="label">Motivo</label><input className="field" placeholder="Compra, venta, ajuste..." value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})} /></div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className="btn-blue" style={{ flex: 1 }} disabled={registrar.isPending}>{registrar.isPending ? 'Registrando...' : 'Registrar'}</button>
            </div>
          </form>
        </Modal>
      </div>
  )
}