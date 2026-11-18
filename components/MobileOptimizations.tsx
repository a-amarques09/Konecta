'use client';

import { useEffect, useState } from 'react';

interface MobileOptimizationsProps {
    children: React.ReactNode;
}

const MobileOptimizations: React.FC<MobileOptimizationsProps> = ({ children }) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Prevent double-tap zoom on mobile
    useEffect(() => {
        let lastTouchEnd = 0;

        const handleTouchEnd = (e: TouchEvent) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        };

        if (isTouchDevice) {
            document.addEventListener('touchend', handleTouchEnd, { passive: false });
        }

        return () => {
            if (isTouchDevice) {
                document.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [isTouchDevice]);

    // Add viewport meta tag for mobile
    useEffect(() => {
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            metaViewport.setAttribute(
                'content',
                'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
            );
        }
    }, []);

    return (
        <div className={`min-h-screen ${isMobile ? 'touch-manipulation' : ''}`}>
            {children}
        </div>
    );
};

export default MobileOptimizations;