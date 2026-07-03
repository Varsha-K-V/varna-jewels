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
background-color:#f7f9fc;
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
padding-bottom:35px;



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

const Textarea = styled.textarea`
width:300px;
min-height:100px;
padding:10px 10px;
border-radius:5px;
border: none;
outline: none;
resize:none;
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
export default function Register(){

    const router = useRouter();

    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[address,setAddress]=useState("");
    const[phone,setPhone]=useState("");
    const[pin,setPin]=useState("");
    const[password,setPassword]=useState("");
    const[confirmPass,setConfirmPass]=useState("");

    const handleRegister = async ()=>{
      try{

        if(!name || !email || !address || !phone || !pin || !password || !confirmPass ){
          alert("Please fill all fields");
          return;
        }

      if(password !== confirmPass){
        alert("password and confirm do not match");
        return;
      }


      const res = await fetch("/api/auth/register",{
        method:"POST",

        headers:{
          "Content-Type":"application/json",
        },

       body: JSON.stringify({
        name,
        email,
        address,
        phone,
        pin,
        password,
      }),

      });

      const data = await res.json();
      alert(data.message);

      if(res.ok){
        router.push("/login")
      }

      console.log(data);

      }catch(error){
        console.log(error);
      }
    }


    return(
      <>
      <GlobalStyle/>
      <div style={{display:"flex",justifyContent:"center"}}>
          

        <Container>
            <Header>Register Here</Header>
            <InputBox>

            <Input
            type ="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}/>

            <Input
            type ="email"
            placeholder="EmailID"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}/>

            <Textarea rows={4} 
            placeholder="Full Address"
            value={address}
            onChange={(e)=>setAddress(e.target.value)}/>

            <Input
            type ="number"
            placeholder="Phone"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}/>

            <Input
            type ="number"
            placeholder="Pin"
            value={pin}
            onChange={(e)=>setPin(e.target.value)}/>

            <Input
            type ="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}/>

            <Input
            type ="password"
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={(e)=>setConfirmPass(e.target.value)}
            />

            <Button onClick={handleRegister}>Register</Button>
            </InputBox>
        </Container>
        </div>
      </>
        
 
        
    )

}