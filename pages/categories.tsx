import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

interface CategoryData {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    children?: CategoryData[];
    _count: {
        products: number;
    };
}

const CategoriesPage: React.FC = () => {
    const { data: session } = useSession();
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const cats = await prisma.category.findMany({
                where: { parentId: null },
                include: {
                    _count: {
                        select: { products: true },
                    },
                    children: {
                        include: {
                            _count: {
                                select: { products: true },
                            },
                        },
                    },
                },
                orderBy: { name: 'asc' },
            });

            setCategories(cats);
        } catch (err) {
            setError('Erro ao carregar categorias');
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
                    <p className="text-gray-600">Carregando categorias...</p>
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
                        <Link href="/products" className="hover:text-[#2563EB]">Explorar</Link>
                        <Link href="/categories" className="text-[#2563EB]">Categorias</Link>
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
                        <h1 className="text-3xl font-bold text-[#101B35]">Categorias</h1>
                        <p className="text-gray-600">
                            Explore produtos por categoria na KONECTA
                        </p>
                    </div>
                    {session?.user?.role === 'ADMIN' && (
                        <Link
                            href="/admin/categories"
                            className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] text-sm font-medium"
                        >
                            + Gerenciar Categorias
                        </Link>
                    )}
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">Nenhuma categoria encontrada.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                            >
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {category.image ? (
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 640px) 100vw, 25vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            Sem imagem
                                        </div>
                                    )}
                                    <Link
                                        href={`/category/${category.slug}`}
                                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors flex items-center justify-center"
                                    >
                                        <span className="text-white font-semibold text-lg">
                                            Ver Produtos
                                        </span>
                                    </Link>
                                </div>
                                <div className="p-6">
                                    <Link
                                        href={`/category/${category.slug}`}
                                        className="block"
                                    >
                                        <h3 className="text-lg font-bold text-[#101B35] mb-2">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {category.description || 'Sem descrição disponível'}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>
                                                {category._count.products} produto{category._count.products !== 1 ? 's' : ''}
                                            </span>
                                            {category.children && category.children.length > 0 && (
                                                <span className="text-[#2563EB] font-medium">
                                                    {category.children.length} subcategoria{category.children.length !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;