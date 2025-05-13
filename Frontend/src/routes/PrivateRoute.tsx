import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode
}

export default function PrivateRoute({ children }: Props) {
    const token = localStorage.getItem('jwt');
    const isAuthenticated = !!token;

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}