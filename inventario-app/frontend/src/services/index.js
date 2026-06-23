import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

api.interceptors.response.use(
    r => r,
    err => {
      if (err.response?.status === 401) {
        localStorage.clear()
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
)

export const authService      = { login: d => api.post('/auth/login', d) }
export const productoService  = {
  listar:    p => api.get('/productos', { params: p }),
  obtener:   id => api.get(`/productos/${id}`),
  crear:     d => api.post('/productos', d),
  actualizar:(id, d) => api.put(`/productos/${id}`, d),
  eliminar:  id => api.delete(`/productos/${id}`),
  stockBajo: () => api.get('/productos/stock-bajo'),
}
export const categoriaService = {
  listar:    () => api.get('/categorias'),
  crear:     d => api.post('/categorias', d),
  actualizar:(id, d) => api.put(`/categorias/${id}`, d),
  eliminar:  id => api.delete(`/categorias/${id}`),
}
export const movimientoService = {
  listar:    p => api.get('/movimientos', { params: p }),
  registrar: d => api.post('/movimientos', d),
}
export const dashboardService = {
    obtenerMetricas: () => api.get('/dashboard'),
  obtenerResumenAnual: () => api.get('/dashboard/resumen-anual'),
}
export const reporteService   = {
  exportarProductosPdf:    () => api.get('/reportes/productos/pdf',   { responseType: 'blob' }),
  exportarProductosExcel:  () => api.get('/reportes/productos/excel', { responseType: 'blob' }),
  exportarMovimientosPdf:  p  => api.get('/reportes/movimientos/pdf', { params: p, responseType: 'blob' }),
  exportarMovimientosExcel: () => api.get('/reportes/movimientos/excel', { responseType: 'blob' }),
}