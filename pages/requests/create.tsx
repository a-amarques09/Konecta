import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface RequestFormData {
    title: string;
    description: string;
    category: string;
    location: string;
    city: string;
    country: string;
    budget: string;
}

const RequestCreate: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<RequestFormData>({
        title: '',
        description: '',
        category: '',
        location: '',
        city: '',
        country: 'Angola',
        budget: '',
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!session?.user?.id) {
            setError('Você precisa estar logado para publicar uma procura');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    budget: formData.budget || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Erro ao criar procura');

            setSuccess('Procura publicada com sucesso!');
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (err) {
            setError('Erro ao publicar procura. Tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold text-[#101B35] mb-4">
                        Acesso Necessário
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Você precisa fazer login para publicar uma procura.
                    </p>
                    <Link
                        href="/login"
                        className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35] inline-block"
                    >
                        Fazer Login
                    </Link>
                    <br />
                    <a
                        href="/"
                        className="text-[#2563EB] text-sm font-medium hover:underline mt-2 inline-block">

                        Voltar ao início
                    </a>
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

            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-[#101B35] mb-6">
                        Publicar uma Procura
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
                                Título da Procura *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder="Preciso de um desenvolvedor web"
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
                                placeholder="Descreva o que você está procurando..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoria *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                >
                                    <option value="">Selecione uma categoria</option>
                                    <option value="Eletrónicos">Eletrónicos</option>
                                    <option value="Automóveis">Automóveis</option>
                                    <option value="Imóveis">Imóveis</option>
                                    <option value="Moda">Moda</option>
                                    <option value="Casa e decoração">Casa e decoração</option>
                                    <option value="Alimentação">Alimentação</option>
                                    <option value="Construção">Construção</option>
                                    <option value="Serviços profissionais">Serviços profissionais</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Orçamento (Kz) *
                                </label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    placeholder="50000"
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
                                País
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder="Angola"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2563EB] text-white px-6 py-3 rounded-md font-medium hover:bg-[#101B35] disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Publicando procura...' : 'Publicar Procura'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestCreate;