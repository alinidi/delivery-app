'use client';

import { useState } from 'react';
import { OrderProvider, useOrders } from '../context/OrderContext';
import Link from 'next/link';
import { CARGO_TYPES } from '../constants';
import { Order, CargoType } from '../types';
import Dialog from '../components/ui/Dialog';

function OrdersList() {
    const { orders, deleteOrder } = useOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<CargoType | 'all'>('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.recipient.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            order.recipient.city
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesType =
            filterType === 'all' || order.cargo.type === filterType;

        return matchesSearch && matchesType;
    });

    const sortedOrders = [...filteredOrders].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const handleDelete = (id: string) => {
        deleteOrder(id);
        setDeleteId(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusText = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return 'В обработке';
            case 'delivered':
                return 'Доставлено';
            case 'cancelled':
                return 'Отменено';
            default:
                return status;
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'delivered':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="search"
                            className="block text-sm font-medium text-gray-600 mb-2"
                        >
                            Поиск
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
                                placeholder="Имя получателя или город..."
                            />
                            <svg
                                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="filter"
                            className="block text-sm font-medium text-gray-600 mb-2"
                        >
                            Тип груза
                        </label>
                        <select
                            id="filter"
                            value={filterType}
                            onChange={(e) =>
                                setFilterType(
                                    e.target.value as CargoType | 'all'
                                )
                            }
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        >
                            <option value="all">Все типы</option>
                            {Object.entries(CARGO_TYPES).map(
                                ([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                {sortedOrders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-500 mb-4">Заявок пока нет</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Создать заявку
                        </Link>
                    </div>
                ) : (
                    sortedOrders.map((order) => (
                        <div
                            key={order.id}
                            className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                                        >
                                            {getStatusText(order.status)}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {formatDate(order.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                                            Маршрут
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {order.sender.city} →{' '}
                                            {order.recipient.city}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                                            Отправитель
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {order.sender.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {order.sender.phone}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                                            Груз
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {CARGO_TYPES[order.cargo.type]},{' '}
                                            {order.cargo.weight} кг
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        Детали
                                    </Link>
                                    <button
                                        onClick={() => setDeleteId(order.id)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-rose-600 bg-rose-50 rounded-md hover:bg-rose-100 transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Dialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Подтверждение удаления"
            >
                <div className="p-4">
                    <p className="text-gray-600 mb-6">
                        Вы уверены, что хотите удалить эту заявку? Это действие
                        нельзя отменить.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setDeleteId(null)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={() => deleteId && handleDelete(deleteId)}
                            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <OrderProvider>
            <div className="container-custom p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        История заявок
                    </h1>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center p-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Новая заявка
                    </Link>
                </div>
                <OrdersList />
            </div>
        </OrderProvider>
    );
}
