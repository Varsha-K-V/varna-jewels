"use client";

import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  padding: 30px;
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #fdf8ef 100%);
  border: 1px solid #ead7a4;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const Left = styled.div`
  max-width: 600px;
`;

const Icon = styled.div`
  width: 70px;
  height: 70px;
  background: #b8860b;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  margin-bottom: 25px;
`;

const Title = styled.h1`
  font-size: 42px;
  color: #222;
  margin-bottom: 18px;
`;

const Subtitle = styled.h2`
  font-size: 28px;
  color: #b8860b;
  font-weight: 600;
  margin-bottom: 18px;
`;

const Description = styled.p`
  font-size: 18px;
  color: #666;
  line-height: 1.8;
`;

const Right = styled.div`
  font-size: 180px;
  color: rgba(184, 134, 11, 0.08);
`;

export default function AdminHome() {
  return (
    <Container>
      <WelcomeCard>

        <Left>

          <Icon>
            <FontAwesomeIcon icon={faGem} />
          </Icon>

          <Title>
            Welcome Back, Admin!
          </Title>

          <Subtitle>
            Manage your jewellery store with ease.
          </Subtitle>

          <Description>
            Track orders, manage inventory, and grow your business.
          </Description>

        </Left>

        <Right>
          <FontAwesomeIcon icon={faGem} />
        </Right>

      </WelcomeCard>
    </Container>
  );
}