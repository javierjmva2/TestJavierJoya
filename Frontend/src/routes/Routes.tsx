import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Properties from '../pages/Properties';
//import Owners from '../pages/Owners'; // si ya la tienes
import PrivateRoute from './PrivateRoute';
import Owners from '../pages/Owners';

export default function App() {
  return (
    <Routes>      
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="properties" element={<Properties />} />
        <Route path="owners" element={<Owners />} />
      </Route>
    </Routes>
  );
}