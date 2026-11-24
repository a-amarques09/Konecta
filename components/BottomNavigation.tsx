'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const BottomNavigation: React.FC = () => {
    const router = useRouter();
    const [publishMenuOpen, setPublishMenuOpen] = useState<boolean>(false);

    const isActive = (href: string) => {
        return router.pathname === href;
    };

    const navItems: NavItem[] = [
        {
            href: '/',
            label: 'Início',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
        },
        {
            href: '/products',
            label: 'Explorar',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                </svg>
            ),
        },
        {
            href: '#',
            label: 'Publicar',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                </svg>
            ),
        },
        {
            href: '/favorites',
            label: 'Favoritos',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            ),
        },
        {
            href: '/profile',
            label: 'Perfil',
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            ),
        },
    ];

    const handlePublishOption = (option: string) => {
        setPublishMenuOpen(false);
        if (option === 'product') {
            router.push('/products/create');
        } else if (option === 'service') {
            router.push('/products/create');
        } else if (option === 'request') {
            router.push('/requests/create');
        }
    };

    return (
        <>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-4">
                <div className="max-w-md mx-auto px-4">
                    <div className="flex justify-around items-center py-2">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={() => {
                                    if (item.href === '#') {
                                        setPublishMenuOpen(!publishMenuOpen);
                                    }
                                }}
                                className="flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 min-w-[60px]"
                            >
                                {item.icon}
                                <span
                                    className={`text-xs font-medium mt-0.5 ${isActive(item.href) || (item.href === '#' && publishMenuOpen)
                                        ? 'text-[#2563EB]'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {publishMenuOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        onClick={() => setPublishMenuOpen(false)}
                    />
                )}

                {publishMenuOpen && (
                    <div className="fixed bottom-20 left-1/2 right-1/2 z-50 -translate-x-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-[#101B35]">Publicar</h3>
                            <button
                                onClick={() => setPublishMenuOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => handlePublishOption('product')}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#F5F7FA] hover:bg-[#2563EB] hover:text-white transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium">Publicar produto</span>
                                </div>
                                <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={() => handlePublishOption('service')}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#F5F7FA] hover:bg-[#2563EB] hover:text-white transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium">Publicar serviço</span>
                                </div>
                                <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={() => handlePublishOption('request')}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#F5F7FA] hover:bg-[#2563EB] hover:text-white transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium">Publicar uma procura</span>
                                </div>
                                <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default BottomNavigation;