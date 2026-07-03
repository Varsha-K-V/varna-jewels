"use client";


import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import AuthModal from "./AuthModal";
import SearchModal from "./SearchModal";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faHeart,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";

import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 90px;
  background: #272727;
  padding: 0 60px;

  border-bottom: 1px solid #222;

  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`;

const Logo = styled.div`
img{
    width:180px;
    height:auto;
}

@media(max-width:768px){
    img{
        width:130px;
    }
}
`;

// const Logo = styled.div`
//   flex: 1;

//   display: flex;
//   align-items: center;

//   cursor: pointer;
// `;

// const NavCenter = styled.div`
// flex:2;

// display:flex;
// justify-content:center;
// gap:40px;
// `;

const NavCenter = styled.div`
display:flex;
gap:40px;

@media(max-width:768px){
    display:none;
}
`;

const NavLink = styled(Link)`
color:white;
text-decoration:none;

font-size:18px;
font-weight:500;
letter-spacing:1px;

transition:0.3s;

&:hover{
color:#d4af37;
}
`;

const RightSection = styled.div`
// flex:1;

display:flex;
// justify-content: flex-end;
align-items:center;
gap:25px;

@media(max-width:768px){
    display:none;
}
`;


const IconWrapper = styled.div`
position:relative;

color:white;
font-size:22px;

cursor:pointer;

transition:0.3s;

&:hover{
color:gold;
}
`;

const Badge = styled.span`
position:absolute;

top:-10px;
right:-12px;

width:18px;
height:18px;

border-radius:50%;

background:gold;
color:black;

font-size:11px;
font-weight:bold;

display:flex;
align-items:center;
justify-content:center;
`;

const LogoutButton = styled.button`
  background: transparent;
  color: white;

  border: 1px solid #d4af37;
  border-radius: 25px;

  padding: 8px 18px;
  margin-left:25px;


  font-size: 14px;
  font-weight: 500;

  cursor: pointer;

  transition: all 0.3s ease;

  &:hover {
    background: #d4af37;
    color: #272727;
    transform: translateY(-2px);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0,0,0,0.6);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 999;
`;

const Modal = styled.div`
  width: 450px;
  background: white;

  border-radius: 12px;
  padding: 30px;

  position: relative;
`;

const UserIcon = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  font-size: 22px;

  cursor: pointer;

  transition: all 0.3s ease;

  &:hover {
    color: #d4af37;
    transform: translateY(-2px);
  }
`;

const ProfileWrapper = styled.div`
  position: relative;
`;

const UserDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  color: white;

  cursor: pointer;

  transition: 0.3s;

  &:hover {
    color: #d4af37;
  }
`;

const Dropdown = styled.div`
  position: absolute;

  top: 45px;
  right: 0;

  width: 180px;

  background: white;

  border-radius: 8px;

  box-shadow: 0 5px 20px rgba(0,0,0,0.15);

  overflow: hidden;

  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 12px 16px;

  cursor: pointer;

  color: #272727;

  transition: 0.3s;

  &:hover {
    background: #f5f5f5;
    color: #d4af37;
  }
`;

const IconButton = styled.div`
position:relative;

color:white;
font-size:22px;

cursor:pointer;

transition:0.3s;

&:hover{
color:gold;
}

`;

const MenuButton = styled.div`
display:none;

font-size:24px;
cursor:pointer;
color:white;

@media(max-width:768px){
    display:block;
}
`;

const MobileMenu = styled.div`
display:none;

@media(max-width:768px){

display:flex;

flex-direction:column;

position:absolute;

top:100%;

left:0;

width:100%;

background:#272727;

padding:20px;

z-index:1000;

gap:20px;

}
`;

const MobileLink = styled(Link)`
color:white;

text-decoration:none;

font-size:18px;

&:hover{
color:gold;
}
`;

const MobileIcons = styled.div`
display:flex;
flex-direction:column;
gap:20px;

margin-top:20px;

padding-top:20px;

border-top:1px solid rgba(255,255,255,.2);
`;

const MobileIconWrapper = styled.div`
display:flex;
align-items:center;
gap:15px;

color:white;

font-size:18px;

cursor:pointer;

&:hover{
    color:gold;
}
`;



