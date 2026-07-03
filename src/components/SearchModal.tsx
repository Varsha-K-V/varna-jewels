"use client";

import styled from "styled-components";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchResultCard from "./SearchResultCard";

const Overlay = styled.div`
position:fixed;
top:0;
left:0;

width:100%;
height:100%;

background:rgba(0,0,0,.5);

z-index:9999;
`;

const Container = styled.div`
background:white;

padding:50px;

width:100%;

position:absolute;
top:0;
left:0;
`;

const CloseButton = styled.button`
position:absolute;

top:20px;
right:30px;

border:none;

background:none;

font-size:28px;

cursor:pointer;
`;

const Title = styled.h2`
text-align:center;

margin-bottom:40px;

color:#272727;

font-size:32px;
`;

const SearchContainer = styled.div`
display:flex;
align-items:center;

width:70%;

margin:auto;

border:1px solid #ddd;

border-radius:50px;

overflow:hidden;
`;

const SearchInput = styled.input`
flex:1;

padding:18px 25px;

border:none;

outline:none;

font-size:18px;
`;

const SearchButton = styled.button`
padding:18px 25px;

border:none;

background:white;

cursor:pointer;

font-size:20px;
`;

const QuickSearchTitle = styled.h3`
margin-top:40px;

text-align:center;

color:#444;
`;

const CategoryLinks = styled.div`
display:flex;

justify-content:center;

gap:35px;

margin-top:25px;

flex-wrap:wrap;
`;

const CategoryLink = styled.div`
font-size:18px;

cursor:pointer;

color:#555;

transition:.3s;

&:hover{
    color:gold;
}
`;

const ResultsContainer = styled.div`
margin-top:40px;

max-width:900px;

margin-left:auto;
margin-right:auto;
`;

const NoResults = styled.p`
  margin-top: 40px;

  text-align: center;

  color: gray;

  font-size: 18px;
`;
type SearchModalProps = {
    onClose: () => void;
}

export default function SearchModal(props: SearchModalProps) {
    const onClose = props.onClose;

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);

    const router = useRouter();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (search.trim()) {
            searchProducts();
        } else {
            setProducts([]);
        }
    }, [search]);

    const fetchCategories = async () => {
        try {

            const res = await fetch("/api/user/category");

            console.log(res.status);

            const data = await res.json();

            setCategories(data.categories)

        } catch (error) {
            console.log(error);
        }
    }

    const searchProducts = async () => {
        try {

            const res = await fetch(`/api/user/products?search=${search}`);

            const data = await res.json();

            setProducts(data.products);

            console.log(products);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Overlay>

            <Container>

                <CloseButton
                    onClick={onClose}
                >
                    ✕
                </CloseButton>

                <Title>
                    Search Our Site
                </Title>

                <SearchContainer>

                    <SearchInput
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <SearchButton>
                        <FontAwesomeIcon icon={faSearch} />
                    </SearchButton>

                </SearchContainer>

                <QuickSearchTitle>
                    Quick Searches
                </QuickSearchTitle>

                <CategoryLinks>

                    {categories.map((category: any) => (

                        <CategoryLink
                            key={category._id}
                            onClick={() => {
                                router.push(
                                    `/shop?category=${category._id}`
                                );

                                onClose();
                            }}
                        >
                            {category.name}
                        </CategoryLink>
                    ))}
                </CategoryLinks>

                {
                    products.length > 0 && (
                        <ResultsContainer>
                            {products.slice(0, 4).map((product: any) => (
                                <SearchResultCard
                                    key={product._id}
                                    productId={product._id}
                                    name={product.name}
                                    price={product.price}
                                    image={product.image}
                                    onClose={onClose}
                                    
                                />
                            ))}
                        </ResultsContainer>
                    )
                }

                {
                    search.trim() &&
                    products.length === 0 && (
                        <NoResults>
                            No products found
                        </NoResults>
                    )
                }





            </Container>

        </Overlay>
    )
}
