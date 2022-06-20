
import { Route, Navigate } from 'react-router-dom'
import { Users } from './UserComponent';

export { RequireAuth };

function RequireAuth({ component: Component, ...rest }) {

    return sessionStorage.getItem('user') ? <Users /> : <Navigate to="/login" />;
}