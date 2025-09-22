import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/a11y.css'
import './utils/quickDatabaseSetup'; // Cargar funciones de debug

createRoot(document.getElementById("root")!).render(<App />);
