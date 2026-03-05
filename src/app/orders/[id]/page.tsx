'use client';

import { useParams, useRouter } from 'next/navigation';
import { OrderProvider, useOrders } from '../../context/OrderContext';
import Link from 'next/link';
import { CARGO_TYPES } from '../../constants';
import { Order } from '../../types';
import { useState } from 'react';
import Dialog from '../../components/ui/Dialog';

function OrderDetailsContent() {
    const params = useParams();
    const router = useRouter();
    const { getOrder, deleteOrder } = useOrders();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const id = params.id as string;
    const order = getOrder(id);

    if (!order) {
        return (
            <div className="bg-white p-8 text-center rounded-lg shadow-sm">
                <p className="text-gray-500 mb-4">Заявка не найдена</p>
                <Link href="/orders" className="btn-primary">
                    Вернуться к списку
                </Link>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
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
                return 'bg-yellow-100 text-yellow-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDelete = () => {
        deleteOrder(order.id);
        router.push('/orders');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Детали заявки</h1>
                <div className="flex gap-3">
                    <Link href="/orders" className="btn-secondary">
                        Назад к списку
                    </Link>
                    <button
                        onClick={() => setShowDeleteDialog(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Удалить
                    </button>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                    {getStatusText(order.status)}
                </span>
                <span className="text-gray-500">
                    Создана: {formatDate(order.createdAt)}
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                        Отправитель
                    </h2>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-sm text-gray-600">Имя</dt>
                            <dd className="font-medium">{order.sender.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-600">Телефон</dt>
                            <dd className="font-medium">
                                {order.sender.phone}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-600">
                                Город отправления
                            </dt>
                            <dd className="font-medium">{order.sender.city}</dd>
                        </div>
                    </dl>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                        Получатель
                    </h2>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-sm text-gray-600">Имя</dt>
                            <dd className="font-medium">
                                {order.recipient.name}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-600">
                                Город назначения
                            </dt>
                            <dd className="font-medium">
                                {order.recipient.city}
                            </dd>
                        </div>
                    </dl>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                        Информация о грузе
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <dt className="text-sm text-gray-600">Тип груза</dt>
                            <dd className="font-medium">
                                {CARGO_TYPES[order.cargo.type]}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-600">Вес</dt>
                            <dd className="font-medium">
                                {order.cargo.weight} кг
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-600">
                                Согласие с условиями
                            </dt>
                            <dd className="font-medium">
                                {order.agreedToTerms ? 'Да' : 'Нет'}
                            </dd>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                        Дополнительная информация
                    </h2>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm text-gray-600">ID заявки</dt>
                            <dd className="font-mono text-sm">{order.id}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-600">
                                Последнее обновление
                            </dt>
                            <dd className="font-medium">
                                {formatDate(order.createdAt)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
            <Dialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                title="Подтверждение удаления"
            >
                <div className="space-y-6">
                    <p className="text-gray-700">
                        Вы уверены, что хотите удалить эту заявку?
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowDeleteDialog(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default function OrderDetailsPage() {
    return (
        <OrderProvider>
            <div className="container-custom py-8">
                <OrderDetailsContent />
            </div>
        </OrderProvider>
    );
}
