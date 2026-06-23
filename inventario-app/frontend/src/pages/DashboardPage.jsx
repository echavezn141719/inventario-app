import { useQuery } from '@tanstack/react-query'
import { dashboardService, productoService } from '../services'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function Stat({ label, value, sub, accent }) {
  return (
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '18px 20px',
      }}>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: accent || 'var(--text-1)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em', lineHeight: 1 }}>
          {value ?? '—'}
        </div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>{sub}</div>}
      </div>
  )
}

const tooltipStyle = {
  contentStyle: { background: '#161b24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12, color: '#f0f6fc' },
  cursor: { stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 },
}

export default function DashboardPage() {
  const { data: dash } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.obtenerMetricas().then(r => r.data.data),
    refetchInterval: 30_000,
  })
  const { data: stockBajo } = useQuery({
    queryKey: ['stock-bajo'],
    queryFn: () => productoService.stockBajo().then(r => r.data.data),
  })
  const { data: chartData } = useQuery({
    queryKey: ['resumen-anual'],
    queryFn: () => dashboardService.obtenerResumenAnual().then(r => r.data.data),
  })
  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.03em' }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
            Resumen del inventario · {new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <Stat label="Total productos"  value={dash?.totalProductos}   sub="registrados" />
          <Stat label="Categorías"       value={dash?.totalCategorias}  sub="activas" />
          <Stat label="Entradas del mes" value={dash?.entradasMes}      sub="unidades" accent="#3fb950" />
          <Stat label="Salidas del mes"  value={dash?.salidasMes}       sub="unidades" accent="#e3b341" />
        </div>

        {/* Chart + Alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>

          {/* Chart */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Movimientos del año</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>Entradas vs salidas por mes</div>
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-2)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#3b82f6', display: 'inline-block' }} />Entradas
              </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#e3b341', display: 'inline-block' }} />Salidas
              </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData || []}>
                <defs>
                  <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#e3b341" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#e3b341" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="entradas" stroke="#3b82f6" strokeWidth={1.8} fill="url(#ge)" dot={false} />
                <Area type="monotone" dataKey="salidas"  stroke="#e3b341" strokeWidth={1.8} fill="url(#gs)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stock bajo */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Stock bajo</div>
              {dash?.productosStockBajo > 0 && (
                  <span className="badge-yellow">{dash.productosStockBajo} alertas</span>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
              {!stockBajo?.length && (
                  <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 13, padding: '24px 0' }}>
                    ✓ Todo el stock está bien
                  </div>
              )}
              {stockBajo?.map(p => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 10px', borderRadius: 8,
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    marginBottom: 4,
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace' }}>{p.codigo}</div>
                    </div>
                    <span className="badge-red" style={{ flexShrink: 0, marginLeft: 8 }}>{p.stockActual}</span>
                  </div>
              ))}
            </div>
          </div>

        </div>
      </div>
  )
}