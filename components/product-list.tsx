"use client";

import Stripe from "stripe";
import { ProductCard } from "./product-card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    products: Stripe.Product[];
}

export const ProductList = ({ products }: Props) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredProduct = products.filter((product) => {
        const term = searchTerm.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(term);
        const descriptionMatch = product.description
            ? product.description.toLowerCase().includes(term)
            : false;

        return nameMatch || descriptionMatch;
    });

    return (
        <div>
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full max-w-md rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {filteredProduct.map((product) => (
                        <motion.li
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.25 }}
                            layout
                        >
                            <ProductCard product={product} />
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
};
