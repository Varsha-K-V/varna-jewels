"use client"

import { useState,useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Container = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,.08);
`;

const OrderHeader = styled.div`
  display:flex;
  justify-content:space-between;
  margin-bottom:1rem;
`;

const OrderId = styled.h3`
  margin:0;
`;


const Amount = styled.p`
  font-size:18px;
  font-weight:bold;
`;

const DateText = styled.p`
  color:#777;
`;

const ProductList = styled.div`
  margin: 1rem 0;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items:center;
  padding:12px 0;
  border-bottom:1px solid #eee;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductName = styled.span`
  font-size:18px;
  font-weight:500;
  color: #333;
`;

const Quantity = styled.span`
  font-size:14px;
  font-weight:400;
  color: #777;
`;

type StatusProps = {
  $status: string;
};

const Status = styled.span<StatusProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 90px;

  padding: 6px 12px;
  border-radius: 20px;

  font-size: 13px;
  font-weight: 600;

  background-color: ${({ $status }) =>
    $status === "Pending"
      ? "#FFF3CD"
      : $status === "Confirmed"
      ? "#D1ECF1"
      : $status === "Shipped"
      ? "#E2D9F3"
      : $status === "Delivered"
      ? "#D4EDDA"
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
      : "#721C24"};

  border: 1px solid
    ${({ $status }) =>
      $status === "Pending"
        ? "#FFE69C"
        : $status === "Confirmed"
        ? "#9EEAF9"
        : $status === "Shipped"
        ? "#C8B6FF"
        : $status === "Delivered"
        ? "#A3CFBB"
        : "#F1AEB5"};
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
export default function MyOrders(){

    const [orders,setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(()=>{
        getOrders();
    },[]);

    async function getOrders(){
        try{

            const res = await fetch("/api/user/order");

            const data = await res.json();

            console.log(data);

            

            if(data.success){
                setOrders(data.orders);
            }

        }catch(error){
            console.log(error)
        }finally{
            setLoading(false);
        }
    }
    if (loading) {
    return (
        <Container>
            <Title>My Orders</Title>
            <p>Loading...</p>
        </Container>
    );
}

    if(orders.length === 0){
        return(
            <Container>
                <Title>My Ordres</Title>
                <p style={{fontSize:"18px",fontWeight:"800"}}>No Orders found.</p>
            </Container>
        );

    }
    return(
        <Container>

            <Title>My Orders</Title>
            {orders.map((order:any)=>(
                <OrderCard key ={order._id}>
                    <OrderHeader>

                        <OrderId>
                            Order #{order._id.slice(-8)}
                        </OrderId>

                        {/* <Status $status={order.status}>
                            {order.status}
                        </Status> */}

                    </OrderHeader>

                    <ProductList>
                        {order.items.map((item:any,index:number)=>(
                            <ProductItem
                            key={`${order._id}-${item.productId._id}-${index}`}
                            >
                                <ProductDetails>
                                    <ProductName>
                                    {item.productId.name}
                                </ProductName>

                                <Quantity>
                                    Qty: {item.quantity}
                                </Quantity>
                                </ProductDetails>
                                

                                <Status $status={item.status}>
                                    {item.status}
                                </Status>

                            </ProductItem>
                        ))}

                    </ProductList>

                     <Footer>
                         <div>
                            <Amount>
                              ₹{order.totalAmount}
                            </Amount>

                            <DateText>
                                Ordered on{" "}
                                {new Date(
                                    order.createdAt
                                ).toLocaleString()}
                            </DateText>

                         </div>

                         <ViewButton onClick={()=>
                            router.push(`/my-orders/${order._id}`)
                         }>
                            View Details
                         </ViewButton>

                     </Footer>

                    {/* <Amount>
                          ₹{order.totalAmount}
                    </Amount>

                    <DateText>
                        {new Date(
                            order.createdAt
                        ).toLocaleString()}
                    </DateText> */}

                </OrderCard>
            ))}
        </Container>

    )
}