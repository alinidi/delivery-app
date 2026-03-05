'use client';

import OrderForm from './components/forms/OrderForm';
import { OrderProvider } from './context/OrderContext';

export default function Home() {
    return (
        <OrderProvider>
            <div className="container-custom py-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Оформление заявки на доставку
                </h1>
                <OrderForm />
            </div>
        </OrderProvider>
    );
}
