import './App.css';
import Menu from './rutas/Menu';
import configureToastr from './toastrConfig'; // Importa la configuración de Toastr
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    configureToastr(); // Configura Toastr al montar el componente
  }, []);

  return (
    <>
      <Menu />
    </>
  );
}

export default App;
