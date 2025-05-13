import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200 shadow-md fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-5xl font-logo text-gold animate-pulse">
                            MILLION
                        </h1>
                    </div>

                    {/* Botón hamburguesa */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setOpen(!open)}
                            className="text-gray-600 hover:text-black focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {open ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Menú horizontal en desktop */}
                    <div className="hidden sm:flex space-x-4 items-center">
                        <Link to="/owners" className="text-gray-700 hover:text-black font-medium">
                            Dueños
                        </Link>
                        <Link to="/properties" className="text-gray-700 hover:text-black font-medium">
                            Propiedades
                        </Link>
                    </div>
                </div>
            </div>

            {/* Menú vertical móvil */}
            {open && (
                <div className="sm:hidden px-4 pb-2">
                    <Link
                        to="/owners"
                        className="block py-2 text-gray-700 hover:text-black font-medium"
                        onClick={() => setOpen(false)}
                    >
                        Dueños
                    </Link>
                    <Link
                        to="/properties"
                        className="block py-2 text-gray-700 hover:text-black font-medium"
                        onClick={() => setOpen(false)}
                    >
                        Propiedades
                    </Link>
                </div>
            )}
        </nav>
    );
}