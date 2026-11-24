'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface BusinessData {
    id: string;
    businessName: string;
    description: string | null;
    city: string | null;
    image: string | null;
}

const BusinessSection: React.FC = () => {
    const [businesses, setBusinesses] = useState<BusinessData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadBusinesses();
    }, []);

    const loadBusinesses = async () => {
        try {
            const res = await fetch('/api/seller');
            if (!res.ok) throw new Error('Failed to load businesses');
            const data = await res.json();
            setBusinesses(data.map((b: any) => ({
                id: b.id,
                businessName: b.businessName || 'Empresa',
                description: b.description || '',
                city: b.city || '',
                image: b.image || '/images/business1.jpg',
            })));
        } catch (err) {
            console.error('Error loading businesses:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="bg-white py-12 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#101B35] text-center mb-6">
                    Descubra Empresas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-[#F5F7FA] rounded-lg animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-t-lg"></div>
                            <div className="p-3">
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

    if (businesses.length === 0) {
        return (
            <section className="bg-white py-12 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#101B35] text-center mb-6">
                    Descubra Empresas
                </h2>
                <div className="text-center py-10">
                    <p className="text-gray-500">Nenhuma empresa disponível no momento.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#101B35] text-center mb-6">
                Descubra Empresas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {businesses.map((business) => (
                    <div
                        key={business.id}
                        className="bg-[#F5F7FA] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                    >
                        <div className="relative h-32 sm:h-40 overflow-hidden rounded-t-lg bg-gray-200">
                            <Image
                                src={business.image || '/images/business1.jpg'}
                                alt={business.businessName}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 48vw, (max-width: 1024px) 24vw, 12vw"
                                priority={false}
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AD//2Q=="
                            />
                        </div>
                        <div className="p-3 sm:p-4">
                            <h3 className="text-base sm:text-lg font-semibold text-[#101B35]">
                                {business.businessName}
                            </h3>
                            <p className="text-gray-500 mb-2">{business.description}</p>
                            <p className="text-gray-500">Localização: {business.city}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BusinessSection;
