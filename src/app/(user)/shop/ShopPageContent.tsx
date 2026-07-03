"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

const Container = styled.div`
  padding: 50px;

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px 10px;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  color: #272727;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 25px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 15px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 12px;
    margin-top: 20px;
  }
`;

const PaginationButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: black;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 14px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 25px;
    padding: 0 10px;
    flex-wrap: wrap;
  }
`;

const SearchInput = styled.input`
  width: 100%;
   max-width: 500px;
  padding: 15px 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 18px;
  outline: none;

  &:focus {
    border-color: #000;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 16px;
  }
`;

const ClearButton = styled.button`
  padding: 15px 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
  color: #272727;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #000;
    color: #fff;
    border-color: #000;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;
const Content = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Sidebar = styled.div<{ open?: boolean }>`
  width: 250px;
  padding: 25px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .1);
  height: fit-content;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    display: ${(props) => (props.open ? "block" : "none")};
  }
`;

const MobileFilterToggle = styled.button`
  display: none;
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: none;
  border-radius: 8px;
  background: black;
  color: white;
  font-size: 16px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const SidebarTitle = styled.h3`
  margin-bottom: 20px;
`;

const CategoryItem = styled.div<{ selected: boolean }>`
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  background: ${(props) => (props.selected ? "#000" : "transparent")};
  color: ${(props) => (props.selected ? "#fff" : "#333")};
  margin-bottom: 10px;

  &:hover {
    background: #f5f5f5;
  }
`;

const SortSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  border-radius: 8px;
  margin-bottom: 130px;

  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const ProductsSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const EmptyState = styled.div`
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .1);
  padding: 20px;
  text-align: center;

  @media (max-width: 480px) {
    min-height: 250px;
  }
`;

const EmptyTitle = styled.h2`
  font-size: 28px;
  color: #222;
  margin-bottom: 15px;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const EmptyText = styled.p`
  font-size: 18px;
  color: #777;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const LoadingContainer = styled.div`
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.h2`
  color: #666;
  font-size: 24px;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export default function ShopPage() {

    type Product = {
        _id: string;
        name: string;
        price: number;
        image: string;
        category?: {
            _id: string;
            name: string;
        };
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState<any[]>([]);

    const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState("");

    // controls sidebar visibility on mobile
    const [filtersOpen, setFiltersOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

    const { addToCart } = useCart();



    useEffect(() => {
        fetchProducts();
    }, [page, search, selectedCategory, sort, priceRange]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setSelectedCategory(searchParams.get("category") || "");
    }, [searchParams]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/user/products?page=${page}&search=${search}&category=${selectedCategory}&sort=${sort}&price=${priceRange}`);
            const data = await res.json();
            setProducts(data.products);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/user/category");
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories)
            }
        } catch (error) {

        }
    }

    const handleClearFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setSort("newest");
        setPriceRange("");
        setPage(1);
    };

    return (
        <Container>
            <Title>All Jewellery</Title>

            <SearchContainer>
                <SearchInput
                    type="text"
                    placeholder="Search jewellery..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}

                    />

                     <ClearButton
                    onClick={handleClearFilters}>
                    Clear Filters
                </ClearButton>
                
            </SearchContainer>

            <Content>

                <MobileFilterToggle onClick={() => setFiltersOpen(!filtersOpen)}>
                    {filtersOpen ? "Hide Filters ▲" : "Show Filters ▼"}
                </MobileFilterToggle>

                <Sidebar open={filtersOpen}>
                    <SidebarTitle>Categories</SidebarTitle>

                    <CategoryItem
                        selected={selectedCategory === ""}
                        onClick={() => {
                            setSelectedCategory("");
                            setPage(1);
                        }}
                    >
                        All
                    </CategoryItem>

                    {categories.map((category: any) => (
                        <CategoryItem
                            key={category._id}
                            selected={selectedCategory === category._id}
                            onClick={() => {
                                setSelectedCategory(category._id);
                                setPage(1);
                            }}
                        >
                            {category.name}
                        </CategoryItem>
                    ))}

                    <SidebarTitle>Sort By</SidebarTitle>

                    <SortSelect
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="newest">Newest</option>
                        <option value="priceLow">Price Low → High</option>
                        <option value="priceHigh">Price High → Low</option>
                        <option value="name">Name A-Z</option>
                    </SortSelect>

                    <SidebarTitle>Price Range</SidebarTitle>

                    <CategoryItem
                        selected={priceRange === ""}
                        onClick={() => {
                            setPriceRange("");
                            setPage(1);
                        }}
                    >
                        All Prices
                    </CategoryItem>

                    <CategoryItem
                        selected={priceRange === "0-500"}
                        onClick={() => {
                            setPriceRange("0-500");
                            setPage(1);
                        }}
                    >
                        ₹0 - ₹500
                    </CategoryItem>

                    <CategoryItem
                        selected={priceRange === "500-1000"}
                        onClick={() => {
                            setPriceRange("500-1000");
                            setPage(1);
                        }}
                    >
                        ₹500 - ₹1000
                    </CategoryItem>

                    <CategoryItem
                        selected={priceRange === "1000-5000"}
                        onClick={() => {
                            setPriceRange("1000-5000");
                            setPage(1);
                        }}
                    >
                        ₹1000 - ₹5000
                    </CategoryItem>

                    <CategoryItem
                        selected={priceRange === "5000+"}
                        onClick={() => {
                            setPriceRange("5000-above");
                            setPage(1);
                        }}
                    >
                        ₹5000+
                    </CategoryItem>

                </Sidebar>

                <ProductsSection>
                    {loading ? (
                        <LoadingContainer>
                            <LoadingText>Loading Products...</LoadingText>
                        </LoadingContainer>
                    ) : products.length > 0 ? (
                        <Grid>
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    productId={product._id}
                                    name={product.name}
                                    price={product.price}
                                    image={product.image}
                                    category={product.category?.name || ""}
                                    onAddToCart={() => addToCart(product._id, 1)}
                                />
                            ))}
                        </Grid>
                    ) : (
                        <EmptyState>
                            <EmptyTitle>No Products Found</EmptyTitle>
                            <EmptyText>Try another search or category.</EmptyText>
                        </EmptyState>
                    )}
                </ProductsSection>

            </Content>

            <PaginationContainer>
                <PaginationButton
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </PaginationButton>
                <span>Page {page} of {totalPages}</span>
                <PaginationButton
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </PaginationButton>
            </PaginationContainer>
        </Container>
    );
}