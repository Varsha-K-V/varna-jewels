"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";


type WishlistContextType = {
    wishlistIds: string[];
    setWishlistIds: React.Dispatch<
        React.SetStateAction<string[]>
    >;
     fetchWishlist: () => Promise<void>;
     toggleWishlist: (
    productId: string
  ) => Promise<void>;
};

const WishlistContext =
    createContext<WishlistContextType | null>(null);

type WishlistProviderProps = {
    children: ReactNode;
};

export function WishlistProvider({
    children,
}: WishlistProviderProps) {

    const [wishlistIds, setWishlistIds] = useState<string[]>([]);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {

            const res = await fetch("/api/user/wishlist");

            const data = await res.json();

            if (data.success) {

                setWishlistIds(
                    data.wishlist.map(
                        (item: any) => item.productId._id
                    )
                );

            }

        } catch (error) {

            console.log(error);

        }
    };

    const toggleWishlist = async (
  productId: string
) => {

  try {

    if (wishlistIds.includes(productId)) {

      // Remove from wishlist
      const res = await fetch(
        `/api/user/wishlist/${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {

        setWishlistIds((prev) =>
          prev.filter(
            (id) => id !== productId
          )
        );

      }

    } else {

      // Add to wishlist
      const res = await fetch(
        "/api/user/wishlist",
        {
          method: "POST",
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

        setWishlistIds((prev) => [
          ...prev,
          productId,
        ]);

      }

    }

  } catch (error) {

    console.log(error);

  }

};

    return (
        <WishlistContext.Provider value={{
            wishlistIds,
            setWishlistIds,
            fetchWishlist,
             toggleWishlist,
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);

    if (!context) {
        throw new Error(
            "useWishlist must be used inside WishlistProvider"
        );
    }

    return context;
}