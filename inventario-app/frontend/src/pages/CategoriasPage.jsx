import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriaService } from '../services'
import toast from 'react-hot-toast'

function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
        <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 16, width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }} className="animate-slide-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{title}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div style={{ padding: 20 }}>{children}</div>
        </div>
      </div>
  )
}

export default function CategoriasPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [form, setForm]   = useState({ nombre: '', descripcion: '' })
  const [editId, setEditId] = useState(null)

  const { data: categorias, isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => categoriaService.listar().then(r => r.data.data),
  })

  const guardar = useMutation({
    mutationFn: d => editId ? categoriaService.actualizar(editId, d) : categoriaService.crear(d),
    onSuccess: () => {
      qc.invalidateQueries(['categorias'])
      toast.success(editId ? 'Categoría actualizada' : 'Categoría creada')
      setModal(false); setForm({ nombre: '', descripcion: '' }); setEditId(null)
    },
    onError: e => toast.error(e.response?.data?.message || 'Error al guardar'),
  })

  const eliminar = useMutation({
    mutationFn: id => categoriaService.eliminar(id),
    onSuccess: () => { qc.invalidateQueries(['categorias']); toast.success('Categoría eliminada') },
    onError: () => toast.error('No se puede eliminar — tiene productos asociados'),
  })

  const abrir = (c = null) => {
    if (c) { setForm({ nombre: c.nombre, descripcion: c.descripcion || '' }); setEditId(c.id) }
    else   { setForm({ nombre: '', descripcion: '' }); setEditId(null) }
    setModal(true)
  }

  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.03em' }}>Categorías</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 3 }}>{categorias?.length ?? 0} categorías registradas</p>
          </div>
          <button className="btn-blue" onClick={() => abrir()} style={{ borderRadius: 8, height: 34, paddingInline: 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Nueva categoría
          </button>
        </div>

        {isLoading && <div style={{ textAlign: 'center', padding: 40 }}><div style={{ width: 20, height: 20, border: '2px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} /></div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {categorias?.map(c => (
              <div key={c.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(79,156,249,0.1)', border: '1px solid rgba(79,156,249,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#79c0ff" strokeWidth="1.8" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{c.nombre}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.descripcion || 'Sin descripción'}</div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button className="btn-icon" onClick={() => abrir(c)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button className="btn-icon" style={{ color: '#f85149' }} onClick={() => { if(confirm('¿Eliminar categoría?')) eliminar.mutate(c.id) }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,81,73,0.1)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
          ))}
        </div>

        <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Editar categoría' : 'Nueva categoría'}>
          <form onSubmit={e => { e.preventDefault(); guardar.mutate(form) }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label className="label">Nombre *</label><input className="field" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
            <div><label className="label">Descripción</label><textarea className="field" rows={3} style={{ resize: 'none' }} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} /></div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className="btn-blue" style={{ flex: 1 }} disabled={guardar.isPending}>{guardar.isPending ? 'Guardando...' : editId ? 'Actualizar' : 'Crear'}</button>
            </div>
          </form>
        </Modal>
      </div>
  )
}