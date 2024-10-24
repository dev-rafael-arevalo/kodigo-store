import React, { useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import {auth_user} from '../firebase/appConfig'
import Login from './session/Login'
import {signOut} from 'firebase/auth'

export default function Private() {
    //estado donde vamos a verificar si el usuario esta autenticado
    const [user, setUser] = useState(null)

    //accediendo al usuario del localstorage
    const userStorage = JSON.parse(localStorage.getItem("user_firebase")) //{}

    //verificamos si el usuario esta en firebase
    //userFirebase = devuelve un objeto si la persona existe
    onAuthStateChanged(auth_user, (userFirebase) => {
        if(userFirebase){ //objeto
            //si el usuario existe
            console.log(userFirebase);
            setUser(userFirebase)
        }else{
            setUser(null)
        }
    })

    //metodo para cerrar sesion
    const logout = () => {
        signOut(auth_user).then(() => {
            alert("La sesion se ha cerrado");
        }).catch((error) => {
            console.error("Error al cerrar sesion", error)
        })
    }

    return (
        <div>
            {
                //validamos si el usuario existe le damos la bienvenida sino tendra que loguearse
                user ? 
                <>
                    <div>
                        <h1>Bienvenido a la aplicacion!</h1>
                        <p>Has iniciado sesion</p>
                        <img src={userStorage.photoURL ? userStorage.photoURL : "https://res.cloudinary.com/dmddi5ncx/image/upload/v1729199012/practicas/usuario_tpluzt.png"} alt="" style={{width: "25%"}}/>
                        <p>{userStorage.displayName ? userStorage.displayName : "Usuaro random"}</p>
                        <p>Correo: {userStorage.email}</p>
                        <button onClick={logout}>Cerrar Sesion</button>
                    </div>
                    
                </>
                : <Login />
            }
            
        </div>
    )
}
