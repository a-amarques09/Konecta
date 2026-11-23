import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface ProductFormData {
    name: string;
    description: string;
    price: string;
    categoryId: string;
    condition: string;
    location: string;
    city: string;
    stock: string;
}

const ProductCreate: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        condition: 'USED',
        location: '',
        city: '',
        stock: '0',
    });
    const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 5) {
            setError('Máximo de 5 imagens permitidas');
            return;
        }
        setImages(files);
        setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
        URL.revokeObjectURL(imagePreviews[index]);
    };

    const loadCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const cats = await res.json();
            if (!res.ok) throw new Error(cats?.error);
            setCategories(cats.map((c: any) => ({ id: c.id, name: c.name })));
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!session?.user?.id) {
            setError('Você precisa estar logado para anunciar produtos');
            return;
        }

        if (!formData.categoryId) {
            setError('Selecione uma categoria');
            return;
        }

        if (images.length === 0) {
            setError('Pelo menos uma imagem é obrigatória');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/products/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    images: images.map((file) => ({ name: file.name })),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error);

            setSuccess('Produto criado com sucesso!');
            setTimeout(() => {
                router.push(`/products/${data.slug}`);
            }, 1500);
        } catch (err) {
            setError('Erro ao criar produto. Tente novamente.');
            console.error(err);
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

    if (!session.user.id) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <nav className="bg-[#101B35] text-white px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold">
                        KONECTA
                    </Link>
                    <Link
                        href="/seller/dashboard"
                        className="text-[#2563EB] hover:text-white"
                    >
                        ← Voltar ao Dashboard
                    </Link>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-[#101B35] mb-6">
                        Novo Produto
                    </h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome do Produto *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder="Smartphone Samsung Z Flip 8"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder="Descreva detalhadamente o produto..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Preço (Kz) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    placeholder="150000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoria *
                                </label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Condição *
                                </label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                >
                                    <option value="NEW">Novo</option>
                                    <option value="USED">Usado</option>
                                    <option value="REFURBISHED">Recondicionado</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estoque *
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Localização *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    placeholder="Luanda"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cidade *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    placeholder="Luanda"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Imagens do Produto *
                            </label>
                            <div className="flex items-start gap-4">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2563EB] file:text-white hover:file:bg-[#101B35] cursor-pointer"
                                />
                                <div className="flex flex-wrap gap-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-24 h-24 object-cover rounded-md border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Máximo 5 imagens. A primeira será a imagem principal.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2563EB] text-white px-6 py-3 rounded-md font-medium hover:bg-[#101B35] disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Criando produto...' : 'Publicar Produto'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductCreate;