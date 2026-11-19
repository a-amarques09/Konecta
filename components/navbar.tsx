"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

const Navbar: React.FC = () => {
    const { data: session } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-[#101B35] text-white px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold">
                KONECTA
            </Link>

            {/* Navigation Links */}
            <ul className="hidden md:flex space-x-6">
                <li>
                    <Link href="/" className="hover:text-[#2563EB]">
                        Início
                    </Link>
                </li>
                <li>
                    <Link href="/products" className="hover:text-[#2563EB]">
                        Explorar
                    </Link>
                </li>
                <li>
                    <Link href="/categories" className="hover:text-[#2563EB]">
                        Categorias
                    </Link>
                </li>
                {session?.user?.role === 'SELLER' || session?.user?.role === 'ADMIN' ? (
                    <li>
                        <Link href="/seller/dashboard" className="hover:text-[#2563EB]">
                            Minha Loja
                        </Link>
                    </li>
                ) : null}
                {session?.user?.role === 'ADMIN' ? (
                    <li>
                        <Link href="/admin" className="hover:text-[#2563EB]">
                            Admin
                        </Link>
                    </li>
                ) : null}
            </ul>

            {/* Buttons */}
            <div className="space-x-4">
                {session ? (
                    <>
                        <button
                            onClick={() => signOut()}
                            className="bg-transparent border border-white px-4 py-2 rounded hover:bg-[#2563EB] text-sm"
                        >
                            Sair
                        </button>
                        <Link
                            href="/profile"
                            className="bg-[#2563EB] px-4 py-2 rounded hover:bg-white hover:text-[#2563EB] text-sm"
                        >
                            Perfil
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="bg-transparent border border-white px-4 py-2 rounded hover:bg-[#2563EB] text-sm"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/register"
                            className="bg-[#2563EB] px-4 py-2 rounded hover:bg-white hover:text-[#2563EB] text-sm"
                        >
                            Criar conta
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile menu button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white"
            >
                {mobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#101B35] p-4 mt-2 rounded-lg">
                    <ul className="space-y-3">
                        <li>
                            <Link href="/" className="block py-2 hover:text-[#2563EB]">
                                Início
                            </Link>
                        </li>
                        <li>
                            <Link href="/products" className="block py-2 hover:text-[#2563EB]">
                                Explorar
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories" className="block py-2 hover:text-[#2563EB]">
                                Categorias
                            </Link>
                        </li>
                        {session ? (
                            <>
                                <li>
                                    <button
                                        onClick={() => signOut()}
                                        className="block w-full text-left py-2 hover:text-[#2563EB]"
                                    >
                                        Sair
                                    </button>
                                </li>
                                <li>
                                    <Link href="/profile" className="block py-2 hover:text-[#2563EB]">
                                        Perfil
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/login" className="block py-2 hover:text-[#2563EB]">
                                        Entrar
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register" className="block py-2 hover:text-[#2563EB]">
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