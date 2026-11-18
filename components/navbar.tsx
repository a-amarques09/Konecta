

const Navbar: React.FC = () => {
    return (
        <nav className="bg-[#101B35] text-white px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <div className="text-xl font-bold">KONECTA</div>

            {/* Navigation Links */}
            <ul className="hidden md:flex space-x-6">
                <li className="hover:text-[#2563EB] cursor-pointer">Início</li>
                <li className="hover:text-[#2563EB] cursor-pointer">Explorar</li>
                <li className="hover:text-[#2563EB] cursor-pointer">Serviços</li>
                <li className="hover:text-[#2563EB] cursor-pointer">Empresas</li>
            </ul>

            {/* Buttons */}
            <div className="space-x-4">
                <button className="bg-transparent border border-white px-4 py-2 rounded hover:bg-[#2563EB]">
                    Entrar
                </button>
                <button className="bg-[#2563EB] px-4 py-2 rounded hover:bg-white hover:text-[#2563EB]">
                    Criar conta
                </button>
            </div>
        </nav>
    );
};

export default Navbar;