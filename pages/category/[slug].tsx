import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryDetailData {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    products: Array<{
        id: string;
        name: string;
        slug: string;
        price: number;
        description: string;
        location: string;
        city: string;
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
    }>;
    children: Array<{
        id: string;
        name: string;
        slug: string;
        _count: {
            products: number;
        };
    }>;
    parent: {
        id: string;
        name: string;
        slug: string;
    } | null;
}

const CategoryDetail: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [category, setCategory] = useState<CategoryDetailData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const { slug } = router.query as { slug: string };
        loadCategory(slug);
    }, [router.query]);

    const loadCategory = async (slug: string) => {
        try {
            const res = await fetch(`/api/categories/${slug}`);
            const cat = await res.json();
            if (!res.ok) throw new Error(cat?.error);

            if (cat) {
                setCategory({
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    description: cat.description,
                    image: cat.image,
                    parentId: cat.parentId,
                    products: cat.products,
                    children: cat.children,
                    parent: cat.parent,
                });
            } else {
                setError('Categoria não encontrada');
            }
        } catch (err) {
            setError('Erro ao carregar categoria');
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
                    <p className="text-gray-600">Carregando categoria...</p>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold text-[#101B35] mb-4">
                        {error || 'Categoria não encontrada'}
                    </h1>
                    <Link
                        href="/categories"
                        className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] inline-block"
                    >
                        Ver Todas as Categorias
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
                {category.parent && (
                    <nav className="mb-6 text-sm text-gray-600">
                        <ol className="flex space-x-2">
                            <li>
                                <Link href="/categories" className="hover:text-[#2563EB]">
                                    Categorias
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/category/${category.parent.slug}`}
                                    className="hover:text-[#2563EB]"
                                >
                                    {category.parent.name}
                                </Link>
                            </li>
                            <li>
                                <span className="text-[#101B35] font-medium">{category.name}</span>
                            </li>
                        </ol>
                    </nav>
                )}

                {/* Category Header */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        <div className="h-64 bg-gray-200 relative overflow-hidden">
                            {category.image ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    Sem imagem
                                </div>
                            )}
                        </div>
                        <div className="p-8 flex flex-col justify-center">
                            <h1 className="text-3xl font-bold text-[#101B35] mb-4">
                                {category.name}
                            </h1>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {category.description || 'Sem descrição disponível'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>
                                    {category.products.length} produto{category.products.length !== 1 ? 's' : ''}
                                </span>
                                {category.children && category.children.length > 0 && (
                                    <span>
                                        {category.children.length} subcategoria{category.children.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subcategories */}
                {category.children && category.children.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-[#101B35] mb-4">
                            Subcategorias
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {category.children.map((child) => (
                                <div
                                    key={child.id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow"
                                >
                                    <Link
                                        href={`/category/${child.slug}`}
                                        className="block"
                                    >
                                        <h4 className="font-semibold text-[#101B35] mb-2">
                                            {child.name}
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            {child._count.products} produto{child._count.products !== 1 ? 's' : ''}
                                        </p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#101B35]">
                            Produtos em {category.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                            {category.products.length} encontrado{category.products.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {category.products.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500">
                                Nenhum produto disponível nesta categoria no momento.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                            {category.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                >
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
                                            href={`/products/${product.slug}`}
                                            className="block"
                                        >
                                            <h4 className="font-semibold text-[#101B35] mb-1 line-clamp-2">
                                                {product.name}
                                            </h4>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                                <span>
                                                    {product.city}
                                                </span>
                                                {product.seller.sellerProfile?.isVerified && (
                                                    <span className="text-green-600 text-xs font-medium">
                                                        ✓ Verificado
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
        </div>
    );
};

export default CategoryDetail;