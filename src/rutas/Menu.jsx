import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Layout from '../components/Layout'; // Importamos el nuevo Layout
import ListProducts from '../components/ListProducts';
import RegisterProduct from '../components/RegisterProduct';
//Importar el registro de pages/session
import EditForm from '../components/EditForm';
import Private from '../pages/Home';
import Register from '../pages/session/Register';
import Login from '../pages/session/Login';

export default function Menu() {
    return (
        <BrowserRouter>
            <NavBar /> {/* Barra de navegación incluida */}

            <Routes>
                <Route path='/' element={<Layout><ListProducts /></Layout>} />
                <Route path='/productos' element={<Layout><ListProducts /></Layout>} />
                <Route path='/registro' element={<Layout><Register /></Layout>} />
                <Route path='/login' element={<Layout><Login /></Layout>} />
                <Route path='/registrar-producto' element={<Layout><RegisterProduct /></Layout>} />
                <Route path='/editar/:id' element={<Layout><EditForm /></Layout>} />
                <Route path='/private-home' element={<Layout><Private /></Layout>} />                    
            </Routes>
        </BrowserRouter>
    );
}
