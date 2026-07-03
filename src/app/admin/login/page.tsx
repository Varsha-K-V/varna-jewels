"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
body {
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.div`
margin-top:100px;
padding-top:50px;
display:flex;
flex-direction:column;
align-items:center;
background-color:#e3e5e8;
border-radius:10px;
box-shadow:0px 5px 10px rgba(0,0,0,0.2);
width:500px;

`;
const Header = styled.h1`
margin-bottom:10px;
`;

const InputBox = styled.div`
margin-top:20px;
display:flex;
flex-direction:column;
gap:10px;
padding-bottom:45px;



`;
const Input = styled.input`
width:300px;
height:30px;
padding:10px 10px;
border-radius:5px;
border: none;
outline: none;
 &:focus {
    border: 2px solid #333;  
  }
font-size:20px;
`;

const Button = styled.button`
color: white;
background-color: #3e3f40;
padding: 5px 10px;
width: 100px;
border-radius: 5px;
font-size: 15px;
border: none;
cursor: pointer;
transition: 0.3s;

&:hover {
    background-color: black;
    transform: scale(1.05);
}
`;


export default function AdminLogin(){

    const router = useRouter();

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleLogin = async ()=>{
        try{

            if(!email || !password){
                alert("Please fill all fields");
                return;
                }

            const res = await fetch("/api/admin/login",{
                method:"POST",

                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();

           if(res.ok){

             alert(data.message);
             console.log(data);
            //  router.push("/");

           }

        }catch(error){
            console.log(error);
        }
    };

    return(
        <>
        <GlobalStyle/>
        <div style={{display:"flex",justifyContent:"center"}}>

        <Container>
            <Header>Admin Login</Header>
            <InputBox>

            <Input
            type ="email"
            placeholder="EmailID"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}/>

            <Input
            type ="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}/>

            <Button onClick={handleLogin}>Login</Button>

            </InputBox>

        </Container>
        </div>
 
        </>
        
        
    )

}