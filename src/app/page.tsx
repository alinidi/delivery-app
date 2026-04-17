'use client';

import { useEffect, useState, useRef } from 'react';
import OrderForm from './components/forms/OrderForm';
import { OrderProvider } from './context/OrderContext';

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pwaInstallRef = useRef<any>(null);

    useEffect(() => {
        import('@khmyznikov/pwa-install').then(() => {
            setMounted(true);
        });

        // Определяем iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(ios);
    }, []);

    // Вызов PWA диалога (для Android и инструкции для iOS)
    const handleShowDialog = () => {
        if (pwaInstallRef.current) {
            pwaInstallRef.current.showDialog(true);
        }
    };

    // Вызов нативного Share (для iOS - буквальное выполнение пункта 5)
    const handleNativeShare = async () => {
        // Проверяем, поддерживается ли Web Share API
        if (navigator.share && navigator.canShare()) {
            try {
                await navigator.share({
                    title: 'NPVPN',
                    text: 'Оформление заявок на доставку',
                    url: window.location.href,
                });
                console.log('Share открыт');
            } catch (err) {
                // Пользователь закрыл окно или ошибка
                console.log('Share отменён:', err);
            }
        } else {
            // Если браузер не поддерживает Share (например, десктопный Chrome)
            // показываем стандартный диалог установки
            handleShowDialog();
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

                {/* ДВЕ кнопки для наглядности */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    {/* Кнопка 1: Нативный Share (для iOS - буквальный Share) */}
                    <button
                        onClick={handleNativeShare}
                        className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Поделиться (Share)
                    </button>

                    {/* Кнопка 2: Установка PWA (реально добавляет на экран) */}
                    <button
                        onClick={handleShowDialog}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Сохранить на рабочий стол
                    </button>
                </div>

                {/* Web Component */}
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
