"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
padding:20px;
`;

const Title = styled.h1`
margin-top:20px;
margin-bottom:40px;
text-align:center;
`;

const OrderList = styled.div`
  display:flex;
  flex-direction:column;
  gap:15px;
`;

const TableHeader = styled.div`
  display:grid;

  grid-template-columns:
    1.3fr
    1.5fr
    1fr
    1fr
    1.5fr
    180px;

  padding:15px;

  background:black;

  color:white;

  border-radius:8px;

  font-weight:bold;

  align-items:center;
`;

const OrderRow = styled.div`
  display:grid;

  grid-template-columns:
    1.3fr
    1.5fr
    1fr
    1fr
    1.5fr
    180px;

  padding:15px;

  background:white;

  border-radius:8px;

  align-items:center;

  box-shadow:
    0px 2px 8px rgba(0,0,0,0.1);
`;

const ActionButtons = styled.div`
  display:flex;
  gap:10px;
`;



const EditButton = styled.button`
padding :8px 15px;
border:none;
background-color:#2563eb;
color:white;
border-radius:5px;
cursor:pointer;
font-size:18px;

&:hover{
 background:#4992eb;
}
`;


export default function OrdersPage(){
    const [orders,setOrders] = useState([]);

    const router = useRouter();

    useEffect(()=>{
        getOrders();
    },[]);

    const getOrders = async ()=>{

        try{

            const res = await fetch("/api/admin/order");
            const data = await res.json();

            if(data.success){
                setOrders(data.orders)
            }

        }catch(error){
            console.log(error);
        }
    }

    return (
  <Container>

    <Title>Order Management</Title>

    <OrderList>

      <TableHeader>

        <div style={{fontSize:"20px"}}>Order ID</div>

        <div style={{fontSize:"20px"}}>Customer</div>

        <div style={{fontSize:"20px"}}>Items</div>

        <div style={{fontSize:"20px"}}>Amount</div>

        <div style={{fontSize:"20px"}}>Date</div>

        <div style={{fontSize:"20px"}}>Actions</div>

      </TableHeader>

      {orders.map((order:any)=>(

        <OrderRow key={order._id}>

          <div style={{fontSize:"18px"}}>
            #{order._id.slice(-8)}
          </div>

          <div style={{fontSize:"18px"}}>
            {order.userId.name}
          </div>

          <div style={{fontSize:"18px"}}>
            {order.items.length}
          </div>

          <div style={{fontSize:"18px"}}>
            ₹{order.totalAmount}
          </div>

          <div style={{fontSize:"18px"}}>
            {
              new Date(order.createdAt)
              .toLocaleDateString()
            }
          </div>

          <ActionButtons>

            <EditButton
            onClick={()=>
              router.push(
                `/admin/orders/${order._id}`
              )
            }
            >
              View
            </EditButton>

          </ActionButtons>

        </OrderRow>

      ))}

    </OrderList>

  </Container>
);

}