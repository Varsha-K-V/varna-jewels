"use client";
import styled from "styled-components";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

const Container = styled.div`
padding:20px;
`;

const Title = styled.h1`
margin-top:20px;
margin-bottom:40px;
text-align:center;
`;

const ProductList = styled.div`
  display:flex;
  flex-direction:column;
  gap:15px;
`;

const TableHeader = styled.div`
  display:grid;

  grid-template-columns:
    100px
    2fr
    1fr
    1fr
    1fr
    180px;

    padding:15px;

  background:black;

  color:white;

  border-radius:8px;

  font-weight:bold;

  align-items:center;
`;

const ProductRow = styled.div`
  display:grid;

  grid-template-columns:
    100px
    2fr
    1fr
    1fr
    1fr
    180px;

  padding:15px;

  background:white;

  border-radius:8px;

  align-items:center;

  box-shadow:
    0px 2px 8px rgba(0,0,0,0.1);
`;

const ProductImage = styled.img`
  width:70px;
  height:70px;

  object-fit:cover;

  border-radius:8px;
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

const DeleteButton = styled.button`
padding:8px 15px;
border:none;
background-color:#dc2626;
color:white;
border-radius:5px;
cursor:pointer;
font-size:18px;

&:hover{
 background:#e05e72;
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

export default function Products(){

    type Product ={
        _id:string;
        name:string;
        description:string;
        price:number;
        stock:number;
        image:string;

        category?:{
            _id:string;
            name:string;
        };
    };

    const [products,setProducts] = useState<Product[]>([]);
    const [page,setPage] = useState(1);
    const [totalPages,setTotalPages]=useState(1);
    const router = useRouter();

    useEffect(()=>{
        fetchProducts();
    },[page]);

    const fetchProducts = async ()=>{
        try{

            const res = await fetch(`/api/admin/products/get?page=${page}`);

            const data = await res.json();

            setProducts(data.products);
            setTotalPages(data.totalPages);
            

        }catch(error){
            console.log(error);
        }
    }

    const handleDeleteProduct = async (id:string)=>{

        try{

            const confirmDelete = confirm("Are you sure?");

            if(!confirmDelete) return;

            const res = await fetch("/api/admin/products/delete",{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    id,
                }),
            })

            const data = await res.json();

            alert(data.message);

            if(res.ok){
                fetchProducts();
            }

        }catch(error){
            console.log(error);
        }

    }
    return(

        <Container>

             <Title>Product Management</Title>

        <ProductList>
            <TableHeader>
                <div style={{fontSize:"20px"}}>Image</div>
                <div style={{fontSize:"20px"}}>Name</div>
                <div style={{fontSize:"20px"}}>Price</div>
                <div style={{fontSize:"20px"}}>Stock</div>
                <div style={{fontSize:"20px"}}>Category</div>
                <div style={{fontSize:"20px"}}>Actions</div>
            </TableHeader>

            {products.map((item)=>(
                <ProductRow key={item._id}>
                    <ProductImage
                    src={item.image}
                    alt={item.name}
                    />

                    <div style={{fontSize:"20px"}}>{item.name}</div>
                    <div style={{fontSize:"20px"}}> ₹{item.price}</div>
                    <div style={{fontSize:"20px"}}>{item.stock}</div>
                    <div style={{fontSize:"20px"}}>{item.category?.name}</div>

                    <ActionButtons>
                        <EditButton onClick={()=>router.push(`/admin/products/edit/${item._id}`)}>Edit</EditButton>
                        <DeleteButton onClick={()=>handleDeleteProduct(item._id)}>Delete</DeleteButton>
                    </ActionButtons>

                </ProductRow>
            ))}
        </ProductList>

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
    )
}