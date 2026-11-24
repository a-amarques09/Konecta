"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

const Navbar: React.FC = () => {
    const { data: session } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-[#101B35] text-white px-4 py-3 flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-lg font-bold">
                KONECTA
            </Link>

            {/* Navigation Links */}
            <ul className="hidden md:flex space-x-4">
                <li>
                    <Link href="/" className="text-sm hover:text-[#2563EB]">
                        Início
                    </Link>
                </li>
                <li>
                    <Link href="/products" className="text-sm hover:text-[#2563EB]">
                        Explorar
                    </Link>
                </li>
                <li>
                    <Link href="/categories" className="text-sm hover:text-[#2563EB]">
                        Categorias
                    </Link>
                </li>
                {session?.user?.role === 'SELLER' || session?.user?.role === 'ADMIN' ? (
                    <li>
                        <Link href="/seller/dashboard" className="text-sm hover:text-[#2563EB]">
                            Minha Loja
                        </Link>
                    </li>
                ) : null}
                {session?.user?.role === 'ADMIN' ? (
                    <li>
                        <Link href="/admin" className="text-sm hover:text-[#2563EB]">
                            Admin
                        </Link>
                    </li>
                ) : null}
            </ul>

            {/* Buttons */}
            <div className="hidden md:flex space-x-2">
                {session ? (
                    <>
                        <button
                            onClick={() => signOut()}
                            className="bg-transparent border border-white px-3 py-1.5 rounded hover:bg-[#2563EB] text-xs"
                        >
                            Sair
                        </button>
                        <Link
                            href="/profile"
                            className="bg-[#2563EB] px-3 py-1.5 rounded hover:bg-white hover:text-[#2563EB] text-xs"
                        >
                            Perfil
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="bg-transparent border border-white px-3 py-1.5 rounded hover:bg-[#2563EB] text-xs"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/register"
                            className="bg-[#2563EB] px-3 py-1.5 rounded hover:bg-white hover:text-[#2563EB] text-xs"
                        >
                            Criar conta
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile menu button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2"
            >
                {mobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#101B35] p-3 mt-2 rounded-lg shadow-lg">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/" className="block py-2.5 text-sm hover:text-[#2563EB]">
                                Início
                            </Link>
                        </li>
                        <li>
                            <Link href="/products" className="block py-2.5 text-sm hover:text-[#2563EB]">
                                Explorar
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories" className="block py-2.5 text-sm hover:text-[#2563EB]">
                                Categorias
                            </Link>
                        </li>
                        {session ? (
                            <>
                                <li>
                                    <button
                                        onClick={() => signOut()}
                                        className="block w-full text-left py-2.5 text-sm hover:text-[#2563EB]"
                                    >
                                        Sair
                                    </button>
                                </li>
                                <li>
                                    <Link href="/profile" className="block py-2.5 text-sm hover:text-[#2563EB]">
                                        Perfil
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/login" className="block py-2.5 text-sm hover:text-[#2563EB]">
                                        Entrar
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register" className="block py-2.5 text-sm hover:text-[#2563EB]">
                                        Criar conta
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;