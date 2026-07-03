"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

import ProductCard from "@/components/ProductCard";

const Container = styled.section`
  padding: 70px 60px;
  min-height: 70vh;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 42px;
  color: #272727;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #777;
  font-size: 18px;
  margin: 15px 0 60px;
`;

const ProductGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 30px;

  @media (max-width:1200px){
    grid-template-columns:repeat(3,1fr);
  }

  @media (max-width:900px){
    grid-template-columns:repeat(2,1fr);
  }

  @media (max-width:600px){
    grid-template-columns:1fr;
  }
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 100px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 70px;
`;

const EmptyTitle = styled.h2`
  margin-top: 20px;
  color: #272727;
`;

const EmptyText = styled.p`
  color: #777;
  margin: 20px 0 40px;
`;

const ShopButton = styled.button`
  padding: 14px 35px;

  border: none;

  border-radius: 50px;

  background: #D4AF37;

  color: white;

  cursor: pointer;

  font-size: 16px;

  transition: .3s;

  &:hover{
    background:#c79d24;
  }
`;

type WishlistItem = {
    _id: string;
    productId: {
        _id: string;
        name: string;
        price: number;
        image: string;
        category?: {
            name: string;
        };
    };
};



export default function WishlistPage() {

    const [wishlist, setWishlist] =
        useState<WishlistItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const router = useRouter();

    const {
        wishlistIds,
        toggleWishlist,
    } = useWishlist();

    const {
        addToCart,
    } = useCart();

    const [movingProduct, setMovingProduct] =
        useState<string | null>(null);

    const fetchWishlist = async () => {

        try {

            const res = await fetch(
                "/api/user/wishlist"
            );

            const data = await res.json();

            if (data.success) {
                setWishlist(data.wishlist);
            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchWishlist();
    }, [wishlistIds]);



    return (

        <Container>

            <Title>
                My Wishlist
            </Title>

            <Subtitle>
                Save your favourite jewellery pieces
                and shop them anytime.
            </Subtitle>

            {

                loading ?

                    <p>Loading...</p>

                    :

                    wishlist.length === 0 ?

                        <EmptyContainer>

                            <EmptyIcon>
                                🤍
                            </EmptyIcon>

                            <EmptyTitle>
                                Your Wishlist is Empty
                            </EmptyTitle>

                            <EmptyText>
                                Explore our latest collection and
                                save your favourites.
                            </EmptyText>

                            <ShopButton
                                onClick={() => router.push("/shop")}
                            >
                                Continue Shopping
                            </ShopButton>

                        </EmptyContainer>

                        :

                        <ProductGrid>

                            {

                                wishlist.map((item) => (

                                    <ProductCard
                                        key={item._id}
                                        productId={item.productId._id}
                                        name={item.productId.name}
                                        price={item.productId.price}
                                        image={item.productId.image}
                                        category={
                                            item.productId.category?.name || ""
                                        }

                                        onAddToCart={async () => {

                                            setMovingProduct(item.productId._id);


                                            await addToCart(
                                                item.productId._id,
                                                1
                                            );

                                            await toggleWishlist(
                                                item.productId._id
                                            );

                                            setMovingProduct(null);

                                        }
                                    }

                                    isMoving={
                                            movingProduct === item.productId._id
                                        }
                                    />

                            ))

                            }

                        </ProductGrid>

            }

        </Container>

    );

}

