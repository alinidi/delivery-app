'use client';

import { useForm } from '@/app/hooks/useForm';
import { useFormStorage } from '../../hooks/useFormStorage';
import { useOrders } from '../../context/OrderContext';
import { useRouter } from 'next/navigation';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import StepProgress from './StepProgress';
import { CargoType, OrderFormData } from '@/app/types';

const STEPS = ['Отправитель', 'Получатель и посылка', 'Подтверждение'];

export default function OrderForm() {
    const { currentStep, nextStep, prevStep } = useForm(3);
    const { formData, updateFormData, resetForm } = useFormStorage();
    const { addOrder } = useOrders();
    const router = useRouter();

    const handleStep1Update = (data: {
        sender: Partial<{ name: string; phone: string; city: string }>;
    }) => {
        const updateData: Partial<OrderFormData> = {
            sender: {
                name: data.sender.name ?? formData.sender.name,
                phone: data.sender.phone ?? formData.sender.phone,
                city: data.sender.city ?? formData.sender.city,
            },
        };
        updateFormData(updateData);
    };

    const handleStep2Update = (data: {
        recipient?: Partial<{ name: string; city: string }>;
        cargo?: Partial<{ type: CargoType; weight: number }>;
    }) => {
        const updateData: Partial<OrderFormData> = {};

        if (data.recipient) {
            updateData.recipient = {
                name: data.recipient.name ?? formData.recipient.name,
                city: data.recipient.city ?? formData.recipient.city,
            };
        }

        if (data.cargo) {
            updateData.cargo = {
                type: data.cargo.type ?? formData.cargo.type,
                weight: data.cargo.weight ?? formData.cargo.weight,
            };
        }

        updateFormData(updateData);
    };

    const handleStep3Update = (agreed: boolean) => {
        updateFormData({ agreedToTerms: agreed });
    };

    const handleSubmit = () => {
        addOrder(formData);
        resetForm();
        router.push('/orders');
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Step1
                        data={formData}
                        onUpdate={handleStep1Update}
                        onNext={nextStep}
                    />
                );
            case 1:
                return (
                    <Step2
                        data={formData}
                        onUpdate={handleStep2Update}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 2:
                return (
                    <Step3
                        data={formData}
                        onUpdate={handleStep3Update}
                        onPrev={prevStep}
                        onSubmit={handleSubmit}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <StepProgress
                currentStep={currentStep}
                totalSteps={3}
                stepNames={STEPS}
            />
            {renderStep()}
        </div>
    );
}
