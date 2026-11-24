

const HeroSection: React.FC = () => {
    return (
        <section className="bg-[#F5F7FA] text-center py-12 px-4">
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#101B35] mb-4">
                Encontra. Compra. Vende. Cresce.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#101B35] mb-6">
                Um só lugar para descobrir produtos, encontrar serviços e fazer crescer negócios.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-2">
                <input
                    type="text"
                    placeholder="O que procuras hoje?"
                    className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] sm:rounded-l-md sm:rounded-r-none"
                />
                <button className="w-full sm:w-auto bg-[#2563EB] text-white px-6 py-3 rounded-md hover:bg-[#101B35] sm:rounded-r-md sm:rounded-l-none">
                    Procurar
                </button>
            </div>

        </section>
    );
};

export default HeroSection;