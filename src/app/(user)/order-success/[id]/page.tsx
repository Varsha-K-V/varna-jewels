"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
// import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCreditCard,
  faTruckFast,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";

import {
  faMoneyBillWave,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const SuccessCard = styled.div`
  background: #fff;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const SuccessIcon = styled.div`
  font-size: 70px;
  color: #22c55e;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #222;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.75rem;
`;

const OrderId = styled.p`
  font-size: 0.95rem;
  color: #999;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

const SecondaryButton = styled.button`
  background: white;
  color: #000;
  border: 1px solid #ddd;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #f8f8f8;
  }
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #eee;
    margin: 2rem 0;
`;

const InfoRow = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:12px 0;
`;

const Label = styled.span`
    color:#666;
    font-weight:500;
`;

const Value = styled.span`
    color:#222;
    font-weight:600;
`;
export default function OrderSuccessPage() {

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    getOrder();
  }, []);

  const params = useParams();
  const router = useRouter();

  async function getOrder() {
    try {
      const res = await fetch(`/api/user/order/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!order) {
    return <p>Loading...</p>;
  }




  return (
    <Container>

      <SuccessCard>

        <SuccessIcon>
          <FontAwesomeIcon icon={faCircleCheck} />
        </SuccessIcon>

        <Title>
          Order Placed Successfully
        </Title>

        <Message>
          Thank you for choosing Varna Jewels.
        </Message>

        <Message>
          Your order has been placed successfully and is now being processed.
        </Message>

        <OrderId>
          Order ID : {String(params.id).slice(-8)}
        </OrderId>

        <Divider />

        <InfoRow>

          <Label>
            Payment Method
          </Label>

          <Value>
            <FontAwesomeIcon
              icon={
                order.paymentMethod === "COD"
                  ? faMoneyBillWave
                  : order.paymentMethod === "RAZORPAY"
                    ? faCreditCard
                    : faWallet
              }
            />{" "}
            {order.paymentMethod === "COD"
              ? "Cash On Delivery"
              : order.paymentMethod === "RAZORPAY"
                ? "Razorpay"
                : "Wallet"}
          </Value>
        </InfoRow>

        <InfoRow>

          <Label>
            Payment Status
          </Label>

          <Value
            style={{ color: "#22c55e" }}
          >
            Paid
          </Value>

        </InfoRow>

        <InfoRow>

          <Label>
            Estimated Delivery
          </Label>

          <Value>
            <FontAwesomeIcon icon={faTruckFast} />
            {" "}
            3–5 Business Days
          </Value>

        </InfoRow>

        <Divider />

        <ButtonGroup>

          <PrimaryButton
            onClick={() => router.push("/my-orders")}
          >
            View My Orders
          </PrimaryButton>

          {/* <SecondaryButton
            disabled
          >
            <FontAwesomeIcon
              icon={faFileInvoice}
            />
            {" "}
            Download Invoice
          
          </SecondaryButton> */}

          <SecondaryButton
            onClick={() => router.push("/shop")}
          >
            Continue Shopping
          </SecondaryButton>

        </ButtonGroup>

      </SuccessCard>

    </Container>
  );
}