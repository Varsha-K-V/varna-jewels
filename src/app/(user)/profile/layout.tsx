"use client";

import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Container = styled.div`
  max-width: 1400px;
  margin: 50px auto;
  display: flex;
  gap: 30px;
  padding: 0 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 280px;

  background: white;

  display: flex;
  flex-direction: column;

  padding: 25px;

  border-radius: 15px;

  box-shadow: 0 5px 20px rgba(0,0,0,.08);

   @media (max-width: 768px) {
    width: 100%;
  }
`;

const SidebarTitle = styled.h2`
  color: #272727;

  margin-bottom: 25px;

  font-size: 24px;

   @media (max-width: 768px) {
    text-align: center;
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  flex: 1;

    @media (max-width: 768px) {
    gap: 10px;
  }
`;

const MenuItem = styled.div`
  padding: 12px 15px;

  border-radius: 10px;

  cursor: pointer;

  transition: .3s;

  &:hover {
    background: #f5f5f5;
    color: #d4af37;
  }
`;

const MenuLink = styled(Link) <{
    $active: boolean;
}>`
  padding: 12px 15px;

  border-radius: 10px;

  text-decoration: none;

  color: ${({ $active }) =>
        $active ? "#fff" : "#272727"};

  background: ${({ $active }) =>
        $active ? "#D4AF37" : "transparent"};

  transition: .3s;

  &:hover {
    background: ${({ $active }) =>
        $active ? "#D4AF37" : "#f5f5f5"};

    color: ${({ $active }) =>
        $active ? "#fff" : "#D4AF37"};
  }
`;

const Content = styled.div`
  flex: 1;

  background: white;

  padding: 30px;

  border-radius: 15px;

  box-shadow: 0 5px 20px rgba(0,0,0,.08);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const LogoutButton = styled.button`
  width: 100%;

  margin-top: 30px;
  padding: 12px 15px;

  border: none;
  border-radius: 10px;

  background: #f8f8f8;
  color: #e53935;

  font-size: 15px;
  font-weight: 500;

  cursor: pointer;

  transition: 0.3s;

  &:hover {
    background: #e53935;
    color: white;
  }
`;

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const [user, setUser] = useState<any>(null);

    const pathname = usePathname();

    const router = useRouter();

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
        // setShowDropdown(false);
        router.push("/");
        router.refresh();
      }

    } catch (error) {
      console.log(error);
    }
  }
    return (
        <Container>
            <Sidebar>

                <SidebarTitle>
                    My Account
                </SidebarTitle>

                <Menu>

                    <MenuLink href="/profile"
                        $active={pathname === "/profile"}
                    >
                        👤 Profile
                    </MenuLink>

                    <MenuLink href="/profile/addresses"
                        $active={pathname === "/profile/addresses"}
                    >
                        📍 Address Book
                    </MenuLink>

                    {/* <MenuLink href="/profile/wishlist"
                        $active={pathname === "/profile/wishlist"}
                    >
                        ❤️ Wishlist
                    </MenuLink> */}

                    <MenuLink href="/my-orders"
                        $active={pathname === "/my-orders"}
                    >
                        📦 Orders
                    </MenuLink>

                     <MenuLink href="/wallet"
                        $active={pathname === "/wallet"}
                    >
                       💰 My Wallet
                    </MenuLink>

                    <MenuLink href="/profile/password"
                        $active={pathname === "/profile/password"}
                    >
                        🔒 Change Password
                    </MenuLink>

                </Menu>


                <LogoutButton onClick={handleLogout}>
                        🚪 Logout
                </LogoutButton>

            </Sidebar>

            <Content>
                {children}
            </Content>
        </Container>
    );
}