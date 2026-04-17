'use client';

import { useEffect, useState, useRef } from 'react';
import OrderForm from './components/forms/OrderForm';
import { OrderProvider } from './context/OrderContext';

export default function Home() {
    const [mounted, setMounted] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pwaInstallRef = useRef<any>(null);

    useEffect(() => {
        import('@khmyznikov/pwa-install').then(() => {
            setMounted(true);
        });
    }, []);

    const handleShowDialog = () => {
        if (pwaInstallRef.current) {
            pwaInstallRef.current.showDialog(true);
        }
    };

    if (!mounted) return null;

    return (
        <OrderProvider>
            <div className="container-custom py-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Оформление заявки на доставку
                </h1>

                <OrderForm />

                {/* Кнопка, которая вызывает диалог установки */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleShowDialog}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Сохранить на homescreen
                    </button>
                </div>

                {/* Web Component (скрытый, вызывается программно) */}
                <pwa-install
                    ref={pwaInstallRef}
                    install-description="Сохраните сайт на рабочий стол"
                    manifest-url="/manifest.json"
                    name="NPVPN"
                    description="Установите npvpn на рабочий стол"
                />
            </div>
        </OrderProvider>
    );
}
