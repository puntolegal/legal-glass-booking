import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/a11y.css'

// Solo cargar scripts de debug en desarrollo
if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
  import('./utils/quickDatabaseSetup'); // Cargar funciones de debug solo en desarrollo
  import('./utils/sendTestEmails'); // Cargar funciones de email testing solo en desarrollo
}

createRoot(document.getElementById("root")!).render(<App />);
