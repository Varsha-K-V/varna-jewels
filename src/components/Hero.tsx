"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const HeroContainer = styled.section`
  position: relative;
  width: 100%;
  height: 85vh;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 70vh;
  }

  @media (max-width: 480px) {
    height: 60vh;
  }
`;
const HeroImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 100%;

  background-image: url(${(props) => props.$image});
  background-size: cover;
  background-position: center;

  transition: all 0.8s ease-in-out;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;

  background: rgba(0, 0, 0, 0.45);

  display: flex;
  align-items: center;

   z-index: 2;
`;

const Content = styled.div`
  margin-left: 100px;
  color: white;
  max-width: 600px;

  @media (max-width: 1024px) {
    margin-left: 60px;
    max-width: 500px;
  }

  @media (max-width: 768px) {
    margin-left: 30px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    margin-left: 20px;
    max-width: 100%;
    padding-right: 20px;
  }
`;

const Brand = styled.p`
  color: #d4af37;
  letter-spacing: 4px;
  font-size: 18px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    font-size: 14px;
    letter-spacing: 2px;
  }
`;

const Heading = styled.h1`
  font-size: 64px;
  line-height: 1.2;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    font-size: 48px;
  }

  @media (max-width: 768px) {
    font-size: 36px;
  }

  @media (max-width: 480px) {
    font-size: 26px;
  }
`;

const Description = styled.p`
  font-size: 20px;
  color: #e5e5e5;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 20px;
  }
`;


const Button = styled.button`
  padding: 15px 35px;
  background: #d4af37;
  color: #272727;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #c49a2c;
  }

  @media (max-width: 480px) {
    padding: 12px 25px;
    font-size: 15px;
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;

  transform: translateX(-50%);

  display: flex;
  gap: 12px;

  z-index: 3;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 12px;
  height: 12px;

  border-radius: 50%;
  border: none;

  cursor: pointer;

  background: ${(props) =>
    props.$active ? "#D4AF37" : "rgba(255,255,255,0.6)"};

  transition: 0.3s;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;

  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #D4AF37;
    color: #272727;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const LeftArrow = styled(ArrowButton)`
  left: 20px;
`;

const RightArrow = styled(ArrowButton)`
  right: 20px;
`;
export default function Hero() {

    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
  {
    image: "/hero1.webp",
    brand: "VARNA JEWELS",
    title: "Timeless Beauty,\nCrafted For Every Occasion",
    description:
      "Discover elegant jewellery collections designed to celebrate life's precious moments.",
  },
  {
    image: "/hero2.png",
    brand: "NEW ARRIVALS",
    title: "Luxury That Speaks\nWithout Words",
    description:
      "Exclusive designs for women who appreciate luxury and sophistication.",
  },
];

const router = useRouter();
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  }, 5000);

  return () => clearInterval(interval);
}, []);

const nextSlide = () => {
  setCurrentSlide((prev) =>
    prev === slides.length - 1 ? 0 : prev + 1
  );
};

const prevSlide = () => {
  setCurrentSlide((prev) =>
    prev === 0 ? slides.length - 1 : prev - 1
  );
};
  return (
    <HeroContainer>
       
     <HeroImage $image={slides[currentSlide].image} />

      <Overlay>

        <Content>
            <Brand>{slides[currentSlide].brand}</Brand>

           <Heading>
              {slides[currentSlide].title
               .split("\n")
               .map((line, index) => (
              <div key={index}>{line}</div>
              ))}
           </Heading>

            <Description>
              {slides[currentSlide].description}
            </Description>

            <Button onClick={()=>router.push("/shop")}>Shop Collection</Button>

        </Content>

      </Overlay>

       <LeftArrow onClick={prevSlide}>
          ❮
        </LeftArrow>

       <RightArrow onClick={nextSlide}>
          ❯
       </RightArrow>
       
      <DotsContainer>
        {slides.map((_, index) => (
       <Dot
          key={index}
          $active={index === currentSlide}
          onClick={() => setCurrentSlide(index)}
        />
        ))}
       </DotsContainer>
    </HeroContainer>
  );
}