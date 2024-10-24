// src/toastrConfig.js
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; // Asegúrate de importar los estilos

const configureToastr = () => {
  toastr.options = {    
    positionClass: 'toast-bottom-right',
    timeOut: 3000,
  };
};

export default configureToastr;
