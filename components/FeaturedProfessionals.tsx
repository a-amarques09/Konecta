'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProfessionalData {
    id: string;
    name: string | null;
    title: string | null;
    location: string | null;
    image: string | null;
}

const FeaturedProfessionals: React.FC = () => {
    const [professionals, setProfessionals] = useState<ProfessionalData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadProfessionals();
    }, []);

    const loadProfessionals = async () => {
        try {
            const res = await fetch('/api/seller');
            if (!res.ok) throw new Error('Failed to load professionals');
            const data = await res.json();
            setProfessionals(data.map((p: any) => ({
                id: p.id,
                name: p.name || 'Profissional',
                title: p.businessType || 'Profissional',
                location: p.city || '',
                image: p.image || '/images/professional-services.jpg',
            })));
        } catch (err) {
            console.error('Error loading professionals:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="bg-[#F5F7FA] py-12 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#101B35] text-center mb-6">
                    Profissionais em Destaque
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-t-lg"></div>
                            <div className="p-3 text-center">
                                <h3 className="h-6 bg-gray-200 rounded mb-2"></h3>
                                <p className="h-4 bg-gray-200 rounded mb-2 w-3/4"></p>
                                <p className="h-4 bg-gray-200 rounded w-1/2"></p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (professionals.length === 0) {
        return (
            <section className="bg-[#F5F7FA] py-12 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#101B35] text-center mb-6">
                    Profissionais em Destaque
                </h2>
                <div className="text-center py-10">
                    <p className="text-gray-500">Nenhum profissional disponível no momento.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#F5F7FA] py-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#101B35] text-center mb-6">
                Profissionais em Destaque
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {professionals.map((professional) => (
                    <div
                        key={professional.id}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                    >
                        <div className="relative h-32 sm:h-40 overflow-hidden rounded-t-lg bg-gray-200">
                            <Image
                                src={professional.image || '/images/professional-services.jpg'}
                                alt={professional.name || 'Profissional'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 48vw, (max-width: 1024px) 24vw, 12vw"
                                priority={false}
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AD//2Q=="
                            />
                        </div>
                        <div className="p-3 sm:p-4 text-center">
                            <h3 className="text-base sm:text-lg font-semibold text-[#101B35] mb-1">
                                {professional.name}
                            </h3>
                            <p className="text-[#2563EB] font-medium text-sm mb-2">
                                {professional.title}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {professional.location}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedProfessionals;
