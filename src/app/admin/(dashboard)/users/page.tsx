"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";

const Container = styled.div`
padding:20px;
`;

const Title = styled.h1`
margin-top:20px;
margin-bottom:40px;
text-align:center;
`;

const UserList = styled.div`
  display:flex;
  flex-direction:column;
  gap:15px;
`;

const TableHeader = styled.div`
  display:grid;

  grid-template-columns:
  2fr
  2fr
  1fr
  1fr
  120px;

  padding:15px;

  background:black;

  color:white;

  border-radius:8px;

  font-weight:bold;

  align-items:center;
`;

const UserRow = styled.div`
  display:grid;

  grid-template-columns:
  2fr
  2fr
  1fr
  1fr
  120px;

  padding:15px;

  background:white;

  border-radius:8px;

  align-items:center;

  box-shadow:
    0px 2px 8px rgba(0,0,0,0.1);
`;

const BlockButton = styled.button`
padding :8px 15px;
border:none;
background:#dc2626;
color:white;
border-radius:5px;
cursor:pointer;
font-size:18px;

&:hover{
 background:#4992eb;
}

`;

const UnblockButton = styled.button`
padding :8px 15px;
border:none;
background:#16a34a;
color:white;
border-radius:5px;
cursor:pointer;
font-size:18px;

&:hover{
 background:#4992eb;
}

`;

const PaginationContainer = styled.div`
display:flex;
justify-content:center;
align-items:center;
gap:20px;
margin-top:30px;
`;

const PaginationButton = styled.button`
padding:10px 20px;
    border:none;
    border-radius:5px;
    background:black;
    color:white;
    cursor:pointer;

    &:disabled{
      opacity:0.5;
      cursor:not-allowed;
    }
`;

  
export default function UsersPage() {

    type User = {
        _id:string;
        name:string;
        email:string;
        createdAt:string;
        isBlocked:boolean;

    };

    const [users,setUsers] = useState<User[]>([]);
    const [page,setPage] = useState(1);
    const [totalPages,setTotalPages]= useState(1);

    useEffect(()=>{
        fetchUsers();
    },[page]);

    const fetchUsers = async () =>{
        try{
            const res = await fetch(`/api/admin/users/get?page=${page}`);

        const data = await res.json();

        setUsers(data.users);
        setTotalPages(data.totalPages);

        }catch(error){
            console.log(error);
        }
        
    }

    const handleToggleUserStatus = async (
        id:string,
        isBlocked:boolean
    )=>{
        try{
            const endpoint = isBlocked 
            ? `/api/admin/users/unblock/${id}`
            : `/api/admin/users/block/${id}`;

            const res = await fetch(endpoint,{
                method:"PUT",
            });

            const data = await res.json();

            alert(data.message);

            if(res.ok){
                fetchUsers();
            }

        }catch(error){
            console.log(error);
        }
    }
  return (
    <Container>
      <Title>User Management</Title>
    

    <UserList>
        <TableHeader>
            <div style={{fontSize:"20px"}}>Name</div>
            <div style={{fontSize:"20px"}}>Email</div>
            <div style={{fontSize:"20px"}}>Joined On</div>
            <div style={{fontSize:"20px"}}>Status</div>
            <div style={{fontSize:"20px"}}>Action</div>
        </TableHeader>

        {users.map((item)=>(
            <UserRow key={item._id}>
                <div style={{fontSize:"20px"}}>{item.name}</div>
                <div style={{fontSize:"20px"}}>{item.email}</div>
                <div style={{fontSize:"20px"}}>{new Date(item.createdAt).toLocaleDateString()}</div>
                <div style={{fontSize:"20px"}}>{item.isBlocked ? "Blocked":"Active"}</div>

                {item.isBlocked ?(
                    <UnblockButton 
                    onClick={()=>handleToggleUserStatus(item._id,item.isBlocked)}>
                        Unblock
                    </UnblockButton>
                    
                ):(
                    <BlockButton 
                    onClick={()=>handleToggleUserStatus(item._id,item.isBlocked)}>
                        Block
                    </BlockButton>
                )}
            </UserRow>
        ))}
    </UserList>

    <PaginationContainer>

            <PaginationButton
             disabled={page===1}
             onClick={()=>
                setPage(page-1)
             }
             >
                Previous
             </PaginationButton>

             <span>
                Page {page} of {totalPages}
             </span>

             <PaginationButton
              disabled={
                page === totalPages
              }
              onClick={()=>
                setPage(page +1)
              }
              >
                Next
              </PaginationButton>

        </PaginationContainer>
</Container>
  );
}