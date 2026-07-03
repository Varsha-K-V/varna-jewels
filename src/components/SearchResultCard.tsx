"use client";

import styled from "styled-components";
import { useRouter } from "next/navigation";

type SearchResultCardProps = {
    productId: string;
    name: string;
    price: number;
    image: string;
    onClose: () => void;
};

const Card = styled.div`
display:flex;

align-items:center;

gap:20px;

padding:15px;

border-radius:12px;

cursor:pointer;

transition:.3s;

&:hover{
    background:#f8f8f8;
}
`;

const ProductImage = styled.img`
width:90px;
height:90px;

object-fit:cover;

border-radius:10px;
`;

const ProductInfo = styled.div`
flex:1;
`;

const ProductName = styled.h3`
font-size:18px;

color:#272727;

margin-bottom:10px;
`;

const ProductPrice = styled.p`
font-size:18px;

font-weight:600;

color:#D4AF37;
`;

const Divider = styled.div`
height:1px;

background:#eee;
`;

export default function SearchResultCard({
    productId,
    name,
    price,
    image,
    onClose,
}: SearchResultCardProps) {

    const router = useRouter();

    return (
        <>
            <Card
                onClick={() => {
                    onClose();
                    router.push(`/product/${productId}`);
                }}
            >

                <ProductImage
                    src={image}
                    alt={name}
                />

                <ProductInfo>

                    <ProductName>
                        {name}
                    </ProductName>

                    <ProductPrice>
                        ₹{price}
                    </ProductPrice>

                </ProductInfo>

            </Card>

            <Divider />

        </>
    );
}