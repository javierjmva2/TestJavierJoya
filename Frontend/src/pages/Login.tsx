import { useState } from 'react';
import { loginUser } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [welcome, setWelcome] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await loginUser({ username, password });
            setWelcome('Bienvenido/a')
            navigate('/owners'); // redirige a la ventana de owners
        } catch (err) {
            setError('Usuario o contraseña inválidos');
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center px-4">
            <h1 className="text-5xl font-logo text-white tracking-wider mb-8 animate-pulse">
                MILLION
            </h1>
            {error && (
                <div className="bg-red-500/20 text-red-300 px-4 py-2 mb-6 rounded w-full max-w-sm text-center animate-fadeIn">
                    {error}
                </div>
            )}
            {welcome && (
                <div className="bg-green-500/20 text-green-300 px-4 py-2 mb-6 rounded w-full max-w-sm text-center animate-fadeIn">
                    welcome
                </div>
            )}
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Usuario
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-[#1a1a1a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
                        placeholder="Tu usuario"
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 rounded bg-[#1a1a1a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-gold text-black font-semibold rounded hover:bg-[#e2b44a] transition duration-200"
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}