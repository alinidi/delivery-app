import { z } from 'zod';
import { MIN_NAME_LENGTH, MIN_WEIGHT, MAX_WEIGHT } from '../constants';

const nameRegex = /^[A-Za-zА-Яа-яЁё]+$/;
const cityRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;
const phoneRegex = /^\+7[0-9]{10}$/;

export const senderSchema = z.object({
    name: z
        .string()
        .min(
            MIN_NAME_LENGTH,
            `Имя должно содержать минимум ${MIN_NAME_LENGTH} символа`
        )
        .regex(nameRegex, 'Имя может содержать только буквы'),
    phone: z
        .string()
        .regex(
            phoneRegex,
            'Введите корректный номер телефона в формате +7XXXXXXXXXX'
        ),
    city: z
        .string()
        .min(1, 'Город обязателен для заполнения')
        .regex(
            cityRegex,
            'Город может содержать только буквы, пробелы и дефисы'
        ),
});

export const createRecipientCargoSchema = (senderCity: string) => {
    return z
        .object({
            recipientName: z
                .string()
                .min(1, 'Имя получателя обязательно')
                .regex(nameRegex, 'Имя может содержать только буквы'),
            recipientCity: z
                .string()
                .min(1, 'Город назначения обязателен')
                .regex(
                    cityRegex,
                    'Город может содержать только буквы, пробелы и дефисы'
                ),
            cargoType: z.enum(['documents', 'fragile', 'regular']),
            weight: z
                .number()
                .min(MIN_WEIGHT, `Вес должен быть не менее ${MIN_WEIGHT} кг`)
                .max(MAX_WEIGHT, `Вес должен быть не более ${MAX_WEIGHT} кг`),
        })
        .refine((data) => data.recipientCity !== senderCity, {
            message:
                'Город назначения не может совпадать с городом отправления',
            path: ['recipientCity'],
        });
};

export const confirmationSchema = z.object({
    agreedToTerms: z
        .boolean()
        .refine((val) => val === true, 'Необходимо согласиться с условиями'),
});

export const orderFormSchema = z.object({
    sender: z.object({
        name: z.string(),
        phone: z.string(),
        city: z.string(),
    }),
    recipient: z.object({
        name: z.string(),
        city: z.string(),
    }),
    cargo: z.object({
        type: z.enum(['documents', 'fragile', 'regular']),
        weight: z.number(),
    }),
    agreedToTerms: z.boolean(),
});

export type SenderFormData = z.infer<typeof senderSchema>;
export type RecipientCargoFormData = z.infer<
    ReturnType<typeof createRecipientCargoSchema>
>;
export type ConfirmationFormData = z.infer<typeof confirmationSchema>;
export type OrderFormData = z.infer<typeof orderFormSchema>;
