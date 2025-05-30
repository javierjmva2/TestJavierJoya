import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-white">
       <Navbar />
      <div className="pt-28 px-6">
        <Outlet />
      </div>
    </div>
  );
}