import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Profile: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando perfil...</p>
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
                        Você precisa fazer login para acessar seu perfil.
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

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-[#101B35] mb-2">
                                Meu Perfil
                            </h1>
                            <p className="text-gray-600">
                                Bem-vindo, {session.user.name || session.user.email}
                            </p>
                        </div>
                        {session.user.role === 'SELLER' && (
                            <Link
                                href="/seller/dashboard"
                                className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] text-sm font-medium"
                            >
                                Minha Loja
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#F5F7FA] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#101B35] mb-4">
                                Informações da Conta
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Nome:</span> {session.user.name || 'Não definido'}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Email:</span> {session.user.email}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Função:</span>
                                {session.user.role === 'SELLER' ? 'Vendedor' : 'Utilizador'}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">ID:</span> {session.user.id}
                            </p>
                        </div>

                        <div className="bg-[#F5F7FA] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#101B35] mb-4">
                                Ações da Conta
                            </h3>
                            <button
                                onClick={() => router.push('/products/create')}
                                className="w-full bg-[#2563EB] text-white px-4 py-2 rounded hover:bg-[#101B35] text-sm font-medium mb-3"
                            >
                                + Anunciar Produto
                            </button>
                            <button
                                onClick={() => {
                                    // Logout handled by next-auth
                                }}
                                className="w-full bg-transparent border border-red-200 text-red-700 px-4 py-2 rounded hover:bg-red-50 text-sm font-medium"
                            >
                                Sair da Conta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;