export default function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const { wishlistIds } = useWishlist();
  const { cartCount } = useCart();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);





  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");

      if (!res.ok) return;

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;
    try {

      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })

      const data = await res.json();

      alert(data.message);

      if (res.ok) {

        setUser(null);
        setShowDropdown(false);
        router.push("/");
        router.refresh();
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleWishlistClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    router.push("/wishlist");
  }

  const handleCartClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    router.push("/cart");
  }

  return (
    <>
      <Container>

        <Logo>
          <Image
            src="/new-logo.png"
            alt="Varna Jewels"
            width={180}
            height={70}
            priority
          />
        </Logo>

        <NavCenter>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/shop">Shop</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </NavCenter>

        <MenuButton
          onClick={() =>
            setShowMobileMenu(!showMobileMenu)
          }
        >
          <FontAwesomeIcon icon={faBars} />
        </MenuButton>

        <RightSection>

          <IconButton
            onClick={() => setShowSearchModal(true)}
          >
            <FontAwesomeIcon icon={faSearch} />
          </IconButton>

          {user ? (
            <ProfileWrapper ref={profileRef}>

              <UserDisplay
                onClick={() =>
                  setShowDropdown(!showDropdown)
                }>

                <FontAwesomeIcon icon={faUser} />

                <span>{user.name.split(" ")[0]}</span>

                <span>▼</span>
              </UserDisplay>

              {showDropdown && (
                <Dropdown>

                  <DropdownItem
                    onClick={() =>
                      router.push("/profile")
                    }>
                    My Profile
                  </DropdownItem>

                  <DropdownItem
                    onClick={() =>
                      router.push("/my-orders")
                    }>
                    My Orders
                  </DropdownItem>

                  <DropdownItem
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownItem>

                </Dropdown>
              )}

            </ProfileWrapper>

          ) : (
            <UserIcon
              onClick={() => setShowAuthModal(true)}
            >
              <FontAwesomeIcon icon={faUser} />
            </UserIcon>

          )}

          <IconWrapper onClick={handleWishlistClick}>
            <FontAwesomeIcon icon={faHeart} />
            {
              wishlistIds.length > 0 && (
                <Badge>
                  {wishlistIds.length}
                </Badge>
              )
            }
          </IconWrapper>

          <IconWrapper onClick={handleCartClick}>
            <FontAwesomeIcon icon={faCartShopping} />
            {cartCount > 0 && (
              <Badge>
                {cartCount}
              </Badge>
            )}
          </IconWrapper>

        </RightSection>

        {
          showMobileMenu && (

            <MobileMenu>

              <MobileLink href="/">
                Home
              </MobileLink>

              <MobileLink href="/shop">
                Shop
              </MobileLink>

              <MobileLink href="/about">
                About
              </MobileLink>

              <MobileLink href="/contact">
                Contact
              </MobileLink>

              <MobileIcons>

                <MobileIconWrapper
                  onClick={() => {
                    setShowSearchModal(true);
                    setShowMobileMenu(false);
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                  Search
                </MobileIconWrapper>

                {user ? (
                  <MobileIconWrapper
                    onClick={() => {
                      router.push("/profile");
                      setShowMobileMenu(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    {user.name.split(" ")[0]}
                  </MobileIconWrapper>
                ) : (
                  <MobileIconWrapper
                    onClick={() => {
                      setShowAuthModal(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    Login
                  </MobileIconWrapper>
                )}

                <MobileIconWrapper
                  onClick={() => {
                    handleWishlistClick();
                    setShowAuthModal(false);
                  }}
                >
                  <FontAwesomeIcon icon={faHeart} />
                  Wishlist
                </MobileIconWrapper>

                <MobileIconWrapper
                  onClick={() => {
                    handleCartClick();
                    setShowMobileMenu(false);
                  }}
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                  Cart
                </MobileIconWrapper>

                {user ? (
                  <>
                    <MobileIconWrapper
                      onClick={() => {
                        router.push("/profile");
                        setShowMobileMenu(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faUser} />
                      My Profile
                    </MobileIconWrapper>

                    <MobileIconWrapper
                      onClick={() => {
                        router.push("/my-orders");
                        setShowMobileMenu(false);
                      }}
                    >
                      📦 My Orders
                    </MobileIconWrapper>

                    <MobileIconWrapper
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </MobileIconWrapper>
                  </>
                ) : (
                  <MobileIconWrapper
                    onClick={() => {
                      setShowAuthModal(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    Login
                  </MobileIconWrapper>
                )}

              </MobileIcons>

            </MobileMenu>

          )
        }

      </Container>


      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={() => {
            fetchUser();
            setShowAuthModal(false)
          }}
        />
      )}

      {showSearchModal && (
        <SearchModal
          onClose={() =>
            setShowSearchModal(false)
          }
        />
      )}

    </>
  )
}
