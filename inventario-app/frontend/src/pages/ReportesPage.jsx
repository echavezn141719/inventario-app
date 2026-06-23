import { reporteService } from '../services'
import toast from 'react-hot-toast'

function descargar(blob, nombre) {
    const url = URL.createObjectURL(new Blob([blob]))
    const a = document.createElement('a')
    a.href = url
    a.download = nombre
    a.click()
    URL.revokeObjectURL(url)
}

function ReporteCard({ title, desc, colorIcon, onPdf, onExcel }) {
    return (
        <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 20,
        }}>
            <div style={{
                width: 38, height: 38, borderRadius: 10, marginBottom: 14,
                background: colorIcon + '18', border: `1px solid ${colorIcon}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colorIcon} strokeWidth="1.8" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16, lineHeight: 1.5 }}>{desc}</div>
            <div style={{ display: 'flex', gap: 8 }}>
                {onPdf && (
                    <button onClick={onPdf} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: 'rgba(248,81,73,0.1)', color: '#f85149',
                        border: '1px solid rgba(248,81,73,0.2)',
                    }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,81,73,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,81,73,0.1)'}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        PDF
                    </button>
                )}
                {onExcel && (
                    <button onClick={onExcel} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: 'rgba(63,185,80,0.1)', color: '#3fb950',
                        border: '1px solid rgba(63,185,80,0.2)',
                    }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(63,185,80,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(63,185,80,0.1)'}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Excel
                    </button>
                )}
            </div>
        </div>
    )
}

async function exportar(fn, nombre) {
    const toastId = toast.loading('Generando reporte...')
    try {
        const res = await fn()
        if (res.status === 200) {
            descargar(res.data, nombre)
            toast.success('Reporte descargado', { id: toastId })
        } else {
            toast.error('Error al generar el reporte', { id: toastId })
        }
    } catch (err) {
        // Si igual llegó el archivo, descargarlo
        if (err.response?.data instanceof Blob && err.response.data.size > 0) {
            descargar(err.response.data, nombre)
            toast.success('Reporte descargado', { id: toastId })
        } else {
            toast.error('Error al generar el reporte', { id: toastId })
        }
    }
}

export default function ReportesPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
                <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.03em' }}>Reportes</h1>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>Exporta la información del inventario en PDF o Excel</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                <ReporteCard
                    title="Reporte de Productos"
                    desc="Lista completa de productos activos con stock, categoría, ubicación y estado."
                    colorIcon="#4f9cf9"
                    onPdf={()   => exportar(() => reporteService.exportarProductosPdf(),   'productos.pdf')}
                    onExcel={()  => exportar(() => reporteService.exportarProductosExcel(), 'productos.xlsx')}
                />
                <ReporteCard
                    title="Reporte de Movimientos"
                    desc="Historial completo de entradas y salidas con fechas, cantidades y usuarios."
                    colorIcon="#3fb950"
                    onPdf={()   => exportar(() => reporteService.exportarMovimientosPdf(),   'movimientos.pdf')}
                    onExcel={()  => exportar(() => reporteService.exportarMovimientosExcel(), 'movimientos.xlsx')}
                />
            </div>
        </div>
    )
}