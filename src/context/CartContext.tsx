"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

type CartItem = {
    productId: {
        _id: string;
        name: string;
        price: number;
        image: string;
    };
    quantity: number;
};

type CartContextType = {
    cartItems: CartItem[];

    fetchCart: () => Promise<void>;

    addToCart: (
        productId: string,
        quantity: number
    ) => Promise<void>;

    updateQuantity: (
        productId: string,
        action: "increase" | "decrease"
    ) => Promise<void>;

    removeItem: (
        productId: string
    ) => Promise<void>;

    subtotal: number;

    shipping: number;

    total: number;

    cartCount: number;
};

const CartContext =
    createContext<CartContextType | null>(null);

type CartProviderProps = {
    children: ReactNode;
};

export function CartProvider({
    children,
}: CartProviderProps) {

    const [cartItems, setCartItems] =
        useState<CartItem[]>([]);

    useEffect(() => {
        fetchCart();
    }, []);



    const fetchCart = async () => {
        try {
            const res = await fetch("/api/user/cart/get");

            if (!res.ok) {
                console.log("User not logged in.")
                return;
            }
            const data = await res.json();
            console.log("Fetched items:", data.items);

            setCartItems(data?.items || []);
        } catch (error) {
            console.log(error);
        }
    };

    const addToCart = async (
        productId: string,
        quantity: number
    ) => {
        try {

            const res = await fetch(
                "/api/user/cart/add",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        productId,
                        quantity,
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                console.log("Add API Response:", data);

                alert(data.message);


                await fetchCart();

            }

        } catch (error) {

            console.log(error);

        }
    };

    const updateQuantity = async (
        productId: string,
        action: "increase" | "decrease"
    ) => {
        try {

            const res = await fetch(
                "/api/user/cart/update",
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        productId,
                        action,
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                await fetchCart();
            }

        } catch (error) {

            console.log(error);

        }
    };

    const removeItem = async (
        productId: string
    ) => {

         const confirmed = window.confirm(
                "Are you sure you want to remove this item?"
            );

            if (!confirmed) return;



        try {

            const res = await fetch(
                "/api/user/cart/remove",
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        productId,
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                await fetchCart();
                alert(data.message);
            }

        } catch (error) {

            console.log(error);

        }
    };



    const subtotal = cartItems.reduce(
        (acc, item) =>
            acc + item.productId.price * item.quantity,
        0
    );

    const shipping = subtotal >= 1000 ? 0 : 100;

    const total = subtotal + shipping;

    const cartCount = cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    console.log("Cart Context:", cartItems);

    return (

        <CartContext.Provider
            value={{
                cartItems,

                fetchCart,

                addToCart,

                updateQuantity,

                removeItem,

                subtotal,

                shipping,

                total,

                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>

    );
}

export function useCart() {

    const context =
        useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        );
    }

    return context;
}