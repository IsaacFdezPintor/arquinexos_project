import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/authContext.tsx'

/**
 * Punto de entrada de la aplicación React
 * 
 * Configura:
 * - BrowserRouter: Permite el enrutamiento del lado del cliente
 * - AuthProvider: Proporciona contexto de autenticación a toda la app
 * - App: Componente raíz con todas las rutas
 */

// Obtener elemento raíz del DOM
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento raíz no encontrado en el HTML');
}

// Crear raíz de React y renderizar la aplicación
createRoot(rootElement).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)