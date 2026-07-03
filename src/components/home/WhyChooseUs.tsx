"use client";

import styled from "styled-components";

const Section = styled.section`
  padding: 100px 60px;
  background: #faf8f4;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 42px;
  margin-bottom: 20px;
  color: #272727;
`;

const Subtitle = styled.p`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 70px;

  color: #777;
  font-size: 18px;
  line-height: 1.8;
`;

const Grid = styled.div`
  max-width: 1200px;
  margin: auto;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  padding: 40px 30px;
  text-align: center;

  border-radius: 16px;

  transition: 0.3s;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.08);
  }
`;

const Icon = styled.div`
  font-size: 40px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  margin-bottom: 15px;
  color: #272727;
`;

const Description = styled.p`
  color: #777;
  line-height: 1.7;
`;
export default function WhyChooseUs() {
  return (
    <Section>
      <Title>Why Choose Varna Jewels</Title>

      <Subtitle>
        We combine timeless elegance, exceptional craftsmanship,
        and a seamless shopping experience to help you celebrate
        life's most precious moments.
      </Subtitle>

      <Grid>

        <Card>
          <Icon>💎</Icon>
          <CardTitle>Premium Craftsmanship</CardTitle>
          <Description>
            Expertly crafted jewelry designed with precision and care.
          </Description>
        </Card>

        <Card>
          <Icon>✨</Icon>
          <CardTitle>Timeless Designs</CardTitle>
          <Description>
            Elegant collections that remain beautiful through every trend.
          </Description>
        </Card>

        <Card>
          <Icon>🔒</Icon>
          <CardTitle>Secure Shopping</CardTitle>
          <Description>
            Safe payments and a trusted shopping experience.
          </Description>
        </Card>

        <Card>
          <Icon>🎁</Icon>
          <CardTitle>Elegant Packaging</CardTitle>
          <Description>
            Beautiful packaging perfect for gifting and special occasions.
          </Description>
        </Card>

      </Grid>
    </Section>
  );
}