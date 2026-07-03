"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { pdf } from "@react-pdf/renderer";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  max-width: 1000px;
  margin: 2.5rem auto;
  padding: 0 1.5rem;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

const OrderId = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.01em;
`;

const Status = styled.span<{ $status: string }>`
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;

  background: ${({ $status }) =>
    $status === "Pending"
      ? "#FFF3CD"
      : $status === "Confirmed"
        ? "#D1ECF1"
        : $status === "Shipped"
          ? "#E2D9F3"
          : $status === "Delivered"
            ? "#D4EDDA"
            : $status === "Return Requested"
              ? "#FFE8CC"
              : $status === "Returned"
                ? "#D3F9D8"
                : "#F8D7DA"};

  color: ${({ $status }) =>
    $status === "Pending"
      ? "#856404"
      : $status === "Confirmed"
        ? "#0C5460"
        : $status === "Shipped"
          ? "#5A3E9B"
          : $status === "Delivered"
            ? "#155724"
            : $status === "Return Requested"
              ? "#E67700"
              : $status === "Returned"
                ? "#2B8A3E"
                : "#721C24"};
`;

const SectionTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 2.5rem 0 1.25rem;
`;

const AddressCard = styled.div`
  background: #fafafa;
  border: 1px solid #eee;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  line-height: 1.9;
  font-size: 15px;
  color: #333;
`;

const LoadingText = styled.h2`
  text-align: center;
  margin-top: 4rem;
  color: #888;
  font-weight: 500;
`;

const CancelButton = styled.button`
  background: #fff;
  color: #dc3545;
  border: 1px solid #dc3545;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #dc3545;
    color: white;
  }
`;

const ReturnButton = styled.button`
  background: #fff;
  color: #f59e0b;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #f59e0b;
    color: white;
  }
`;

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 0.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
`;

const InfoLabel = styled.p`
  font-size: 12px;
  color: #888;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
`;

const InfoValue = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
`;

const ProductCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid #eee;
  border-radius: 14px;
  background: #fff;
  transition: all 0.2s ease;
  flex-wrap: wrap;

  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    border-color: #e0e0e0;
  }
`;

const ProductImage = styled(Image)`
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #eee;
`;

const ProductLeft = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProductName = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
`;

const ProductMeta = styled.p`
  font-size: 14px;
  color: #777;
`;

const ProductSubtotal = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin-top: 2px;
`;

const ReturnReasonText = styled.p`
  color: #888;
  font-size: 16px;
  font-style: italic;
`;

const ProductRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;

const SummaryCard = styled.div`
  margin-top: 1rem;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 1.75rem;
  background: #fafafa;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  font-size: 15px;
`;

const SummaryLabel = styled.span`
  color: #777;
`;

const SummaryValue = styled.span`
  font-weight: 600;
  color: #1a1a1a;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e2e2;
  margin: 16px 0;
`;

const GrandTotal = styled(SummaryRow)`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
`;

const InvoiceButton = styled.button`
  background: #111;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    transform: translateY(-1px);
  }
