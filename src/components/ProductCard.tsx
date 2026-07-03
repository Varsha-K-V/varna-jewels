"use client";

import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";

import {
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";

import {
  faHeart as faHeartRegular,
} from "@fortawesome/free-regular-svg-icons";

type ProductCardProps = {
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  compact?: boolean;

  isWishlisted?: boolean;

    onWishlistToggle?: (
        productId: string
    ) => void;

    onAddToCart?: () => void;

    isMoving?: boolean;
};

const Card = styled.div`
position: relative;
background:white;

border-radius:12px;
overflow:hidden;

box-shadow: 0 2px 10px rgba(0,0,0,0.1);
cursor:pointer;
transition:0.3s;

&:hover{
transform:translate(-5px);
}
`;

const ProductImage = styled.img<{ $compact?: boolean }>`
width:100%;
height:${props => props.$compact ? "120px" : "280px"};
object-fit:cover;
`;

const ProductInfo = styled.div`
padding:15px;
`;

const Category = styled.p`
color:#D4AF37;
font-size:14px;
font-weight:500;
margin-bottom:8px;
text-transform:uppercase;
letter-spacing:1px;
`;

const ProductName = styled.h3<{ $compact?: boolean }>`
font-size:${props => props.$compact ? "15px" : "18px"};

color:#272727;

margin-bottom:10px;
`;

const ProductPrice = styled.p<{ $compact?: boolean }>`
color:#d4af37;

font-size:${props => props.$compact ? "16px" : "20px"};

font-weight:bold;
`;

const WishlistButton = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;

  width: 42px;
  height: 42px;

  border: none;
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.95);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  font-size: 20px;

  color: ${({ $active }) => ($active ? "#e53935" : "#272727")};

  transition: all 0.25s ease;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);

  &:hover {
    transform: scale(1.08);
  }
`;

const AddToCartButton = styled.button`
  width: 100%;

  margin-top: 15px;

  padding: 12px;

  border: none;
  border-radius: 8px;

  background: #272727;
  color: white;

  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  font-size: 16px;
  font-weight: 500;

  transition: 0.3s;

  &:hover {
    background: #d4af37;
    color: #272727;
  }
`;


export default function ProductCard({
  productId,
  name,
  price,
  image,
  category,
  compact,

  onAddToCart,
}: ProductCardProps) {



  const router = useRouter();

  const {
    wishlistIds,
    toggleWishlist,
  } = useWishlist();

  const isWishlisted =
    wishlistIds.includes(productId);

  const { addToCart } = useCart();


  return (
    <Card onClick={() =>
      router.push(`/product/${productId}`)
    }>

      {!compact && (

        <WishlistButton

          $active={isWishlisted}
          onClick={(e) => {
            e.stopPropagation();

            toggleWishlist(productId);
          }}
        >
          <FontAwesomeIcon
            icon={isWishlisted ? faHeartSolid : faHeartRegular}
          />
        </WishlistButton>


      )}

      <ProductImage
        src={image}
        alt={name}
        $compact={compact}
      />

      <ProductInfo>
        <Category>{category}</Category>

        <ProductName $compact={compact}>
          {name}
        </ProductName>

        <ProductPrice $compact={compact}>
          ₹{price}
        </ProductPrice>

        {!compact && (
          <AddToCartButton
          onClick={(e)=>{
            e.stopPropagation();
            onAddToCart?.();
          }}
          >
            <FontAwesomeIcon icon={faCartShopping} />
            Add To Cart
          </AddToCartButton>
        )}




      </ProductInfo>
    </Card>
  )
}