import React from 'react';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth_user, providerGoogle } from '../../firebase/appConfig';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import toastr from 'toastr'; // Asegúrate de que Toastr esté instalado y configurado
import 'toastr/build/toastr.min.css';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    // Método para iniciar sesión
    const loginForm = (data) => {
        signInWithEmailAndPassword(auth_user, data.email, data.password)
            .then((userCredentiales) => {
                const user = userCredentiales.user;                

                // Guardando la información del usuario en el localstorage
                saveLocalStorage("user_firebase", JSON.stringify(user));
                
                // Redirigir a ListProducts después de iniciar sesión
                navigate('/');
            }).catch((error) => {
                console.error(error.message);
                Swal.fire({
                    title: "Invalid credentials",
                    text: "Check your info",
                    icon: "warning"
                });
            });
    };

    // Método para iniciar sesión con Google
    const loginGoogle = async () => {
        try {
            const result = await signInWithPopup(auth_user, providerGoogle);            
            saveLocalStorage("user_firebase", JSON.stringify(result.user));

            // Redirigir a ListProducts después de iniciar sesión
            navigate('/');
        } catch (error) {
            console.error(error.message);
            Swal.fire({
                title: "Google Authentication Failed",
                text: "Check your info",
                icon: "warning"
            });
        }
    };

    // Método que nos va a guardar el usuario en el localstorage
    const saveLocalStorage = (key, data) => {
        localStorage.setItem(key, data);
    };

    return (
        <div className="container">
            <h1 className="text-center">Login</h1>
            <div>
                <button className="btn btn-danger" onClick={loginGoogle}>
                    <i className="fab fa-google"></i> Login with Google
                </button>
            </div>
            <hr />
            <form onSubmit={handleSubmit(loginForm)} className="needs-validation col-12">
                <div className="my-2 row">
                    <label className="col-sm-5 col-form-label">
                        <i className="fas fa-envelope"></i> Email
                    </label>
                    <div className="col-sm-7">
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="Your email here"
                            {...register('email', { required: true })}
                        />
                        {errors.email && (
                            <span className="invalid-feedback">Required</span>
                        )}
                    </div>
                </div>

                <div className="my-2 row">
                    <label className="col-sm-5 col-form-label">
                        <i className="fas fa-lock"></i> Password
                    </label>
                    <div className="col-sm-7">
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Your password here"
                            {...register('password', { required: true })}
                        />
                        {errors.password && (
                            <span className="invalid-feedback">Required</span>
                        )}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">Login</button>
            </form>

            <section>
                <p>Don´t hava an account? <Link to="/registro">Sign up!</Link></p>
            </section>
        </div>
    );
}
