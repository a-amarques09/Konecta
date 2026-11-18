

const LookingForSomething: React.FC = () => {
    return (
        <section className="bg-[#101B35] text-white py-16 px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Não encontraste o que procuras?</h2>
            <p className="text-lg mb-8">
                Publica aquilo de que precisas e recebe propostas de vendedores e empresas.
            </p>
            <button className="bg-[#2563EB] text-white px-8 py-3 rounded hover:bg-white hover:text-[#2563EB]">
                Publicar uma procura
            </button>
        </section>
    );
};

export default LookingForSomething;