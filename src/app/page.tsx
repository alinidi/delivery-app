'use client';

import { useEffect, useState, useRef } from 'react';
import OrderForm from './components/forms/OrderForm';
import { OrderProvider } from './context/OrderContext';

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTelegram, setIsTelegram] = useState(false);
    const [showTelegramGuide, setShowTelegramGuide] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pwaInstallRef = useRef<any>(null);

    useEffect(() => {
        import('@khmyznikov/pwa-install').then(() => {
            setMounted(true);
        });

        // Определяем мобильное устройство
        const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        setIsMobile(mobile);

        // Определяем Telegram (Desktop или Mobile)
        const isTelegramApp = /Telegram/i.test(navigator.userAgent);
        setIsTelegram(isTelegramApp);
    }, []);

    // Вызов PWA диалога (работает в обычных браузерах)
    const handleShowDialog = () => {
        if (pwaInstallRef.current) {
            pwaInstallRef.current.showDialog(true);
        }
    };

    // Для Telegram - показываем инструкцию
    const handleTelegramInstall = () => {
        setShowTelegramGuide(true);
    };

    // Нативный Share (только для мобильных устройств)
    const handleNativeShare = async () => {
        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({ url: window.location.href })
        ) {
            try {
                await navigator.share({
                    title: 'NPVPN',
                    text: 'Оформление заявок на доставку',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share отменён:', err);
            }
        } else {
            // Fallback: если Share не работает, показываем PWA диалог
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

                {/* Кнопки - разные для разных окружений */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    {isTelegram ? (
                        // Telegram: показываем кнопку с инструкцией
                        <button
                            onClick={handleTelegramInstall}
                            className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Как сохранить сайт (Telegram)
                        </button>
                    ) : (
                        // Обычные браузеры
                        <>
                            {/* Кнопка Share показывается ТОЛЬКО на мобильных устройствах */}
                            {isMobile && (
                                <button
                                    onClick={handleNativeShare}
                                    className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Поделиться (Share)
                                </button>
                            )}
                            <button
                                onClick={handleShowDialog}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Сохранить на рабочий стол
                            </button>
                        </>
                    )}
                </div>

                {/* Модальное окно с инструкцией для Telegram */}
                {showTelegramGuide && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                            <h3 className="text-xl font-bold mb-4">
                                Как сохранить сайт
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="font-bold text-blue-600">
                                        1.
                                    </span>
                                    <span>
                                        Нажмите на три точки <strong>⋮</strong>{' '}
                                        в правом верхнем углу Telegram
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-blue-600">
                                        2.
                                    </span>
                                    <span>
                                        Выберите{' '}
                                        <strong>«Открыть в браузере»</strong>
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-blue-600">
                                        3.
                                    </span>
                                    <span>
                                        В открывшемся браузере нажмите{' '}
                                        <strong>
                                            «Сохранить на рабочий стол»
                                        </strong>
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowTelegramGuide(false)}
                                className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Понятно
                            </button>
                        </div>
                    </div>
                )}

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
