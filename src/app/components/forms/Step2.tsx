'use client';

import { useState, useMemo } from 'react';
import { createRecipientCargoSchema } from '@/app/lib/validationSchema';
import { CARGO_TYPES_ARRAY, MIN_WEIGHT, MAX_WEIGHT } from '@/app/constants';
import { CargoType } from '@/app/types';

interface Step2Props {
    data: {
        recipient: {
            name: string;
            city: string;
        };
        cargo: {
            type: CargoType;
            weight: number;
        };
        sender: {
            city: string;
        };
    };
    onUpdate: (data: {
        recipient?: Partial<{ name: string; city: string }>;
        cargo?: Partial<{ type: CargoType; weight: number }>;
    }) => void;
    onNext: () => void;
    onPrev: () => void;
}

interface Errors {
    recipientName?: string;
    recipientCity?: string;
    cargoType?: string;
    weight?: string;
}

export default function Step2({ data, onUpdate, onNext, onPrev }: Step2Props) {
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const recipientCargoSchema = useMemo(
        () => createRecipientCargoSchema(data.sender.city),
        [data.sender.city]
    );

    const validateAll = (): boolean => {
        const result = recipientCargoSchema.safeParse({
            recipientName: data.recipient.name,
            recipientCity: data.recipient.city,
            cargoType: data.cargo.type,
            weight: data.cargo.weight,
        });

        if (!result.success) {
            const newErrors: Errors = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof Errors;
                newErrors[field] = err.message;
            });
            setErrors(newErrors);
            return false;
        }

        return true;
    };

    const validateField = (
        field: string,
        value: string | number | CargoType
    ) => {
        const result = recipientCargoSchema.safeParse({
            recipientName:
                field === 'recipientName' ? value : data.recipient.name,
            recipientCity:
                field === 'recipientCity' ? value : data.recipient.city,
            cargoType: field === 'cargoType' ? value : data.cargo.type,
            weight: field === 'weight' ? Number(value) : data.cargo.weight,
        });

        if (!result.success) {
            const fieldError = result.error.issues.find(
                (err) => err.path[0] === field
            );
            return fieldError?.message;
        }
        return undefined;
    };

    const handleRecipientChange = (field: 'name' | 'city', value: string) => {
        onUpdate({
            recipient: { [field]: value },
        });

        const error = validateField(
            field === 'name' ? 'recipientName' : 'recipientCity',
            value
        );
        setErrors((prev) => ({
            ...prev,
            [field === 'name' ? 'recipientName' : 'recipientCity']: error,
        }));
    };

    const handleCargoChange = (
        field: 'type' | 'weight',
        value: string | number | CargoType
    ) => {
        onUpdate({
            cargo: { [field]: value },
        });

        const error = validateField(
            field === 'type' ? 'cargoType' : 'weight',
            value
        );
        setErrors((prev) => ({
            ...prev,
            [field === 'type' ? 'cargoType' : 'weight']: error,
        }));
    };

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setTouched({
            recipientName: true,
            recipientCity: true,
            cargoType: true,
            weight: true,
        });

        if (validateAll()) {
            onNext();
        }
    };

    const isFieldInvalid = (field: string) => {
        return touched[field] && errors[field as keyof Errors];
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="recipientName" className="form-label">
                    Имя получателя <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="recipientName"
                    value={data.recipient.name}
                    onChange={(e) =>
                        handleRecipientChange('name', e.target.value)
                    }
                    onBlur={() => handleBlur('recipientName')}
                    className={`input-field ${isFieldInvalid('recipientName') ? 'border-red-500' : ''}`}
                    placeholder="Введите имя получателя"
                />
                {isFieldInvalid('recipientName') && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.recipientName}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="recipientCity" className="form-label">
                    Город назначения <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="recipientCity"
                    value={data.recipient.city}
                    onChange={(e) =>
                        handleRecipientChange('city', e.target.value)
                    }
                    onBlur={() => handleBlur('recipientCity')}
                    className={`input-field ${isFieldInvalid('recipientCity') ? 'border-red-500' : ''}`}
                    placeholder="Введите город назначения"
                />
                {isFieldInvalid('recipientCity') && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.recipientCity}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="cargoType" className="form-label">
                    Тип груза <span className="text-red-500">*</span>
                </label>
                <select
                    id="cargoType"
                    value={data.cargo.type}
                    onChange={(e) =>
                        handleCargoChange('type', e.target.value as CargoType)
                    }
                    onBlur={() => handleBlur('cargoType')}
                    className={`input-field ${isFieldInvalid('cargoType') ? 'border-red-500' : ''}`}
                >
                    {CARGO_TYPES_ARRAY.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
                {isFieldInvalid('cargoType') && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.cargoType}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="weight" className="form-label">
                    Вес, кг ({MIN_WEIGHT}–{MAX_WEIGHT}){' '}
                    <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    id="weight"
                    value={data.cargo.weight}
                    onChange={(e) =>
                        handleCargoChange(
                            'weight',
                            parseFloat(e.target.value) || 0
                        )
                    }
                    onBlur={() => handleBlur('weight')}
                    step="0.1"
                    min={MIN_WEIGHT}
                    max={MAX_WEIGHT}
                    className={`input-field ${isFieldInvalid('weight') ? 'border-red-500' : ''}`}
                />
                {isFieldInvalid('weight') && (
                    <p className="text-sm text-red-600 mt-1">{errors.weight}</p>
                )}
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={onPrev}
                    className="btn-secondary cursor-pointer"
                >
                    Назад
                </button>
                <button type="submit" className="btn-primary cursor-pointer">
                    Далее
                </button>
            </div>
        </form>
    );
}
