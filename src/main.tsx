import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/a11y.css'
import './utils/quickDatabaseSetup'; // Cargar funciones de debug

createRoot(document.getElementById("root")!).render(<App />);
// Forzar nuevo build - Wed Oct  1 23:20:45 -03 2025
// Build timestamp: 1759371658
