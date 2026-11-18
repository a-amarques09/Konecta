

const HeroSection: React.FC = () => {
    return (
        <section className="bg-[#F5F7FA] text-center py-16 px-6">
            {/* Headline */}
            <h1 className="text-4xl font-bold text-[#101B35] mb-4">
                Encontra. Compra. Vende. Cresce.
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-[#101B35] mb-8">
                Um só lugar para descobrir produtos, encontrar serviços e fazer crescer negócios.
            </p>

            {/* Search Bar */}
            <div className="flex justify-center items-center mb-6">
                <input
                    type="text"
                    placeholder="O que procuras hoje?"
                    className="w-full max-w-lg px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
                <button className="bg-[#2563EB] text-white px-6 py-3 rounded-r-md hover:bg-[#101B35]">
                    Procurar
                </button>
            </div>

            {/* Prominent Button */}
            <button className="bg-[#2563EB] text-white px-8 py-3 rounded hover:bg-[#101B35]">
                Estou à procura
            </button>
        </section>
    );
};

export default HeroSection;