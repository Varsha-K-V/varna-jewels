"use client";

import styled from "styled-components";
import Link from "next/link";

const FooterContainer = styled.footer`
  background: #272727;
  color: white;

  padding: 60px 80px 30px;
  margin-top: 80px;

  border-top: 1px solid #3a3a3a;

   @media (max-width: 768px) {
    padding: 50px 25px 25px;
  }

  @media (max-width: 480px) {
    padding: 40px 20px 20px;
  }
`;

const TopSection = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const BrandName = styled.h2`
  color: #d4af37;
  font-size: 32px;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 26px;
  }
`;

const Tagline = styled.p`
  color: #ccc;
  font-size: 16px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Heading = styled.h3`
  color: #d4af37;
  margin-bottom: 10px;

    @media (max-width: 576px) {
    margin-top: 10px;
  }
`;

const FooterLink = styled(Link)`
  color: white;
  text-decoration: none;

  &:hover {
    color: #d4af37;
  }
`;

const SocialSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;

  margin-top: 50px;

    @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 15px;
  }
`;

const SocialText = styled.span`
  cursor: pointer;

  &:hover {
    color: #d4af37;
  }

    @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Copyright = styled.div`
  text-align: center;

  margin-top: 40px;
  padding-top: 20px;

  border-top: 1px solid #3a3a3a;

  color: #999;

   @media (max-width: 480px) {
    font-size: 13px;
    line-height: 1.6;
  }
`;

export default function Footer() {
  return (
    <FooterContainer>

      <TopSection>
        <BrandName>VARNA JEWELS</BrandName>

        <Tagline>
          Elegance Crafted For Every Occasion
        </Tagline>
      </TopSection>

      <Grid>

        <Column>
          <Heading>Quick Links</Heading>

          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/shop">Shop</FooterLink>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </Column>

        <Column>
          <Heading>Customer Service</Heading>

          <FooterLink href="/profile">
            My Account
          </FooterLink>

          <FooterLink href="/wishlist">
            Wishlist
          </FooterLink>

          <FooterLink href="/cart">
            Cart
          </FooterLink>

          <FooterLink href="/orders">
            Orders
          </FooterLink>
        </Column>

        <Column>
          <Heading>Contact Us</Heading>

          <p>📍 Kerala, India</p>
          <p>📞 +91 XXXXX XXXXX</p>
          <p>✉️ info@varnajewels.com</p>
        </Column>

      </Grid>

      <SocialSection>
        <SocialText>Instagram</SocialText>
        <SocialText>Facebook</SocialText>
        <SocialText>WhatsApp</SocialText>
      </SocialSection>

      <Copyright>
        © 2026 Varna Jewels. All Rights Reserved.
      </Copyright>

    </FooterContainer>
  );
}