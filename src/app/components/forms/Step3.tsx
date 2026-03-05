'use client';

import { useState } from 'react';
import { OrderFormData } from '@/app/types';
import { CARGO_TYPES } from '@/app/constants';

interface Step3Props {
    data: OrderFormData;
    onUpdate: (agreed: boolean) => void;
    onPrev: () => void;
    onSubmit: () => void;
}

export default function Step3({
    data,
    onUpdate,
    onPrev,
    onSubmit,
}: Step3Props) {
    const [error, setError] = useState('');

    const handleAgreedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        onUpdate(newValue);
        setError('');
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!data.agreedToTerms) {
            setError('Необходимо согласиться с условиями');
            return;
        }

        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div>
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                        Данные отправителя
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Имя:</p>
                            <p className="font-medium">
                                {data.sender.name || '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Телефон:</p>
                            <p className="font-medium">
                                {data.sender.phone || '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Город отправления:
                            </p>
                            <p className="font-medium">
                                {data.sender.city || '—'}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                        Данные получателя и посылки
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">
                                Имя получателя:
                            </p>
                            <p className="font-medium">
                                {data.recipient.name || '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Город назначения:
                            </p>
                            <p className="font-medium">
                                {data.recipient.city || '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Тип груза:</p>
                            <p className="font-medium">
                                {data.cargo.type
                                    ? CARGO_TYPES[data.cargo.type]
                                    : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Вес:</p>
                            <p className="font-medium">
                                {data.cargo.weight
                                    ? `${data.cargo.weight} кг`
                                    : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={data.agreedToTerms}
                        onChange={handleAgreedChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                        Я согласен с условиями обработки данных{' '}
                        <span className="text-red-500">*</span>
                    </span>
                </label>
                {error && <p className="error-text">{error}</p>}
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={onPrev}
                    className="btn-secondary"
                >
                    Назад
                </button>
                <button type="submit" className="btn-primary">
                    Отправить заявку
                </button>
            </div>
        </form>
    );
}
