

const LookingForSomething: React.FC = () => {
    return (
        <section className="bg-[#101B35] text-white py-12 px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Não encontraste o que procuras?</h2>
            <p className="text-base sm:text-lg mb-6">
                Publica aquilo de que precisas e recebe propostas de vendedores e empresas.
            </p>
            <button className="w-full sm:w-auto bg-[#2563EB] text-white px-6 py-3 rounded hover:bg-white hover:text-[#2563EB]">
                Publicar uma procura
            </button>
        </section>
    );
};

export default LookingForSomething;