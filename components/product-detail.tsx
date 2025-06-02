"use client";

import Stripe from "stripe";
import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useRef, useState } from "react";

interface Props {
  product: Stripe.Product;
}

export const ProductDetail = ({ product }: Props) => {
  const { items, addItem, removeItem } = useCartStore();
  const price = product.default_price as Stripe.Price;
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const [animate, setAnimate] = useState(false);
  const prevQuantity = useRef(quantity);

  useEffect(() => {
    if (prevQuantity.current !== quantity) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 200);
      prevQuantity.current = quantity;
      return () => clearTimeout(timeout);
    }
  }, [quantity]);

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: price.unit_amount as number,
      imageUrl: product.images ? product.images[0] : null,
      quantity: 1,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      {product.images && product.images[0] && (
        <div className="w-full flex justify-center mb-6">
          <div className="relative w-full max-w-2xl aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
              className="transition duration-300 hover:opacity-90"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </div>
      )}
      <div className="w-full max-w-sm flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-3 text-center">{product.name}</h1>
        {product.description && (
          <p className="text-gray-700 mb-3 text-center">{product.description}</p>
        )}
        {price && price.unit_amount && (
          <p className="text-base font-semibold text-gray-900 mb-3 text-center">
            £{(price.unit_amount / 100).toFixed(2)}
          </p>
        )}
        <div className="flex items-center justify-center space-x-3">
          <Button
            onClick={() => removeItem(product.id)}
            className="transition-transform duration-150 active:scale-90 hover:scale-110"
          >
            –
          </Button>
          <span
            className={`text-base font-semibold transition-transform duration-200 ${
              animate ? "scale-125" : ""
            }`}
          >
            {quantity}
          </span>
          <Button
            onClick={onAddItem}
            className="transition-transform duration-150 active:scale-90 hover:scale-110"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};
