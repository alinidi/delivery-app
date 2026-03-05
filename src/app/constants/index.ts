import { CargoType } from '../types';

export const STORAGE_KEYS = {
  ORDERS: 'delivery-orders',
  FORM_DATA: 'delivery-form-data'
} as const;

export const CARGO_TYPES: Record<CargoType, string> = {
  documents: 'Документы',
  fragile: 'Хрупкое',
  regular: 'Обычное'
};

export const CARGO_TYPES_ARRAY = Object.entries(CARGO_TYPES).map(([value, label]) => ({
  value: value as CargoType,
  label
}));

export const MIN_WEIGHT = 0.1;
export const MAX_WEIGHT = 30;
export const MIN_NAME_LENGTH = 2;