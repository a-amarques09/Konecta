import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

const FONTS_HREF =
    'https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

export default function Document() {
    return (
        <Html lang="pt" data-theme="consultant">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="stylesheet" href={FONTS_HREF} />
                <meta
                    name="description"
                    content="KONECTA — o mercado onde produtos, serviços e empresas em Angola se encontram. Publica, compra e cresce num só lugar."
                />
                <meta name="theme-color" content="#ffffff" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
