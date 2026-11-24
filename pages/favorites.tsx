import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Favorites: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
                    <p className="text-gray-600">A carregar favoritos...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold text-[#101B35] mb-4">
                        Acesso Necessário
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Você precisa fazer login para ver os seus favoritos.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/login"
                            className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] inline-block"
                        >
                            Fazer Login
                        </Link>
                        <Link
                            href="/register"
                            className="bg-transparent border border-[#2563EB] text-[#2563EB] px-6 py-2 rounded hover:bg-[#2563EB] hover:text-white inline-block"
                        >
                            Criar Conta
                        </Link>

                        <a
                            href="/"
                            className="text-[#2563EB] text-sm font-medium hover:underline mt-2 inline-block"
                        >
                            Voltar ao início
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <nav className="bg-[#101B35] text-white px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold">
                        KONECTA
                    </Link>
                    <Link
                        href="/"
                        className="text-[#2563EB] hover:text-white"
                    >
                        ← Voltar ao Início
                    </Link>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-[#101B35] mb-6">
                    Meus Favoritos
                </h1>

                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-gray-400"
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
                    </div>
                    <h2 className="text-lg font-medium text-[#101B35] mb-2">
                        Nenhum favorito ainda
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Os produtos que marcar como favorito aparecerão aqui.
                    </p>
                    <Link
                        href="/products"
                        className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] inline-block"
                    >
                        Explorar Produtos
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Favorites;