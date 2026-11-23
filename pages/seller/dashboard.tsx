import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface SellerStats {
    totalProducts: number;
    totalSales: number;
    totalOrders: number;
    rating: number;
}

const SellerDashboard: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [sellerProfile, setSellerProfile] = useState<any>(null);
    const [stats, setStats] = useState<SellerStats>({
        totalProducts: 0,
        totalSales: 0,
        totalOrders: 0,
        rating: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>('overview');

    useEffect(() => {
        if (session?.user?.id) {
            loadSellerData();
        }
    }, [session]);

    const loadSellerData = async () => {
        try {
            const profile = await prisma.sellerProfile.findUnique({
                where: { userId: session!.user.id },
                include: {
                    user: {
                        select: {
                            products: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    isActive: true,
                                    createdAt: true,
                                    _count: {
                                        select: { orderItems: true },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (profile) {
                setSellerProfile(profile);
                const userProducts = profile.user.products;
                setStats({
                    totalProducts: userProducts.length,
                    totalSales: profile.totalSales,
                    totalOrders: userProducts.reduce(
                        (acc: number, p: any) => acc + p._count.orderItems,
                        0
                    ),
                    rating: Number(profile.rating),
                });
            }
        } catch (err) {
            console.error('Error loading seller data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!session) {
            router.push('/login');
        }
    }, [session, router]);

    if (!session) {
        return null;
    }

    if (!sellerProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold text-[#101B35] mb-4">
                        Perfil de Vendedor Não Encontrado
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Você precisa se cadastrar como vendedor primeiro.
                    </p>
                    <Link
                        href="/seller/register"
                        className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] inline-block"
                    >
                        Cadastrar como Vendedor
                    </Link>
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
                    <div className="flex items-center space-x-4">
                        <span className="text-sm">{session.user.name}</span>
                        <button
                            onClick={() => router.push('/profile')}
                            className="text-sm hover:text-[#2563EB]"
                        >
                            Perfil
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#101B35]">
                            Dashboard do Vendedor
                        </h1>
                        <p className="text-gray-600">
                            Bem-vindo, {sellerProfile.businessName}
                        </p>
                    </div>
                    <Link
                        href="/products/create"
                        className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] text-sm font-medium"
                    >
                        + Adicionar Produto
                    </Link>
                </div>

                {/* Verification Status Badge */}
                {!sellerProfile.isVerified && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
                        <p className="text-sm font-medium">
                            ⚠️ Seu perfil está pendente de verificação. Aguarde a aprovação da administração.
                        </p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Total de Produtos
                        </h3>
                        <p className="text-3xl font-bold text-[#101B35] mt-2">
                            {stats.totalProducts}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Total de Vendas
                        </h3>
                        <p className="text-3xl font-bold text-[#101B35] mt-2">
                            {stats.totalSales.toLocaleString('pt-AO', {
                                style: 'currency',
                                currency: 'AOA',
                            })}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Pedidos
                        </h3>
                        <p className="text-3xl font-bold text-[#101B35] mt-2">
                            {stats.totalOrders}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Avaliação
                        </h3>
                        <p className="text-3xl font-bold text-[#101B35] mt-2">
                            {stats.rating.toFixed(1)} / 5.0
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 border-b-2 font-medium text-sm ${activeTab === 'overview'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Visão Geral
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-3 border-b-2 font-medium text-sm ${activeTab === 'products'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Produtos ({stats.totalProducts})
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 border-b-2 font-medium text-sm ${activeTab === 'orders'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Pedidos ({stats.totalOrders})
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-[#101B35] mb-4">
                            Resumo do Negócio
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Informações do Negócio</h4>
                                <p className="text-gray-600 mb-1"><strong>Nome:</strong> {sellerProfile.businessName}</p>
                                <p className="text-gray-600 mb-1"><strong>Tipo:</strong> {sellerProfile.businessType}</p>
                                <p className="text-gray-600 mb-1"><strong>Cidade:</strong> {sellerProfile.city}, Angola</p>
                                <p className="text-gray-600 mb-1"><strong>Telefone:</strong> {sellerProfile.phone}</p>
                                <p className="text-gray-600 mb-1"><strong>Email:</strong> {sellerProfile.email}</p>
                                {sellerProfile.website && (
                                    <p className="text-gray-600 mb-1"><strong>Website:</strong> {sellerProfile.website}</p>
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Descrição</h4>
                                <p className="text-gray-600">{sellerProfile.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-[#101B35] mb-4">
                            Seus Produtos
                        </h3>
                        {loading ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Carregando produtos...</p>
                            </div>
                        ) : sellerProfile.user.products.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Você ainda não tem produtos cadastrados.</p>
                                <Link
                                    href="/products/create"
                                    className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] inline-block mt-4"
                                >
                                    + Adicionar Primeiro Produto
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-3 px-4 text-sm font-medium text-gray-500">Produto</th>
                                            <th className="py-3 px-4 text-sm font-medium text-gray-500">Preço</th>
                                            <th className="py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                            <th className="py-3 px-4 text-sm font-medium text-gray-500">Criado em</th>
                                            <th className="py-3 px-4 text-sm font-medium text-gray-500">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sellerProfile.user.products.map((product: any) => (
                                            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-700">{product.name}</td>
                                                <td className="py-3 px-4 text-gray-700">
                                                    {product.price.toLocaleString('pt-AO', {
                                                        style: 'currency',
                                                        currency: 'AOA',
                                                    })}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}
                                                    >
                                                        {product.isActive ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-700">
                                                    {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Link
                                                        href={`/products/${product.id}`}
                                                        className="text-[#2563EB] text-sm hover:underline"
                                                    >
                                                        Ver
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-[#101B35] mb-4">
                            Pedidos Recentes
                        </h3>
                        <p className="text-gray-500">
                            Gerenciamento de pedidos estará disponível em breve.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;