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
flex-direction:column;
align-items:center;
gap:15px;


background:white;
padding:40px;
border-radius:10px;
box-shadow:0px 2px 10px rgba(0,0,0,0.1);

width:500px;
margin:auto;
`;

const Input = styled.input`
padding:10px;
width:400px;
font-size:18px;
border-radius:5px;
border: 1px solid #ccc;
`;

const FileInput=styled.input`
padding:10px;
width:400px;
font-size:18px;
border-radius:5px;
border: 1px solid #ccc;
`;

const Textarea = styled.textarea`
padding:10px;
width:400px;
font-size:18px;
border-radius:5px;
border: 1px solid #ccc;
`;

const Button = styled.button`
margin-top:20px;
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

const Select = styled.select`
  width: 400px;
  padding: 12px;
  border-radius:5px;
  border: 1px solid #ccc;
  font-size: 18px;
`;



export default function AddProductPage(){
    const[name,setName]=useState("");
    const[description,setDescription]=useState("");
    const[price,setPrice]=useState("");
    const[stock,setStock]=useState("");

    type Category ={
        _id: string;
        name:string;
    };
    const[categories,setCategories]=useState<Category[]>([])
    const[category,setCategory]=useState("");
    const[image,setImage]=useState <File | null>(null);

    useEffect(()=>{
        fetchCategories();
    },[]);

    const fetchCategories = async ()=>{
        try{

            const res = await fetch("/api/admin/categories/get");

            const data = await res.json();

            setCategories(data);

        }catch(error){
            console.log(error);
        }
    }

    const handleAddProduct = async ()=>{
        try{
            if(!name || !description || !price || !stock || !category || !image){
                alert("Please fill all fields");
                return;
            }

            const formData = new FormData();

            formData.append("name",name);
            formData.append("description",description);
            formData.append("price",price.toString());
            formData.append("stock",stock.toString());
            formData.append("category",category);
            formData.append("image",image);

            const res = await fetch("/api/admin/products/add",{
                method:"POST",
                body:formData,
            });

            const data = await res.json();

            alert(data.message);

            if(res.ok){
                 setName("");
                 setDescription("");
                 setPrice("");
                 setStock("");
                 setCategory("");
                 setImage(null);
            }


        }catch(error){
            console.log(error);
        }
    }

    return(
       <Container>

        <Title>Add Product</Title>

        <Form>
            <Input
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />

            <Textarea
                placeholder="Enter description"
                rows={6}
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                />    

            <Input
                type="number"
                placeholder="Enter product price"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
                />    

            <Input
                type="number"
                placeholder="Enter product stock"
                value={stock}
                onChange={(e)=>setStock(e.target.value)}
                />   
            <Select
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
            >
                <option value="">
                    Select Category
                </option>

                {categories.map((item)=>(
                    <option 
                     key={item._id} 
                     value={item._id}>
                        {item.name}
                    </option>
                ))}
            </Select>     

            <FileInput
                type="file"
                accept="image/*"
                // value={image}
                onChange={(e)=>{
                    if(e.target.files?.[0]){
                        setImage(e.target.files[0]);
                    }
                }}
            />
               
                {image && (
                    <img
                     src ={URL.createObjectURL(image)}
                     alt="preview"
                     width="120"

                     style={{
                        borderRadius:"10px",
                        marginTop:"10px",
                     }}

                    />
                )}  
                
                


            <Button onClick={handleAddProduct}>Add Product</Button>

        </Form>
         

       </Container>
    )
}