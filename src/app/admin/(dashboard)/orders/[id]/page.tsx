"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
padding:30px;
`;

const Card = styled.div`
background:white;
padding:30px;
border-radius:12px;
box-shadow:0 2px 8px rgba(0,0,0,.1);
`;

const Title = styled.h1`
margin-bottom:30px;
`;

const SectionTitle = styled.h2`
margin-top:30px;
margin-bottom:15px;
`;

const InfoCard = styled.div`
display:flex;
flex-direction:column;
gap:12px;
padding:20px;
background:#fafafa;
border-radius:10px;
`;

const InfoRow = styled.div`
font-size:18px;
display:flex;
gap:10px;
`;

const ProductCard = styled.div`
display:flex;
justify-content:space-between;
align-items:center;
padding:20px;
background:#fafafa;
margin-bottom:15px;
border-radius:10px;
`;

const ProductName = styled.div`
font-size:18px;
font-weight:600;
`;

type StatusProps = {
    $status: string;
};

// const Status = styled.span<StatusProps>`
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;

//   min-width: 100px;

//   padding: 8px 16px;

//   border-radius: 20px;

//   font-size: 14px;
//   font-weight: 600;

//   background-color: ${({ $status }) =>
//     $status === "Pending"
//       ? "#FFF3CD"
//       : $status === "Confirmed"
//       ? "#D1ECF1"
//       : $status === "Shipped"
//       ? "#E2D9F3"
//       : $status === "Delivered"
//       ? "#D4EDDA"
//       : "#F8D7DA"};

//   color: ${({ $status }) =>
//     $status === "Pending"
//       ? "#856404"
//       : $status === "Confirmed"
//       ? "#0C5460"
//       : $status === "Shipped"
//       ? "#5A3E9B"
//       : $status === "Delivered"
//       ? "#155724"
//       : "#721C24"};

//   border: 1px solid
//     ${({ $status }) =>
//       $status === "Pending"
//         ? "#FFE69C"
//         : $status === "Confirmed"
//         ? "#9EEAF9"
//         : $status === "Shipped"
//         ? "#C8B6FF"
//         : $status === "Delivered"
//         ? "#A3CFBB"
//         : "#F1AEB5"};
// `;

const StatusSelect = styled.select<StatusProps>`
  padding: 8px 14px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-weight: 600;
  cursor: pointer;

  background-color: ${({ $status }) =>
    $status === "Pending"
      ? "#FFF3CD"
      : $status === "Confirmed"
      ? "#D1ECF1"
      : $status === "Shipped"
      ? "#E2D9F3"
      : $status === "Delivered"
      ? "#D4EDDA"
      : $status === "Cancelled"
      ? "#F8D7DA"
      : $status === "Returned"
      ? "#E9D8FD"
      : "#F8F9FA"};

  color: ${({ $status }) =>
    $status === "Pending"
      ? "#856404"
      : $status === "Confirmed"
      ? "#0C5460"
      : $status === "Shipped"
      ? "#5A3E9B"
      : $status === "Delivered"
      ? "#155724"
      : $status === "Cancelled"
      ? "#721C24"
      : $status === "Returned"
      ? "#6B21A8"
      : "#495057"};
`;

const Total = styled.h2`
margin-top:30px;
text-align:right;
`;

const ApproveButton = styled.button`
  background: #198754;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;
export default function AdminOrderDetails() {

    const params = useParams();

    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        getOrder();
    }, []);

    async function getOrder() {

        try {

            const res = await fetch(
                `/api/admin/order/${params.id}`
            );

            const data = await res.json();

            if (data.success) {
                setOrder(data.order);
            }

        } catch (error) {

            console.log(error);

        }
    }

    async function updateStatus(
        itemId: string,
        status: string
    ) {

        try {

            const res = await fetch(
                "/api/admin/order/update-status",
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        orderId: order._id,
                        itemId,
                        status
                    })

                }
            );

            const data = await res.json();

            alert(data.message);

            if (data.success) {

                getOrder();

            }

        }
        catch (error) {

            console.log(error);

        }

    }

    const approveReturn = async (
        orderId: string,
        itemId: string
    ) => {

         console.log("Approve button clicked");
  console.log(orderId, itemId);

        try {

            const res = await fetch(
                "/api/admin/order/approve-return",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        orderId,
                        itemId,
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {

                alert(data.message);

                getOrder();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

        }

    };


if (!order) {
    return (
        <div>
            <h2>Loading...</h2>
        </div>
    );
}

return (

    <Container>

        <Card>

            <Title>
                Order #{order._id.slice(-8)}
            </Title>

            <SectionTitle>
                Customer Details
            </SectionTitle>

            <InfoCard>

                <InfoRow>
                    <strong>Name:</strong>
                    {order.userId.name}
                </InfoRow>

                <InfoRow>
                    <strong>Email:</strong>
                    {order.userId.email}
                </InfoRow>

            </InfoCard>

            <SectionTitle>
                Shipping Address
            </SectionTitle>

            <InfoCard>

                <InfoRow>
                    <strong>Name:</strong>
                    {order.shippingAddress.fullName}
                </InfoRow>

                <InfoRow>
                    <strong>Address:</strong>
                    {order.shippingAddress.addressLine}
                </InfoRow>

                <InfoRow>
                    <strong>PIN:</strong>
                    {order.shippingAddress.pinCode}
                </InfoRow>

                <InfoRow>
                    <strong>Phone:</strong>
                    {order.shippingAddress.phone}
                </InfoRow>

            </InfoCard>

            <SectionTitle>
                Products
            </SectionTitle>

            {
                order.items.map((item: any) => (

                    <ProductCard
                        key={item._id}
                    >

                        <ProductName>
                            {item.productId.name}
                        </ProductName>

                        <div>
                            Qty : {item.quantity}
                        </div>

                        <div>
                            ₹{item.price}
                        </div>

                        {item.status === "Return Requested" ? (

                            <ApproveButton
                                onClick={() => approveReturn(order._id, item._id)}
                            >
                                Approve Return
                            </ApproveButton>

                        ) : (

                            <StatusSelect
                                $status={item.status}
                                value={item.status}
                                onChange={(e) =>
                                    updateStatus(item._id, e.target.value)
                                }
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Returned">Returned</option>
                            </StatusSelect>

                        )}

                    </ProductCard>

                ))
            }

            <Total>
                Total Amount : ₹{order.totalAmount}
            </Total>

        </Card>

    </Container>

);
}

