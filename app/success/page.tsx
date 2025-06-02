"use client";

import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
};

type Order = {
    id: string;
    amount_total: number;
    currency: string;
    items: OrderItem[];
    customer_email?: string;
};

export default function SuccessPage() {
    const { clearCart } = useCartStore();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    useEffect(() => {
        if (!sessionId) return;
        setLoading(true);
        fetch(`/api/checkout/session?session_id=${sessionId}`)
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setOrder(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch order:", err);
                setOrder(null);
                setLoading(false);
            });
    }, [sessionId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 animate-fade-in">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full flex flex-col items-center text-center">
                <div className="flex justify-center mb-6">
                    <svg
                        className="w-16 h-16 text-green-500 animate-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-2 text-green-700">
                    Payment Successful!
                </h1>
                <p className="mb-4 text-gray-600">
                    Thank you for your purchase. Your order is being processed.
                </p>
                {loading ? (
                    <div className="my-8 text-gray-500 animate-pulse">
                        Loading your order...
                    </div>
                ) : order ? (
                    <div className="flex flex-col items-center my-6 w-full">
                        <div className="mb-2">
                            <span className="font-semibold">Order ID:</span>{" "}
                            {order.id}
                        </div>
                        {order.customer_email && (
                            <div className="mb-2">
                                <span className="font-semibold">Email:</span>{" "}
                                {order.customer_email}
                            </div>
                        )}
                        <div className="mb-4">
                            <span className="font-semibold">Total:</span>{" "}
                            {(order.amount_total / 100).toLocaleString(
                                undefined,
                                {
                                    style: "currency",
                                    currency: order.currency,
                                }
                            )}
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <span className="font-semibold">Items:</span>
                            <ul className="divide-y divide-gray-200 mt-2 flex flex-col items-center w-auto">
                                {order.items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="py-2 flex items-center justify-center"
                                    >
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-10 h-10 object-cover rounded mr-3"
                                            />
                                        )}
                                        <span className="mx-2 text-center min-w-[100px]">
                                            {item.name}
                                        </span>
                                        <span className="mx-2 text-gray-500">
                                            x{item.quantity}
                                        </span>
                                        <span>
                                            {(item.price / 100).toLocaleString(
                                                undefined,
                                                {
                                                    style: "currency",
                                                    currency: order.currency,
                                                }
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="my-8 text-red-500">Order not found.</div>
                )}
                <Link
                    href="/products"
                    className="transition-transform duration-150 active:scale-90 hover:scale-110 inline-flex items-center justify-center rounded-full px-6 py-3 bg-black text-white"
                >
                    Continue Shopping
                </Link>
            </div>
            <style jsx global>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.7s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
        </div>
    );
}