`;

export default function OrderDetails() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const shipping = 100;

  const subtotal = order ? order.totalAmount - shipping : 0;

  useEffect(() => {
    getOrder();
  }, []);

  async function getOrder() {
    const res = await fetch(`/api/user/order/${params.id}`);
    const data = await res.json();
    if (data.success) {
      setOrder(data.order);
    }
  }

  async function cancelItem(itemId: string) {
    const confirmCancel = confirm("Are you sure you want to cancel this item?");
    if (!confirmCancel) return;
    try {
      const res = await fetch("/api/user/order/cancel-item", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id, itemId }),
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) getOrder();
    } catch (error) {
      console.log(error);
    }
  }

  async function returnItem(itemId: string) {
    const reason = prompt("Please enter the reason for return:");
    if (!reason) return;
    try {
      const res = await fetch("/api/user/order/return-item", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id, itemId, reason }),
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) getOrder();
    } catch (error) {
      console.log(error);
    }
  }

  async function downloadInvoice() {
    try {
      const blob = await pdf(<InvoiceDocument order={order} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${order._id.slice(-8)}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      alert("Failed to download invoice.");
    }
  }

  if (!order) {
    return <LoadingText>Loading...</LoadingText>;
  }

  return (
    <Container>
      <Card>
        <Header>
          <OrderId>Order #{order._id.slice(-8)}</OrderId>
          <Status $status={order.status}>{order.status}</Status>
        </Header>

        <InfoSection>
          <InfoCard>
            <InfoLabel>Placed On</InfoLabel>
            <InfoValue>
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoLabel>Payment Method</InfoLabel>
            <InfoValue>{order.paymentMethod}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoLabel>Payment Status</InfoLabel>
            <InfoValue>{order.paymentStatus}</InfoValue>
          </InfoCard>
        </InfoSection>

        <SectionTitle>Products</SectionTitle>

        {order.items.map((item: any) => (
          <ProductCard key={item._id}>
            <ProductLeft>
              <ProductImage
                src={item.productId.image}
                alt={item.productId.name}
                width={90}
                height={90}
              />

              <ProductDetails>
                <ProductName>{item.productId.name}</ProductName>

                {item.returnReason && (
                  <ReturnReasonText>Return Reason: {item.returnReason}</ReturnReasonText>
                )}

                <ProductMeta>Qty : {item.quantity}</ProductMeta>
                <ProductMeta>Unit Price : ₹{item.price}</ProductMeta>
                <ProductSubtotal>Subtotal : ₹{item.price * item.quantity}</ProductSubtotal>
              </ProductDetails>
            </ProductLeft>

            <ProductRight>
              <Status $status={item.status}>{item.status}</Status>

              {(item.status === "Pending" || item.status === "Confirmed") && (
                <CancelButton onClick={() => cancelItem(item._id)}>Cancel Item</CancelButton>
              )}

              {item.status === "Delivered" && (
                <ReturnButton onClick={() => returnItem(item._id)}>Return Item</ReturnButton>
              )}
            </ProductRight>
          </ProductCard>
        ))}

        <SectionTitle>Shipping Address</SectionTitle>

        <AddressCard>
          <div>
            <strong>{order.shippingAddress.fullName}</strong>
          </div>
          <div>{order.shippingAddress.addressLine}</div>
          <div>
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </div>
          <div>PIN: {order.shippingAddress.pinCode}</div>
          <div>Phone: {order.shippingAddress.phone}</div>
        </AddressCard>

        <SummaryCard>
          <SectionTitle>Order Summary</SectionTitle>

          <SummaryRow>
            <SummaryLabel>Subtotal</SummaryLabel>
            <SummaryValue>₹{subtotal}</SummaryValue>
          </SummaryRow>

          <SummaryRow>
            <SummaryLabel>Shipping</SummaryLabel>
            <SummaryValue>₹{shipping}</SummaryValue>
          </SummaryRow>

          <Divider />

          <GrandTotal>
            <SummaryLabel>Grand Total</SummaryLabel>
            <SummaryValue>₹{order.totalAmount}</SummaryValue>
          </GrandTotal>

          <Divider />

          <SummaryRow>
            <SummaryLabel>Payment Method</SummaryLabel>
            <SummaryValue>{order.paymentMethod}</SummaryValue>
          </SummaryRow>

          <SummaryRow>
            <SummaryLabel>Payment Status</SummaryLabel>
            <SummaryValue
              style={{
                color: order.paymentStatus === "Paid" ? "#16a34a" : "#dc2626",
              }}
            >
              {order.paymentStatus}
            </SummaryValue>
          </SummaryRow>
        </SummaryCard>

        <ActionButtons>
          <InvoiceButton onClick={downloadInvoice}>
            <FontAwesomeIcon icon={faFileInvoice} />
            Download Invoice
          </InvoiceButton>
        </ActionButtons>
      </Card>
    </Container>
  );
}