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

const Form = styled.div`
display:flex;
justify-content:center;
gap:10px;
margin-bottom; 30px;
`;

const Input = styled.input`
padding:10px;
width:300px;
font-size:18px;
border-radius:5px;
border: 1px solid #ccc;
`;

const Button = styled.button`
padding:10px 20px;
font-size:18px;
border:none;
background-color:black;
color:white;
border-radius:5px;
cursor:pointer;

&:hover{
 background:#333;
}
`;

const CategoryList = styled.div`
margin-top:30px;
display:flex;
flex-direction:column;
gap:15px;
`;

const CategoryCard = styled.div`
background-color:white;
padding: 15px 20px;
border-radius:10px;
display:flex;
justify-content:space-between;
align-items:center;

box-shadow:0px 2px 5px rgba(0,0,0,0.1);
`;

const CategoryName = styled.h3`
margin:0;
font-size:20px;
`;

const ButtonGroup = styled.div`
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


export default function CategoriesPage(){

    const[category,setCategory] = useState("");
    type Category = {
        _id:string;
        name:string;
    }
    const[categories,setCategories] = useState<Category[]>([]);
    const [editId,setEditId]= useState("");
    const [isEditing,setIsEditing] = useState(false);

    useEffect(()=>{
        fetchCategories();
    },[]);

    const handleAddCategory = async ()=>{
        try{

            if(!category){
                alert("Please enter category name");
                return;
            }

            const res = await fetch("/api/admin/categories/add",{
                method :"POST",

                headers:{
                    "Content-Type": "application/json",
                },

                body:JSON.stringify({
                    name:category,
                }),

            });

            const data = await res.json();

            alert(data.message);

            if(res.ok){
                setCategory("");

                fetchCategories();
            }

        }catch(error){
            console.log(error);
        }
    }

    const fetchCategories = async () =>{

        try{

            const res = await fetch("/api/admin/categories/get")

            const data = await res.json();

            setCategories(data);

        }catch(error){
            console.log(error);
        }
    }

    const handleDeleteCategory = async (id:string)=>{

        try{

            const res = await fetch("/api/admin/categories/delete",{
                method:"DELETE",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify({id}),
            });

            const data = await res.json();

            alert(data.message)

            if(res.ok){
                fetchCategories();
            }

        }catch(error){
            console.log(error);
        }
    }

    const handleEdit = (
        id:string,
        name:string
    )=>{
        setCategory(name);
        setEditId(id);
        setIsEditing(true);
    };

    const handleUpdateCategory = async () =>{
        try{

            const res = await fetch(`/api/admin/categories/edit/${editId}`,
                {
                    method:"PUT",
                    headers:{
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        name:category,
                    }),
                }
            );

            const data = await res.json();

            alert(data.message);

            if(res.ok){

                fetchCategories();
                setCategory("");
                setEditId("");
                setIsEditing(false);
            }

        }catch(error){
            console.log(error);

        }
    };
    
    return (
        <Container>

            <Title>Category Management</Title>

            <Form>
                <Input
                type="text"
                placeholder="Enter category name"
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
                
                />

                <Button onClick={
                    isEditing ? handleUpdateCategory : handleAddCategory}>
                        {isEditing ? "Update Category" : "Add category"}
                    </Button>
            </Form>

            <CategoryList>
                 {categories.map((item:Category)=>(
                <CategoryCard key ={item._id}>
                    <CategoryName>{item.name}</CategoryName>

                    <ButtonGroup>
                    <EditButton onClick={()=>handleEdit(item._id,item.name)}>
                        Edit
                    </EditButton>

                    <DeleteButton onClick={()=>handleDeleteCategory(item._id)}>
                        Delete
                    </DeleteButton>

                    </ButtonGroup>

                   
                </CategoryCard>
               ))}

            </CategoryList>

        </Container>
    );
}