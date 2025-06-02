"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { checkoutAction } from "./checkout-action";
import { useEffect, useRef, useState, Fragment } from "react";

export default function CheckoutPage() {
    const { items, removeItem, addItem } = useCartStore();
    const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    // Track animated item prices by id
    const [animatedPrices, setAnimatedPrices] = useState<{
        [id: string]: boolean;
    }>({});
    const prevQuantities = useRef<{ [id: string]: number }>({});

    useEffect(() => {
        items.forEach((item) => {
            const prevQty = prevQuantities.current[item.id] ?? item.quantity;
            if (prevQty !== item.quantity) {
                setAnimatedPrices((prev) => ({ ...prev, [item.id]: true }));
                setTimeout(() => {
                    setAnimatedPrices((prev) => ({
                        ...prev,
                        [item.id]: false,
                    }));
                }, 200);
            }
            prevQuantities.current[item.id] = item.quantity;
        });
    }, [items]);

    // Modal state
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

    const handleRemove = (item: (typeof items)[number]) => {
        if (item.quantity === 1) {
            setPendingRemoveId(item.id);
            setShowConfirm(true);
        } else {
            removeItem(item.id);
        }
    };

    const confirmRemove = () => {
        if (pendingRemoveId) {
            removeItem(pendingRemoveId);
            setShowConfirm(false);
            setPendingRemoveId(null);
        }
    };

    const cancelRemove = () => {
        setShowConfirm(false);
        setPendingRemoveId(null);
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
                {/* Animated empty cart icon */}
                <div className="mb-6">
                    <svg
                        className="w-28 h-28 text-gray-300 animate-bounce-slow"
                        fill="none"
                        viewBox="0 0 96 96"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="16"
                            y="32"
                            width="64"
                            height="36"
                            rx="8"
                            fill="#f3f4f6"
                        />
                        <path
                            d="M24 32V28a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v4"
                            stroke="#d1d5db"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="32" cy="72" r="6" fill="#d1d5db" />
                        <circle cx="64" cy="72" r="6" fill="#d1d5db" />
                        <path
                            d="M32 52h32"
                            stroke="#a3a3a3"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-2 text-gray-800 animate-fade-in-down">
                    Your Cart is Empty
                </h1>
                <p className="text-gray-500 mb-6 animate-fade-in-down delay-100">
                    Looks like you haven&apos;t added anything yet.
                </p>
                <a href="/" className="inline-block">
                    <Button className="px-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform duration-200 active:scale-95 hover:scale-105 animate-pop-in">
                        Return To Home
                    </Button>
                </a>
                <style jsx global>{`
                    @keyframes bounce-slow {
                        0%,
                        100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-18px);
                        }
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 1.6s infinite
                            cubic-bezier(0.68, -0.55, 0.27, 1.55);
                    }
                    @keyframes fade-in-down {
                        0% {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fade-in-down {
                        animation: fade-in-down 0.7s both;
                    }
                    .animate-fade-in-down.delay-100 {
                        animation-delay: 0.1s;
                    }
                    @keyframes pop-in {
                        0% {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    .animate-pop-in {
                        animation: pop-in 0.4s both;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <Fragment>
            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity animate-fade-in">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs transform transition-all scale-95 animate-pop-in">
                        <h2 className="text-lg font-bold mb-2 text-center">
                            Remove Item?
                        </h2>
                        <p className="text-gray-700 mb-4 text-center">
                            Are you sure you want to remove this item from your
                            cart?
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={confirmRemove}
                                className="bg-red-600 hover:bg-red-700 text-white transition-transform duration-150 active:scale-90 hover:scale-110"
                            >
                                Yes, Remove
                            </Button>
                            <Button
                                variant="outline"
                                onClick={cancelRemove}
                                className="transition-transform duration-150 active:scale-90 hover:scale-110"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Checkout
                </h1>
                <Card className="max-w-md mx-auto mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            Order Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex flex-col gap-2 border-b pb-2"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">
                                            {item.name}
                                        </span>
                                        <span
                                            className={`font-semibold text-lg transition-transform duration-200 ${
                                                animatedPrices[item.id]
                                                    ? "scale-125"
                                                    : ""
                                            }`}
                                        >
                                            £
                                            {(
                                                (item.price * item.quantity) /
                                                100
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-center">
                                        <Button
                                            onClick={() => handleRemove(item)}
                                            className="transition-transform duration-150 active:scale-90 hover:scale-110"
                                        >
                                            –
                                        </Button>
                                        <span className="text-base font-semibold">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            onClick={() =>
                                                addItem({
                                                    ...item,
                                                    quantity: 1,
                                                })
                                            }
                                            className="transition-transform duration-150 active:scale-90 hover:scale-110"
                                        >
                                            +
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 border-t pt-2 text-lg font-semibold">
                            Total: £{(total / 100).toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                <form action={checkoutAction} className="max-w-md mx-auto">
                    <input
                        type="hidden"
                        name="items"
                        value={JSON.stringify(items)}
                    />
                    <Button
                        type="submit"
                        variant="default"
                        className="w-full transition-transform duration-150 active:scale-90 hover:scale-110"
                    >
                        Proceed to Payment
                    </Button>
                </form>
            </div>
        </Fragment>
    );
}
