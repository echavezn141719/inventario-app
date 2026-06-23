
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productoService, categoriaService } from '../services'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'

function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
        <div style={{
          position: 'relative', background: 'var(--surface)', border: '1px solid var(--border-2)',
          borderRadius: 16, width: '100%', maxWidth: 480,
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }} className="animate-slide-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{title}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: 4, borderRadius: 6, transition: 'color 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div style={{ padding: 20 }}>{children}</div>
        </div>
      </div>
  )
}

const empty = { codigo:'', nombre:'', descripcion:'', ubicacion:'', stockActual:'', stockMinimo:'5', stockMaximo:'', imagenUrl:'', categoriaId:'' }
const F = ({ label, children }) => (
    <div><label className="label">{label}</label>{children}</div>
)
export default function ProductosPage() {
  const qc = useQueryClient()
  const [q, setQ]         = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm]   = useState(empty)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setBusqueda(q), 500)
    return () => clearTimeout(timer)
  }, [q])

  const { data, isLoading } = useQuery({
    queryKey: ['productos', busqueda],
    queryFn: () => productoService.listar({ busqueda: busqueda || undefined, size: 100 }).then(r => r.data.data),
  })
  const { data: cats } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => categoriaService.listar().then(r => r.data.data),
  })

  const guardar = useMutation({
    mutationFn: d => editId ? productoService.actualizar(editId, d) : productoService.crear(d),
    onSuccess: () => {
      qc.invalidateQueries(['productos']); qc.invalidateQueries(['dashboard'])
      toast.success(editId ? 'Producto actualizado' : 'Producto creado')
      setModal(false); setForm(empty); setEditId(null)
    },
    onError: e => toast.error(e.response?.data?.message || 'Error al guardar'),
  })
  const eliminar = useMutation({
    mutationFn: id => productoService.eliminar(id),
    onSuccess: () => { qc.invalidateQueries(['productos']); toast.success('Producto eliminado') },
    onError: () => toast.error('No se pudo eliminar'),
  })

  const abrir = (p = null) => {
    if (p) { setForm({ codigo: p.codigo, nombre: p.nombre, descripcion: p.descripcion || '', ubicacion: p.ubicacion || '', imagenUrl: p.imagenUrl || '', stockActual: p.stockActual, stockMinimo: p.stockMinimo, stockMaximo: p.stockMaximo || '', categoriaId: p.categoriaId }); setEditId(p.id) }
    else   { setForm(empty); setEditId(null) }
    setModal(true)
  }

  const submit = e => {
    e.preventDefault()
    guardar.mutate({
      ...form,
      stockActual:  parseInt(form.stockActual),
      stockMinimo:  parseInt(form.stockMinimo),
      stockMaximo:  form.stockMaximo ? parseInt(form.stockMaximo) : null,
      categoriaId:  parseInt(form.categoriaId)
    })
  }

  const productos = data?.content || []

  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.03em' }}>Productos</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 3 }}>{data?.totalElements ?? 0} productos registrados</p>
          </div>
          <button className="btn-blue" onClick={() => abrir()} style={{ borderRadius: 8, height: 34, paddingInline: 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Nuevo producto
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="field" style={{ paddingLeft: 36, maxWidth: 340 }}
                 placeholder="Buscar por nombre o código..."
                 value={q} onChange={e => setQ(e.target.value)} />
        </div>

        {/* Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
              <tr>
                <th>Código</th><th>Producto</th><th>Categoría</th>
                <th style={{ textAlign: 'right' }}>Ubicacion</th>
                <th style={{ textAlign: 'right' }}>Stock</th>
                <th style={{ textAlign: 'center' }}>Estado</th>
                <th style={{ textAlign: 'right' }}>Imagen</th>
                <th />
              </tr>
              </thead>
              <tbody>
              {isLoading && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ width: 20, height: 20, border: '2px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                  </td></tr>
              )}
              {!isLoading && productos.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)', fontSize: 13 }}>
                    No hay productos que coincidan
                  </td></tr>
              )}
              {productos.map(p => (
                  <tr key={p.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-3)' }}>{p.codigo}</span></td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-1)', fontSize: 13 }}>{p.nombre}</div>
                      {p.descripcion && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.descripcion}</div>}
                    </td>
                    <td><span className="badge-blue">{p.categoriaNombre}</span></td>
                    <td style={{fontSize:12, color:'var(--text-2)'}}>{p.ubicacion || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: p.stockBajo ? '#f85149' : 'var(--text-1)' }}>{p.stockActual}</span>
                      <span style={{ color: 'var(--text-3)', fontSize: 11 }}> /{p.stockMinimo}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {p.stockBajo ? <span className="badge-yellow">Stock bajo</span> : <span className="badge-green">OK</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn-icon" onClick={() => abrir(p)} title="Editar">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="btn-icon" onClick={() => { if(confirm('¿Eliminar?')) eliminar.mutate(p.id) }} title="Eliminar"
                                style={{ color: '#f85149' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,81,73,0.1)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </td>
                    <td>
                      {p.imagenUrl
                          ? <a href={p.imagenUrl} target="_blank" rel="noreferrer"
                               style={{color:'#79c0ff', fontSize:12}}>Ver imagen</a>
                          : <span style={{color:'var(--text-3)', fontSize:12}}>—</span>}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Editar producto' : 'Nuevo producto'}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <F label="Código *"><input className="field" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} required /></F>
              <F label="Categoría *">
                <select className="field" value={form.categoriaId} onChange={e => setForm({...form, categoriaId: e.target.value})} required>
                  <option value="">Seleccionar...</option>
                  {cats?.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </F>
            </div>
            <F label="Nombre *"><input className="field" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></F>
            <F label="Descripción"><input className="field" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} /></F>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <F label="Ubicación">
                <input className="field" placeholder="Almacén A, Estante 3..."
                       value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} />
              </F>
              <F label="URL de imagen">
                <input className="field" placeholder="https://..."
                       value={form.imagenUrl} onChange={e => setForm({...form, imagenUrl: e.target.value})} />
              </F>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <F label="Stock actual *"><input className="field" type="number" min="0" value={form.stockActual} onChange={e => setForm({...form, stockActual: e.target.value})} required /></F>
              <F label="Stock mín. *"><input className="field" type="number" min="0" value={form.stockMinimo} onChange={e => setForm({...form, stockMinimo: e.target.value})} required /></F>
              <F label="Stock máx."><input className="field" type="number" min="0" value={form.stockMaximo} onChange={e => setForm({...form, stockMaximo: e.target.value})} /></F>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className="btn-blue" style={{ flex: 1 }} disabled={guardar.isPending}>
                {guardar.isPending ? 'Guardando...' : editId ? 'Actualizar' : 'Crear producto'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
  )
}