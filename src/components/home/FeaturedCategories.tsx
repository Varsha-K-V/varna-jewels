"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Section = styled.section`
  padding: 50px 60px;
  background: #fff;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 42px;
  color: #272727;
  margin-bottom: 50px;
`;

const CategoriesGrid = styled.div`
  display:grid;

  grid-template-columns: repeat(auto-fit,minmax(280px,1fr));

  gap:30px;

  max-width:1200px;

  margin:auto;
`;

const Card = styled.div`
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;

  box-shadow: 0 5px 20px rgba(0,0,0,.1);

  transition:.3s;

  &:hover{
    transform:translateY(-10px);
  }
`;

const CategoryImage = styled.img`
  width:100%;
  height:300px;

  object-fit:cover;
`;

const CategoryName = styled.h3`
  padding:20px;

  text-align:center;

  color:#272727;

  font-size:22px;
`;

export default function FeaturedCategories() {

    const categoryImages: any = {
        Bangles: "/categories/bangle.jpg",
        Anklets: "/categories/Anklets.webp",
        "Ear Rings": "/categories/Earrings.webp",
        "Neck Pieces": "/categories/neck-pieces.avif",
        Rings: "/categories/rings.jpg",
    };
    type Category = {
        _id: string;
        name: string;
    };

    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();



    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {

        try {

            const response = await fetch(
                "/api/user/category"
            );

            const data = await response.json();

            if (data.success) {
                setCategories(data.categories);
            }

        } catch (error) {
            console.log(error);
        }

    };

    return (
        <Section>

            <Title>
                Shop By Category
            </Title>

            <CategoriesGrid>

                {
                    categories.map((category: any) => (
                        <Card key={category._id}
                            onClick={() =>
                                router.push(`/shop?category=${category._id}`)
                            }
                        >

                            <CategoryImage
                                src={categoryImages[
                                    category.name
                                ] ||
                                    "/categories/default.jpg"}
                                alt={category.name}
                                loading="lazy"
                            />

                            <CategoryName>
                                {category.name}
                            </CategoryName>

                        </Card>
                    ))
                }

            </CategoriesGrid>

        </Section>
    )
}