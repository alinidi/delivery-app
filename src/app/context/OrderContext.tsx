'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Order, OrderFormData, OrderStatus } from '../types';
import { STORAGE_KEYS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface OrderContextType {
    orders: Order[];
    addOrder: (orderData: OrderFormData) => void;
    deleteOrder: (id: string) => void;
    getOrder: (id: string) => Order | undefined;
    updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const [orders, setOrders] = useState<Order[]>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    console.error('Failed to parse stored orders', e);
                }
            }
        }
        return [];
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        }
    }, [orders]);

    const addOrder = (orderData: OrderFormData) => {
        const newOrder: Order = {
            ...orderData,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            status: 'pending',
        };
        setOrders((prev) => [...prev, newOrder]);
    };

    const deleteOrder = (id: string) => {
        setOrders((prev) => prev.filter((order) => order.id !== id));
    };

    const getOrder = (id: string) => {
        return orders.find((order) => order.id === id);
    };

    const updateOrderStatus = (id: string, status: OrderStatus) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === id ? { ...order, status } : order
            )
        );
    };

    return (
        <OrderContext.Provider
            value={{
                orders,
                addOrder,
                deleteOrder,
                getOrder,
                updateOrderStatus,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
}
