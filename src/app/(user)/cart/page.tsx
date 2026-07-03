"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const PageWrapper = styled.div`
  display: flex;
  gap: 30px;

  align-items: flex-start;
`;



const Title = styled.h1`
text-align:center;
margin-bottom:40px;
margin-top:40px;
`;
const CartSection = styled.div`
  flex: 3;
`;


const CartItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: white;
  padding: 20px;
  margin-bottom: 15px;

  border-radius: 10px;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.1);
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const Name = styled.h3``;

const Price = styled.p`
  font-weight: bold;
`;

const Quantity = styled.p``;

const Total = styled.h2`
  text-align: right;
  margin-top: 30px;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.button`
  width: 35px;
  height: 35px;

  border: none;

  background: #272727;
  color: white;

  cursor: pointer;

  border-radius: 4px;

  font-size: 18px;
  font-weight: bold;

  cursor: pointer;

   transition: 0.3s;

  &:hover {
    background: #d4af37;
    color: #272727;
  }
`;

const QuantityText = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const RemoveButton = styled.button`
  background: #ff4d4f;

  color: white;

  border: none;

  padding: 8px 14px;

  border-radius: 6px;

  cursor: pointer;

  transition: 0.3s;

  &:hover {
    opacity: 0.85;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SummarySection = styled.div`
  flex: 1;
`;

const SummaryCard = styled.div`
  background: white;

  padding: 25px;

  border-radius: 12px;

  box-shadow: 0 2px 10px rgba(0,0,0,0.08);

  position: sticky;
  top: 120px;
`;

const SummaryTitle = styled.h2`
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;

  justify-content: space-between;

  margin-bottom: 15px;

  font-size: 16px;
`;

const Divider = styled.hr`
  margin: 20px 0;
`;

const GrandTotal = styled.div`
  display: flex;

  justify-content: space-between;

  font-size: 20px;

  font-weight: bold;
`;

const CheckoutButton = styled.button`
  width: 100%;

  margin-top: 25px;

  padding: 14px;

  border: none;

  border-radius: 8px;

  background: #272727;

  color: white;

  font-size: 16px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.3s;

  &:hover {
    background: #d4af37;
    color: #272727;
  }
`;


export default function CartPage() {

  type cartItem = {
    productId: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
  };

  const {
    cartItems,
    updateQuantity,
    removeItem,
    subtotal,
    shipping,
    total,
  } = useCart();

  const router = useRouter();

  if (cartItems.length === 0) {
    return (
      <PageWrapper>
        <CartSection>
          <Title>Your Cart</Title>
          <p style={{ textAlign: "center", fontWeight: "800", fontSize: "20px" }}>Your cart is empty</p>
        </CartSection>
      </PageWrapper>
    );
  }


  return (
    <PageWrapper>

      <CartSection>

        <Title>Your Cart</Title>

        {cartItems.map((item) => (
          <CartItemWrapper key={item.productId._id}>

            <ProductInfo>
              <Image src={item.productId.image} />

              <div>
                <Name>{item.productId.name}</Name>
                <Price>
                  ₹{item.productId.price}
                </Price>
              </div>
            </ProductInfo>

            <Actions>

              <QuantityContainer>

                <QuantityButton
                  onClick={() =>
                    updateQuantity(
                      item.productId._id,
                      "decrease"
                    )
                  }
                >
                  -
                </QuantityButton>

                <QuantityText>
                  {item.quantity}
                </QuantityText>

                <QuantityButton
                  onClick={() =>
                    updateQuantity(
                      item.productId._id,
                      "increase"
                    )
                  }
                >
                  +
                </QuantityButton>

              </QuantityContainer>

              <RemoveButton
                onClick={() =>
                  removeItem(item.productId._id)
                }
              >
                Remove
              </RemoveButton>

            </Actions>

          </CartItemWrapper>
        ))}

      </CartSection>

      <SummarySection>

        <SummaryCard>

          <SummaryTitle>
            Order Summary
          </SummaryTitle>

          <SummaryRow>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </SummaryRow>

          <SummaryRow>
            <span>Shipping</span>
            <span> {shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </SummaryRow>

          <Divider />

          <GrandTotal>
            <span>Total</span>
            <span>₹{total}</span>
          </GrandTotal>

          <CheckoutButton
            onClick={() => router.push("/checkout")}>
            Proceed To Checkout
          </CheckoutButton>

        </SummaryCard>

      </SummarySection>

    </PageWrapper>
  );
}