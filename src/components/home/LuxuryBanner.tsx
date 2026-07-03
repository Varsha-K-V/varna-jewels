"use client";

import styled from "styled-components";

const BannerSection = styled.section`
  margin: 100px auto;
  max-width: 1400px;
  height: 500px;

  background-image: linear-gradient(
      rgba(0,0,0,.35),
      rgba(0,0,0,.35)
    ),
    url("/LuxuaryBanner.jpg");

  background-size: cover;
  background-position: center;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 20px;
`;

const Content = styled.div`
  text-align: center;
  color: white;
`;

const Title = styled.h2`
  font-size: 56px;
  font-family: "Cormorant Garamond", serif;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  line-height: 1.8;
  max-width: 600px;
  color: rgba(255,255,255,.9);
  margin: auto;
`;

const Button = styled.button`
  margin-top: 40px;
  padding: 15px 40px;

  border: none;
  border-radius: 50px;

  background: #d4af37;
  color: white;

  font-size: 16px;
  cursor: pointer;

  transition: .3s;

  &:hover {
    background: #b9962d;
  }
`;

export default function LuxuryBanner(){
    return(
        <>
        <BannerSection>
            <Content>
                <Title>
                    Celebrate Every Moment
                </Title>

                <Subtitle>
                    Discover timeless jewelry crafted with elegance and designed for life's most cherished occasions.
                </Subtitle>

                <Button>Explore Collection</Button>
            </Content>

        </BannerSection>
        </>
    )
}