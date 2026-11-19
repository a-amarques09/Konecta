import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

interface SellerProfileData {
    id: string;
    businessName: string;
    businessType: string;
    description: string | null;
    address: string | null;
    city: string | null;
    country: string;
    phone: string | null;
    email: string | null;
    website: string | null;
    isVerified: boolean;
    rating: number;
    totalSales: number;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
        products: Array<{
            id: string;
            name: string;
            price: number;
            description: string;
            isActive: boolean;
            images: Array<{ url: string; isPrimary: boolean }>;
        }>;
    };
}

const SellerProfile: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [seller, setSeller] = useState<SellerProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const { id } = router.query as { id: string };
        loadSellerProfile(id);
    }, [router.query]);

    const loadSellerProfile = async (id: string) => {
        try {
            const profile = await prisma.sellerProfile.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            products: {
                                where: { isActive: true },
                                include: {
                                    images: {
                                        where: { isPrimary: true },
                                        take: 1,
                                    },
                                },
                                orderBy: { createdAt: 'desc' },
                            },
                        },
                    },
                },
            });

            if (profile) {
                setSeller({
                    id: profile.id,
                    businessName: profile.businessName,
                    businessType: profile.businessType,
                    description: profile.description,
                    address: profile.address,
                    city: profile.city,
                    country: profile.country,
                    phone: profile.phone,
                    email: profile.email,
                    website: profile.website,
                    isVerified: profile.isVerified,
                    rating: Number(profile.rating),
                    totalSales: profile.totalSales,
                    createdAt: profile.createdAt,
                    user: {
                        id: profile.user.id,
                        name: profile.user.name,
                        email: profile.user.email,
                        image: profile.user.image,
                        products: profile.user.products.map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            price: Number(p.price),
                            description: p.description,
                            isActive: p.isActive,
                            images: p.images,
                        })),
                    },
                });
            } else {
                setError('Vendedor não encontrado');
            }
        } catch (err) {
            setError('Erro ao carregar perfil do vendedor');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold text-[#101B35] mb-4">
                        {error || 'Perfil não encontrado'}
                    </h1>
                    <Link
                        href="/"
                        className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] inline-block"
                    >
                        Voltar ao Início
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
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="hover:text-[#2563EB]">Início</Link>
                        <Link href="/products" className="hover:text-[#2563EB]">Explorar</Link>
                        <Link href="/categories" className="hover:text-[#2563EB]">Categorias</Link>
                        {session && (
                            <>
                                <Link href="/profile" className="hover:text-[#2563EB]">Perfil</Link>
                                <button
                                    onClick={() => { }}
                                    className="text-sm hover:text-[#2563EB]"
                                >
                                    Sair
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        <div className="h-64 bg-gray-200 flex items-center justify-center">
                            {seller.user.image ? (
                                <Image
                                    src={seller.user.image}
                                    alt={seller.user.name || 'Usuário'}
                                    fill
                                    className="object-cover w-full h-full"
                                    sizes="(max-width: 640px) 100vw, 33vw"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold text-xl">
                                    {seller.user.name ? seller.user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                        </div>
                        <div className="p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-2xl font-bold text-[#101B35]">
                                    {seller.businessName}
                                </h1>
                                {seller.isVerified && (
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                                        Verificado
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                {seller.businessType} • {seller.city}, {seller.country}
                            </p>
                            <p className="text-gray-700 mb-4 line-clamp-3">
                                {seller.description || 'Sem descrição disponível'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>
                                    ⭐ {seller.rating.toFixed(1)} / 5.0
                                </span>
                                <span>
                                    📊 {seller.totalSales} vendas
                                </span>
                                <span>
                                    📅 Membro desde {new Date(seller.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 flex items-center justify-end">
                            {session?.user?.id === seller.user.id ? (
                                <Link
                                    href="/seller/dashboard"
                                    className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] text-sm font-medium"
                                >
                                    Gerenciar Loja
                                </Link>
                            ) : (
                                <button
                                    className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] text-sm font-medium"
                                >
                                    Mensagem
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-bold text-[#101B35] mb-4">
                        Informações de Contato
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {seller.phone && (
                            <div className="flex items-center gap-3">
                                <span className="text-[#2563EB]">📞</span>
                                <span className="text-gray-700">{seller.phone}</span>
                            </div>
                        )}
                        {seller.email && (
                            <div className="flex items-center gap-3">
                                <span className="text-[#2563EB]">✉️</span>
                                <span className="text-gray-700">{seller.email}</span>
                            </div>
                        )}
                        {seller.address && (
                            <div className="flex items-center gap-3">
                                <span className="text-[#2563EB]">📍</span>
                                <span className="text-gray-700">{seller.address}, {seller.city}</span>
                            </div>
                        )}
                        {seller.website && (
                            <div className="flex items-center gap-3">
                                <span className="text-[#2563EB]">🌐</span>
                                <a
                                    href={seller.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2563EB] hover:underline text-gray-700"
                                >
                                    {seller.website}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Products */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-[#101B35]">
                            Produtos ({seller.user.products.length})
                        </h3>
                    </div>

                    {seller.user.products.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500">
                                Este vendedor não tem produtos disponíveis no momento.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                            {seller.user.products.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        {product.images.length > 0 ? (
                                            <Image
                                                src={product.images[0].url}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                Sem imagem
                                            </div>
                                        )}
                                        <span className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                                            {product.price.toLocaleString('pt-AO', {
                                                style: 'currency',
                                                currency: 'AOA',
                                            })}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="block"
                                        >
                                            <h4 className="font-semibold text-[#101B35] mb-1 line-clamp-2">
                                                {product.name}
                                            </h4>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {product.description}
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;