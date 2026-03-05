export type CargoType = 'documents' | 'fragile' | 'regular';

export type OrderStatus = 'pending' | 'delivered' | 'cancelled';

export interface Sender {
  name: string;
  phone: string;
  city: string;
}

export interface Recipient {
  name: string;
  city: string;
}

export interface Cargo {
  type: CargoType;
  weight: number;
}

export interface Order {
  id: string;
  sender: Sender;
  recipient: Recipient;
  cargo: Cargo;
  createdAt: string;
  status: OrderStatus;
  agreedToTerms: boolean;
}

export type OrderFormData = Omit<Order, 'id' | 'createdAt' | 'status'>;

export interface ValidationErrors {
  [key: string]: string;
}