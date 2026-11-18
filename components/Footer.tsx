

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#101B35] text-white py-8 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* About KONECTA */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Sobre a KONECTA</h3>
                    <p className="text-sm">
                        KONECTA é uma plataforma digital que conecta compradores, vendedores, empresas e profissionais independentes em um único ecossistema.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Links Úteis</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-[#2563EB]">Como funciona</a></li>
                        <li><a href="#" className="hover:text-[#2563EB]">Contato</a></li>
                        <li><a href="#" className="hover:text-[#2563EB]">Termos e Condições</a></li>
                        <li><a href="#" className="hover:text-[#2563EB]">Política de Privacidade</a></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Siga-nos</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-[#2563EB]">Facebook</a>
                        <a href="#" className="hover:text-[#2563EB]">Instagram</a>
                        <a href="#" className="hover:text-[#2563EB]">LinkedIn</a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-sm mt-8">
                © 2023 KONECTA. Todos os direitos reservados.
            </div>
        </footer>
    );
};

export default Footer;