import React from 'react';
import './Layout.css'; // Asegúrate de crear este archivo

export default function Layout({ children }) {
    return (
        <div className="layout-container">
            {children}
        </div>
    );
}
