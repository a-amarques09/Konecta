// filepath: /Users/LUZIA/Documentos PS Abel Marques/Amaro/Visual code/Konecta/pages/index.tsx
import Navbar from '../components/navbar';
import HeroSection from '../components/HeroSection';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedProducts from '../components/FeaturedProducts';
import FeaturedProfessionals from '../components/FeaturedProfessionals';
import BusinessSection from '../components/BusinessSection';
import LookingForSomething from '../components/LookingForSomething';
import Footer from '../components/Footer';

const Home: React.FC = () => {
    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <HeroSection />

            {/* Categories Section */}
            <CategoriesSection />

            {/* Featured Products Section */}
            <FeaturedProducts />

            {/* Featured Professionals Section */}
            <FeaturedProfessionals />

            {/* Discover Businesses Section */}
            <BusinessSection />

            {/* Looking for Something Section */}
            <LookingForSomething />

            {/* Footer */}
            <Footer />
        </div>

    );
};
export default Home;

