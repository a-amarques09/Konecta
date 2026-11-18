import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

interface ProductDetailData {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    stock: number;
    condition: string;
    location: string;
    city: string;
    country: string;
    isActive: boolean;
    isFeatured: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
    seller: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
        sellerProfile: {
            businessName: string;
            businessType: string;
            description: string | null;
            phone: string | null;
            email: string | null;
            website: string | null;
            isVerified: boolean;
            rating: number;
            totalSales: number;
        } | null;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
    images: Array<{
        id: string;
        url: string;
        alt: string | null;
        isPrimary: boolean;
    }>;
}

const ProductDetail: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [product, setProduct] = useState<ProductDetailData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

    useEffect(() => {
        const { slug } = router.query as { slug: string };
        loadProduct(slug);
    }, [router.query]);

    const loadProduct = async (slug: string) => {
        try {
            const productData = await prisma.product.findUnique({
                where: { slug },
                include: {
                    seller: {
                        include: {
                            sellerProfile: true,
                        },
                    },
                    category: true,
                    images: {
                        orderBy: { isPrimary: 'desc' },
                    },
                },
            });

            if (productData) {
                // Increment view count
                await prisma.product.update({
                    where: { id: productData.id },
                    data: { views: { increment: 1 } },
                });

                setProduct({
                    id: productData.id,
                    name: productData.name,
                    slug: productData.slug,
                    description: productData.description,
                    price: Number(productData.price),
                    currency: productData.currency,
                    stock: productData.stock,
                    condition: productData.condition,
                    location: productData.location,
                    city: productData.city,
                    country: productData.country,
                    isActive: productData.isActive,
                    isFeatured: productData.isFeatured,
                    views: productData.views,
                    createdAt: productData.createdAt,
                    updatedAt: productData.updatedAt,
                    seller: {
                        id: productData.seller.id,
                        name: productData.seller.name,
                        email: productData.seller.email,
                        image: productData.seller.image,
                        sellerProfile: productData.seller.sellerProfile,
                    },
                    category: productData.category,
                    images: productData.images,
                });
            } else {
                setError('Produto não encontrado');
            }
        } catch (err) {
            setError('Erro ao carregar produto');
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
                    <p className="text-gray-600">Carregando produto...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold text-[#101B35] mb-4">
                        {error || 'Produto não encontrado'}
                    </h1>
                    <Link
                        href="/products"
                        className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] inline-block"
                    >
                        Ver Todos os Produtos
                    </Link>
                </div>
            </div>
        );
    }

    const isOwner = session?.user?.id === product.seller.id;
    const isVerified = product.seller.sellerProfile?.isVerified || false;

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
                                {session.user.role === 'SELLER' && (
                                    <Link href="/seller/dashboard" className="hover:text-[#2563EB]">Minha Loja</Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-gray-600">
                    <ol className="flex space-x-2">
                        <li>
                            <Link href="/" className="hover:text-[#2563EB]">Início</Link>
                        </li>
                        <li>
                            <Link href="/products" className="hover:text-[#2563EB]">Produtos</Link>
                        </li>
                        <li>
                            <Link
                                href={`/category/${product.category.slug}`}
                                className="hover:text-[#2563EB]"
                            >
                                {product.category.name}
                            </Link>
                        </li>
                        <li>
                            <span className="text-[#101B35] font-medium">{product.name}</span>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Product Images */}
                    <div className="lg:col-span-6">
                        <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                            {product.images.length > 0 ? (
                                <Image
                                    src={product.images[activeImageIndex].url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    Sem imagem
                                </div>
                            )}
                            {product.images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {product.images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImageIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-colors ${activeImageIndex === index
                                                    ? 'bg-[#2563EB]'
                                                    : 'bg-white/50 hover:bg-white/80'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => setActiveImageIndex(index)}
                                    className={`aspect-square bg-gray-200 rounded-md overflow-hidden border-2 ${activeImageIndex === index
                                            ? 'border-[#2563EB]'
                                            : 'border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt || product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-6">
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-2xl font-bold text-[#101B35]">
                                {product.name}
                            </h1>
                            {isVerified && (
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                                    ✓ Verificado
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <span>
                                {product.condition === 'NEW' ? 'Novo' : product.condition === 'USED' ? 'Usado' : 'Recondicionado'}
                            </span>
                            <span>•</span>
                            <span>{product.city}, {product.country}</span>
                        </div>

                        <div className="mb-6">
                            <span className="text-3xl font-bold text-[#101B35]">
                                {product.price.toLocaleString('pt-AO', {
                                    style: 'currency',
                                    currency: 'AOA',
                                })}
                            </span>
                            {product.stock === 0 && (
                                <span className="ml-2 text-red-600 font-medium">Esgotado</span>
                            )}
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                Descrição
                            </h3>
                            <p className="text-gray-700 line-clamp-5">
                                {product.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-medium">Vendedor</p>
                                <p className="font-medium text-gray-700">
                                    {product.seller.sellerProfile?.businessName || product.seller.name || 'Usuário'}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-medium">Categoria</p>
                                <p className="font-medium text-gray-700">
                                    {product.category.name}
                                </p>
                            </div>
                        </div>

                        {product.stock > 0 ? (
                            <button
                                onClick={() => { }}
                                className="w-full bg-[#2563EB] text-white px-6 py-3 rounded-md font-medium hover:bg-[#101B35] transition-colors flex items-center justify-center gap-2"
                            >
                                <span>💬</span> Contactar Vendedor
                            </button>
                        ) : (
                            <button disabled className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-md font-medium cursor-not-allowed">
                                Produto Esgotado
                            </button>
                        )}

                        {isOwner && (
                            <div className="mt-4 flex gap-2">
                                <Link
                                    href="/seller/dashboard"
                                    className="flex-1 bg-transparent border border-[#2563EB] text-[#2563EB] px-6 py-3 rounded-md font-medium hover:bg-[#2563EB] hover:text-white text-center transition-colors"
                                >
                                    Gerenciar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Seller Info Section */}
                <div className="mt-12 bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            {product.seller.image ? (
                                <Image
                                    src={product.seller.image}
                                    alt={product.seller.name || 'Usuário'}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <span className="text-gray-500 font-medium text-sm">
                                    {product.seller.name ? product.seller.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-[#101B35]">
                                {product.seller.sellerProfile?.businessName || product.seller.name || 'Vendedor'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {product.seller.sellerProfile?.businessType || ''}
                                {isVerified && ' • ✓ Verificado'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.seller.sellerProfile?.phone && (
                            <div className="flex items-center gap-3">
                                <span className="text-[#2563EB]">📞</span>
                                <span className="text-gray-700">{product.seller.sellerProfile.phone}</span>
                            </div>
                        )}
                        {product.seller.sellerProfile?.email && (
                            <div className="flex items-center gap-3">
                                <span className="text-[#2563EB]">✉️</span>
                                <span className="text-gray-700">{product.seller.sellerProfile.email}</span>
                            </div>
                        )}
                        {product.seller.sellerProfile?.city && (
                            <div className="flex items-center gap-3">
                                <span className="text-[#2563EB]">📍</span>
                                <span className="text-gray-700">{product.seller.sellerProfile.city}, {product.country}</span>
                            </div>
                        )}
                        {product.seller.sellerProfile?.website && (
                            <div className="flex items-center gap-3">
                                <span className="text-[#2563EB]">🌐</span>
                                <a
                                    href={product.seller.sellerProfile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2563EB] hover:underline text-sm"
                                >
                                    {product.seller.sellerProfile.website}
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <h4 className="font-medium text-gray-700 mb-2">Sobre o Vendedor</h4>
                        <p className="text-gray-600 line-clamp-3">
                            {product.seller.sellerProfile?.description || 'Sem descrição disponível'}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <span>⭐ {product.seller.sellerProfile?.rating.toFixed(1) || '0.0'} / 5.0</span>
                        <span>•</span>
                        <span>📊 {product.seller.sellerProfile?.totalSales || 0} vendas</span>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-[#101B35] mb-6">
                        Produtos Relacionados
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Placeholder for related products - would fetch from API in production */}
                        <div className="text-center py-10 text-gray-500">
                            Nenhum produto relacionado encontrado.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;