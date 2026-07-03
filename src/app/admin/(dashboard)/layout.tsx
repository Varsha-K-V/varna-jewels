"use client";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import Link from "next/link";

const GlobalStyle = createGlobalStyle`
body{
margin:0;
padding:0;
}
`;

const Sidebar = styled.div`
width:250px;
background-color:#1f2937;
color:white;
padding:20px;
`;

const Header = styled.div`
height:70px;
background-color:white;
display:flex;
align-items:center;
justify-content:space-between;
// padding-left:500px;
padding:0 30px;
box-shadow:0px 2px 5px rgba(0,0,0,0.1);

`;

const Logo = styled.h1`
text-align: center;
// margin-top:20px;
margin-bottom: 40px;
`;

const NavLinks = styled.div`
display:flex;
flex-direction:column;
margin-top:100px;
gap:20px;
`;

const StyledLink = styled(Link)`
color:white;
text-decoration:none;
font-size:24px;
transition:0.3s;
// text-align:center;
margin-left:50px;

&:hover{
color:#d1d5db;
padding-left:5px;
}
`;

const ContentSection = styled.div`
flex:1;
background-color: #f3f4f6;
`;

const Profile= styled.div`
width:40px;
height:40px;
border-radius:50%;
background-color:#d1d5db;
// margin-left:500px;
`;

const PageContent = styled.div`
padding:30px;
`;

const AdminText = styled.h1`
// text-align: center;
// margin:0;
`;

export default function AdminLayout({
    children,
}:{
    children:React.ReactNode;
}
) {
    return (
        <>
        <GlobalStyle/>
         <div style={{display:"flex",minHeight:"100vh"}}>
            <Sidebar>
                <Logo>Varna Admin</Logo>

                <NavLinks>
                     <StyledLink href="/admin">Dashboard</StyledLink>
                     <StyledLink href="/admin/products">Products</StyledLink>
                     <StyledLink href="/admin/categories">Categories</StyledLink>
                     <StyledLink href="/admin/orders">Orders</StyledLink>
                     <StyledLink href="/admin/users">Users</StyledLink>
                </NavLinks>

            </Sidebar>

            <ContentSection>
                 <Header>
                    <AdminText>Admin Dashboard</AdminText>
                    <Profile />
                 </Header>
                  <PageContent>{children}</PageContent>

            </ContentSection>
           
        </div>
        </>
       
    );

}