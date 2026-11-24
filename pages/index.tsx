// filepath: /Users/LUZIA/Documentos PS Abel Marques/Amaro/Visual code/Konecta/pages/index.tsx
import Navbar from '../components/navbar';
import HeroSection from '../components/HeroSection';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedProducts from '../components/FeaturedProducts';
import FeaturedProfessionals from '../components/FeaturedProfessionals';
import BusinessSection from '../components/BusinessSection';
import LookingForSomething from '../components/LookingForSomething';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
// This will cause the error because there's no default export
console.log("Hello, World!");


const Home: React.FC = () => {

    return (
        <div className="min-h-screen pb-20 md:pb-0">

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

            {/* Bottom Navigation - Mobile Only */}
            <BottomNavigation />
        </div>

    );
};
export default Home;