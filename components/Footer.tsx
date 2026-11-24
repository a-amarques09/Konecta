

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#101B35] text-white py-6 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* About KONECTA */}
                <div>
                    <h3 className="text-base sm:text-lg font-bold mb-3">Sobre a KONECTA</h3>
                    <p className="text-sm">
                        KONECTA é uma plataforma digital que conecta compradores, vendedores, empresas e profissionais independentes em um único ecossistema.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h3 className="text-base sm:text-lg font-bold mb-3">Links Úteis</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-sm hover:text-[#2563EB]">Como funciona</a></li>
                        <li><a href="#" className="text-sm hover:text-[#2563EB]">Contato</a></li>
                        <li><a href="#" className="text-sm hover:text-[#2563EB]">Termos e Condições</a></li>
                        <li><a href="#" className="text-sm hover:text-[#2563EB]">Política de Privacidade</a></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-base sm:text-lg font-bold mb-3">Siga-nos</h3>
                    <div className="flex space-x-3">
                        <a href="#" className="text-sm hover:text-[#2563EB]">Facebook</a>
                        <a href="#" className="text-sm hover:text-[#2563EB]">Instagram</a>
                        <a href="#" className="text-sm hover:text-[#2563EB]">LinkedIn</a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs sm:text-sm mt-6">
                © 2026 KONECTA. Todos os direitos reservados.
            </div>
        </footer>
    );
};

export default Footer;