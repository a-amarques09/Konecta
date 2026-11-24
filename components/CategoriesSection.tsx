'use client';

import CategoryCard from './CategoryCard';
import { useState, useEffect } from 'react';

interface CategoryData {
    id: string;
    name: string;
    slug: string;
    image: string | null;
}

const CategoriesSection: React.FC = () => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (!res.ok) throw new Error('Failed to load categories');
            const data = await res.json();
            setCategories(data.map((c: any) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                image: c.image || '/images/professional-services.jpg',
            })));
        } catch (err) {
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="bg-white py-12 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#101B35] text-center mb-6">
                    Categorias
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-[#F5F7FA] rounded-lg animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-t-lg"></div>
                            <div className="p-3 text-center">
                                <h3 className="h-6 bg-gray-200 rounded mb-2"></h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        return (
            <section className="bg-white py-12 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#101B35] text-center mb-6">
                    Categorias
                </h2>
                <div className="text-center py-10">
                    <p className="text-gray-500">Nenhuma categoria disponível no momento.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#101B35] text-center mb-6">
                Categorias
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        name={category.name}
                        image={category.image || '/images/professional-services.jpg'}
                    />
                ))}
            </div>
        </section>
    );
};

export default CategoriesSection;
