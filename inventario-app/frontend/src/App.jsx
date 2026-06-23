import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout        from './components/common/Layout'
import LoginPage     from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProductosPage from './pages/ProductosPage'
import CategoriasPage from './pages/CategoriasPage'
import MovimientosPage from './pages/MovimientosPage'
import ReportesPage  from './pages/ReportesPage'

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 120_000, retry: 1 } } })

function Guard({ children }) {
    const { usuario } = useAuth()
    return usuario ? children : <Navigate to="/login" replace />
}

export default function App() {
    return (
        <QueryClientProvider client={qc}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/" element={<Guard><Layout /></Guard>}>
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard"    element={<DashboardPage />} />
                            <Route path="productos"    element={<ProductosPage />} />
                            <Route path="categorias"   element={<CategoriasPage />} />
                            <Route path="movimientos"  element={<MovimientosPage />} />
                            <Route path="reportes"     element={<ReportesPage />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{ style: {
                                background: '#161b24', color: '#f0f6fc',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 10, fontSize: 13, padding: '10px 14px',
                            }}}
                    />
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    )
}