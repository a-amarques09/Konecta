import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

interface ProductCardData {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    condition: string;
    city: string;
    country: string;
    isActive: boolean;
    images: Array<{ url: string; isPrimary: boolean }>;
    seller: {
        id: string;
        name: string | null;
        sellerProfile: {
            businessName: string;
            isVerified: boolean;
        } | null;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
}

interface FilterState {
    search: string;
    category: string;
    condition: string;
    minPrice: string;
    maxPrice: string;
    city: string;
}

const ProductsPage: React.FC = () => {
    const { data: session } = useSession();
    const [products, setProducts] = useState<ProductCardData[]>([]);
    const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
    const [filter, setFilter] = useState<FilterState>({
        search: '',
        category: '',
        condition: '',
        minPrice: '',
        maxPrice: '',
        city: '',
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, [filter, currentPage]);

    const loadCategories = async () => {
        try {
            const cats = await prisma.category.findMany({
                select: { id: true, name: true },
                orderBy: { name: 'asc' },
            });
            setCategories(cats);
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true);

            const where: any = {
                isActive: true,
            };

            if (filter.search) {
                where.OR = [
                    { name: { contains: filter.search, mode: 'insensitive' } },
                    { description: { contains: filter.search, mode: 'insensitive' } },
                ];
            }

            if (filter.category) {
                where.categoryId = filter.category;
            }

            if (filter.condition) {
                where.condition = filter.condition;
            }

            if (filter.minPrice) {
                where.price = { ...where.price, gte: parseFloat(filter.minPrice) };
            }

            if (filter.maxPrice) {
                where.price = { ...where.price, lte: parseFloat(filter.maxPrice) };
            }

            if (filter.city) {
                where.city = { contains: filter.city, mode: 'insensitive' };
            }

            const [productData, totalCount] = await Promise.all([
                prisma.product.findMany({
                    where,
                    include: {
                        seller: {
                            include: {
                                sellerProfile: true,
                            },
                        },
                        category: true,
                        images: {
                            where: { isPrimary: true },
                            take: 1,
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    skip: (currentPage - 1) * ITEMS_PER_PAGE,
                    take: ITEMS_PER_PAGE,
                }),
                prisma.product.count({ where }),
            ]);

            setProducts(
                productData.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: Number(p.price),
                    currency: p.currency,
                    condition: p.condition,
                    city: p.city,
                    country: p.country,
                    isActive: p.isActive,
                    images: p.images,
                    seller: {
                        id: p.seller.id,
                        name: p.seller.name,
                        sellerProfile: p.seller.sellerProfile,
                    },
                    category: p.category,
                }))
            );

            setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE));
        } catch (err) {
            setError('Erro ao carregar produtos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilter((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilter({
            search: '',
            category: '',
            condition: '',
            minPrice: '',
            maxPrice: '',
            city: '',
        });
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando produtos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold text-[#101B35] mb-4">{error}</h1>
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
                        <Link href="/products" className="text-[#2563EB]">Explorar</Link>
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#101B35]">Produtos</h1>
                        <p className="text-gray-600">
                            Encontre o que procura na KONECTA
                        </p>
                    </div>
                    {session?.user?.role === 'SELLER' && (
                        <Link
                            href="/products/create"
                            className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] text-sm font-medium"
                        >
                            + Anunciar Produto
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Buscar
                            </label>
                            <input
                                type="text"
                                value={filter.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Pesquisar produtos..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Categoria
                            </label>
                            <select
                                value={filter.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            >
                                <option value="">Todas as categorias</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Condição
                            </label>
                            <select
                                value={filter.condition}
                                onChange={(e) => handleFilterChange('condition', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            >
                                <option value="">Todas as condições</option>
                                <option value="NEW">Novo</option>
                                <option value="USED">Usado</option>
                                <option value="REFURBISHED">Recondicionado</option>
                            </select>
                        </div>

                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cidade
                            </label>
                            <input
                                type="text"
                                value={filter.city}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                placeholder="Cidade"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 min-w-[120px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preço Mín (Kz)
                            </label>
                            <input
                                type="number"
                                value={filter.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            />
                        </div>
                        <div className="flex-1 min-w-[120px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preço Máx (Kz)
                            </label>
                            <input
                                type="number"
                                value={filter.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Limpar Filtros
                        </button>
                        {products.length > 0 && (
                            <span className="text-sm text-gray-500 self-center">
                                {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#101B35] mb-2">
                            Nenhum produto encontrado
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Tente ajustar seus filtros de busca.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35]"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                            {product.city}, {product.country}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                            <span>
                                                {product.condition === 'NEW' ? 'Novo' : product.condition === 'USED' ? 'Usado' : 'Recondicionado'}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {product.seller.sellerProfile?.businessName || product.seller.name || 'Vendedor'}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#2563EB] text-white hover:bg-[#101B35]'
                                }`}
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 text-sm text-gray-600">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#2563EB] text-white hover:bg-[#101B35]'
                                }`}
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;