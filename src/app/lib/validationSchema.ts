import { z } from 'zod';
import { MIN_NAME_LENGTH, MIN_WEIGHT, MAX_WEIGHT } from '../constants';

export const senderSchema = z.object({
  name: z.string()
    .min(MIN_NAME_LENGTH, `Имя должно содержать минимум ${MIN_NAME_LENGTH} символа`),
  phone: z.string()
    .regex(/^\+?[0-9]{10,15}$/, 'Введите корректный номер телефона'),
  city: z.string()
    .min(1, 'Город обязателен для заполнения'),
});

export const recipientCargoSchema = z.object({
  recipientName: z.string()
    .min(1, 'Имя получателя обязательно'),
  recipientCity: z.string()
    .min(1, 'Город назначения обязателен'),
  cargoType: z.enum(['documents', 'fragile', 'regular']),
  weight: z.number()
    .min(MIN_WEIGHT, `Вес должен быть не менее ${MIN_WEIGHT} кг`)
    .max(MAX_WEIGHT, `Вес должен быть не более ${MAX_WEIGHT} кг`),
}).refine(
  (data) => data.recipientCity !== '',
  {
    message: 'Город назначения не может совпадать с городом отправления',
    path: ['recipientCity'],
  }
);

export const confirmationSchema = z.object({
  agreedToTerms: z.boolean()
    .refine(val => val === true, 'Необходимо согласиться с условиями'),
});

export const orderFormSchema = z.object({
  senderName: z.string(),
  senderPhone: z.string(),
  senderCity: z.string(),
  recipientName: z.string(),
  recipientCity: z.string(),
  cargoType: z.enum(['documents', 'fragile', 'regular']),
  weight: z.number(),
  agreedToTerms: z.boolean(),
});

export type SenderFormData = z.infer<typeof senderSchema>;
export type RecipientCargoFormData = z.infer<typeof recipientCargoSchema>;
export type ConfirmationFormData = z.infer<typeof confirmationSchema>;
export type OrderFormData = z.infer<typeof orderFormSchema>;