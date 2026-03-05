'use client';

import { senderSchema } from '@/app/lib/validationSchema';
import { useState } from 'react';

interface Step1Props {
    data: {
        sender: {
            name: string;
            phone: string;
            city: string;
        };
    };
    onUpdate: (data: {
        sender: Partial<{ name: string; phone: string; city: string }>;
    }) => void;
    onNext: () => void;
}

interface Errors {
    name?: string;
    phone?: string;
    city?: string;
}

export default function Step1({ data, onUpdate, onNext }: Step1Props) {
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const formatPhone = (value: string): string => {
        const digits = value.replace(/\D/g, '');

        if (digits.length > 0) {
            let result = '+7';

            if (digits.length > 1) {
                const startIndex =
                    digits[0] === '7' || digits[0] === '8' ? 1 : 0;
                const remainingDigits = digits.slice(startIndex).slice(0, 10);
                result += remainingDigits;
            }

            return result;
        }

        return '';
    };

    const validateField = (field: string, value: string) => {
        const result = senderSchema.safeParse({
            name: field === 'name' ? value : data.sender.name,
            phone: field === 'phone' ? value : data.sender.phone,
            city: field === 'city' ? value : data.sender.city,
        });

        if (!result.success) {
            const fieldError = result.error.issues.find(
                (err) => err.path[0] === field
            );
            return fieldError?.message;
        }
        return undefined;
    };

    const handleChange = (field: 'name' | 'phone' | 'city', value: string) => {
        const processedValue = field === 'phone' ? formatPhone(value) : value;

        onUpdate({
            sender: { [field]: processedValue },
        });

        const error = validateField(field, processedValue);
        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        const value = data.sender[field as keyof typeof data.sender];
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setTouched({
            name: true,
            phone: true,
            city: true,
        });

        const result = senderSchema.safeParse({
            name: data.sender.name,
            phone: data.sender.phone,
            city: data.sender.city,
        });

        if (result.success) {
            onNext();
        } else {
            const newErrors: Errors = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof Errors;
                newErrors[field] = err.message;
            });
            setErrors(newErrors);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="senderName" className="form-label">
                    Имя отправителя <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="senderName"
                    value={data.sender.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`input-field ${touched.name && errors.name ? 'border-red-500' : ''}`}
                    placeholder="Введите имя"
                />
                {touched.name && errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
            </div>

            <div>
                <label htmlFor="senderPhone" className="form-label">
                    Телефон <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    id="senderPhone"
                    value={data.sender.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+7XXXXXXXXXX"
                />
                {touched.phone && errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    Формат: +7 и 10 цифр (например, +79261234567)
                </p>
            </div>

            <div>
                <label htmlFor="senderCity" className="form-label">
                    Город отправления <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="senderCity"
                    value={data.sender.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    className={`input-field ${touched.city && errors.city ? 'border-red-500' : ''}`}
                    placeholder="Введите город"
                />
                {touched.city && errors.city && (
                    <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                )}
            </div>

            <div className="flex justify-end">
                <button type="submit" className="btn-primary cursor-pointer">
                    Далее
                </button>
            </div>
        </form>
    );
}
