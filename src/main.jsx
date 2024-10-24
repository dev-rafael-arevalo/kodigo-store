import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Para los estilos de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Para la funcionalidad de Bootstrap (incluye Popper)
import '@fortawesome/fontawesome-free/css/all.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
