"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const Section = styled.section`
  padding:50px 60px;
  background: #fff;

   @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 42px;
  color: #272727;
  margin-bottom: 50px;

   @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;

  box-shadow: 0 5px 20px rgba(0,0,0,.1);

  transition:.3s;

  &:hover{
    transform:translateY(-10px);
  }
`;

const ViewAllButton = styled.button`
  display: block;

  margin: 60px auto 0;

  padding: 15px 40px;

  background: transparent;

  border: 2px solid #D4AF37;

  border-radius: 50px;

  color: #D4AF37;

  font-size: 16px;

  font-weight: 600;

  letter-spacing: 1px;

  cursor: pointer;

  transition: all 0.3s ease;

  &:hover{
    background: #D4AF37;

    color: #fff;

    transform: translateY(-3px);

    box-shadow: 0 10px 25px rgba(212,175,55,0.3);
  }

  &:active{
    transform: translateY(0);
  }

  @media(max-width:768px){
    padding: 12px 30px;

    font-size: 15px;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  margin: 10px 0 60px;

  font-family: "Cormorant Garamond", serif;
  font-size: 24px;
  font-style: italic;
  color: #8a8a8a;

  letter-spacing: 1px;

   @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 40px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export default function NewArrivals() {

  type Product = {
    _id: string;
    name: string;
    price: number;
    image: string;

    category?: {
      _id: string;
      name: string;
    };
  };

  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  const { addToCart } = useCart();


  useEffect(() => {
    fetchProducts();
  }, [])

  const fetchProducts = async () => {
    try {

      const res = await fetch("/api/user/new-arrivals");

      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }

    } catch (error) {
      console.log(error)
    }
  }



  return (
    <>
      <Section>

        <Title>
          New Arrivals
        </Title>

        <Subtitle>
          Elegant Pieces For Every Occasion
        </Subtitle>

        <ProductGrid>

          {products.map((product) => (

            <ProductCard
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category?.name || ""}

              onAddToCart={() =>
                addToCart(product._id, 1)
              }
            />
          ))}
        </ProductGrid>

        <ViewAllButton
          onClick={() => router.push("/shop")}
        >
          View All →
        </ViewAllButton>

      </Section>
    </>

  )
}