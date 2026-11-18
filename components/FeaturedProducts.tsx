import { useState, useEffect } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

interface ProductData {
    id: string;
    name: string;
    price: number;
    currency: string;
    city: string;
    country: string;
    images: Array<{ url: string; isPrimary: boolean }>;
    seller: {
        id: string;
        name: string | null;
        sellerProfile: {
            businessName: string;
            isVerified: boolean;
        } | null;
    };
}

const FeaturedProducts: React.FC = () => {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            const productData = await prisma.product.findMany({
                where: {
                    isActive: true,
                    isFeatured: true,
                },
                include: {
                    seller: {
                        include: {
                            sellerProfile: true,
                        },
                    },
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 8,
            });

            setProducts(
                productData.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    price: Number(p.price),
                    currency: p.currency,
                    city: p.city,
                    country: p.country,
                    images: p.images,
                    seller: {
                        id: p.seller.id,
                        name: p.seller.name,
                        sellerProfile: p.seller.sellerProfile,
                    },
                }))
            );
        } catch (err) {
            console.error('Error loading featured products:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="bg-[#F5F7FA] py-16 px-6">
                <h2 className="text-3xl font-bold text-[#101B35] text-center mb-8">
                    Produtos em Destaque
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md border border-gray-100 animate-pulse">
                            <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                            <div className="p-4">
                                <h3 className="h-6 bg-gray-200 rounded mb-2"></h3>
                                <p className="h-4 bg-gray-200 rounded mb-2 w-3/4"></p>
                                <p className="h-4 bg-gray-200 rounded w-1/2"></p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return (
            <section className="bg-[#F5F7FA] py-16 px-6">
                <h2 className="text-3xl font-bold text-[#101B35] text-center mb-8">
                    Produtos em Destaque
                </h2>
                <div className="text-center py-10">
                    <p className="text-gray-500">Nenhum produto em destaque no momento.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#F5F7FA] py-16 px-6">
            <h2 className="text-3xl font-bold text-[#101B35] text-center mb-8">
                Produtos em Destaque
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                    >
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                            {product.images.length > 0 ? (
                                <Image
                                    src={product.images[0].url}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                            {product.seller.sellerProfile?.isVerified && (
                                <span className="absolute bottom-2 left-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                                    ✓ Verificado
                                </span>
                            )}
                        </div>
                        <div className="p-4">
                            <Link
                                href={`/products/${product.slug}`}
                                className="block"
                            >
                                <h4 className="font-semibold text-[#101B35] mb-1 line-clamp-2">
                                    {product.name}
                                </h4>
                                <p className="text-gray-600 text-sm line-clamp-1 mb-3">
                                    {product.city}, {product.country}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <span>
                                        {product.seller.sellerProfile?.businessName || product.seller.name || 'Vendedor'}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;