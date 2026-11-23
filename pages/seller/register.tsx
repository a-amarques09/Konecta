import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface SellerRegisterFormData {
    businessName: string;
    businessType: string;
    description: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    website?: string;
}

const SellerRegister: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<SellerRegisterFormData>({
        businessName: '',
        businessType: '',
        description: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        website: '',
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
            setError('Você precisa estar logado para se cadastrar como vendedor');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/seller/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data?.error || 'Erro ao criar perfil de vendedor. Tente novamente.');
                setLoading(false);
                return;
            }

            setSuccess('Perfil de vendedor criado com sucesso! Aguarde verificação.');

            setTimeout(() => {
                router.push('/seller/dashboard');
            }, 1500);
        } catch (err) {
            setError('Erro ao criar perfil de vendedor. Tente novamente.');
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
                        Você precisa fazer login para se cadastrar como vendedor.
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-[#2563EB] text-white px-6 py-2 rounded hover:bg-[#101B35]"
                    >
                        Fazer Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4 py-8">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#101B35] mb-4">
                        Cadastro de Vendedor
                    </h1>
                    <p className="text-gray-600">
                        Cadastre seu negócio na KONECTA e comece a vender.
                    </p>
                </div>

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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Negócio
                        </label>
                        <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            placeholder="Tech Solutions Angola"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Negócio
                        </label>
                        <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        >
                            <option value="">Selecione o tipo</option>
                            <option value="RETAIL">Varejo</option>
                            <option value="WHOLESALE">Atacado</option>
                            <option value="SERVICES">Serviços</option>
                            <option value="MANUFACTURING">Fabricação</option>
                            <option value="OTHER">Outro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            placeholder="Descreva seu negócio e o que você oferece..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Endereço
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder="Rua exemplo, 123"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cidade
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Telefone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder="+244 9XX XXX XXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email do Negócio
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                placeholder="contato@negocio.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Website (opcional)
                        </label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            placeholder="https://www.negocio.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#2563EB] text-white px-4 py-2 rounded-md font-medium hover:bg-[#101B35] disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar como Vendedor'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Já tem um perfil?{' '}
                        <a href="/seller/dashboard" className="text-[#2563EB] font-medium hover:underline">
                            Acessar Dashboard
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SellerRegister;