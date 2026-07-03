"use client";

import styled from "styled-components";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 50px 20px;
`;

const ProductWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
`;

const ProductImage = styled.img`
  width: 100%;
  border-radius: 12px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Category = styled.p`
  color: #d4af37;
  font-weight: 800;
`;

const ProductName = styled.h1`
  margin: 10px 0;
`;

const ProductPrice = styled.h2`
  color: #272727;
`;

const Stock = styled.h3<{ $inStock: boolean }>`
  margin-top:10px;
  font-weight:500;
  color: ${(props) =>
    props.$inStock ? "green" : "red"};
`;

const Description = styled.p`
  margin-top: 20px;
  line-height: 1.8;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const AddToCartButton = styled.button`
  padding: 12px 25px;

  border: none;

  background: #272727;
  color: white;

  cursor: pointer;

  border-radius: 8px;

  &:disabled {
  background: gray;
  cursor: not-allowed;
  }
`;

const WishlistButton = styled.button`
  padding: 12px 25px;

  border: 1px solid #272727;

  background: white;

  cursor: pointer;

  border-radius: 8px;
`;

const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;

const QtyButton = styled.button`
  width: 35px;
  height: 35px;
  border: none;
  background: #272727;
  color: white;
  cursor: pointer;
`;

const QtyValue = styled.span`
  font-size: 18px;
`;

const RelatedSection = styled.section`
  margin-top: 100px;
`;

const RelatedTitle = styled.h2`
  text-align: center;
  font-size: 36px;
  color: #272727;
  margin-bottom: 15px;
`;

const RelatedSubtitle = styled.p`
  text-align: center;
  color: #777;
  margin-bottom: 50px;
`;

const ProductGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 30px;

  @media (max-width:1200px){
    grid-template-columns: repeat(3,1fr);
  }

  @media (max-width:900px){
    grid-template-columns: repeat(2,1fr);
  }

  @media (max-width:600px){
    grid-template-columns: 1fr;
  }
`;

export default function ProductDetailsPage() {


  type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;

    category?: {
      _id: string;
      name: string;
    }
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] =
    useState<Product[]>([]);



  const {
    wishlistIds,
    toggleWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const params = useParams();

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, []);

  console.log(relatedProducts);

  const fetchProduct = async () => {
    try {

      const res = await fetch(`/api/user/products/${params.id}`);

      const data = await res.json();

      setProduct(data);

    } catch (error) {
      console.log(error);
    }
  }

  const fetchRelatedProducts = async () => {

    try {

      const res = await fetch(
        `/api/user/products/related/${params.id}`
      );

      const data = await res.json();

      if (data.success) {

        setRelatedProducts(
          data.relatedProducts
        );

      }

    } catch (error) {

      console.log(error);

    }

  };

  if (!product) {
    return <h2>Loading...</h2>;
  }

  const isWishlisted = wishlistIds.includes(product._id);


  return (
    <>
      <Container>
        <ProductWrapper>
          <ProductImage
            src={product?.image}
            alt={product.name}
          />

          <ProductInfo>
            <Category>
              {product?.category?.name}
            </Category>

            <ProductName>
              {product.name}
            </ProductName>

            <ProductPrice>
              ₹{product.price}
            </ProductPrice>

            <Stock $inStock={product.stock > 0}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </Stock>

            <Description>
              {product.description}
            </Description>

            <QuantityWrapper>
              <QtyButton
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
              >
                -
              </QtyButton>

              <QtyValue>{quantity}</QtyValue>

              <QtyButton
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(product.stock, prev + 1)
                  )
                }
              >
                +
              </QtyButton>
            </QuantityWrapper>

            <ButtonGroup>

              <AddToCartButton disabled={product.stock === 0}
                onClick={() =>
                  addToCart(product._id, quantity)
                }
              >
                Add To Cart
              </AddToCartButton>

              <WishlistButton
                onClick={() =>
                  toggleWishlist(product._id)
                }
              >
                {
                  isWishlisted
                    ? "❤️ Remove from Wishlist"
                    : "🤍 Add to Wishlist"
                }
              </WishlistButton>

            </ButtonGroup>

          </ProductInfo>

        </ProductWrapper>

      </Container>

      {
        relatedProducts.length > 0 && (

          <RelatedSection>

            <RelatedTitle>
              You May Also Like
            </RelatedTitle>

            <RelatedSubtitle>
              Explore more elegant jewellery pieces
              you'll love.
            </RelatedSubtitle>

            <ProductGrid>

              {

                relatedProducts.map((item) => (

                  <ProductCard
                    key={item._id}

                    productId={item._id}

                    image={item.image}

                    name={item.name}

                    category={
                      item.category?.name || ""
                    }

                    price={item.price}

                    onAddToCart={() =>
                addToCart(product._id, 1)
              }

                  />

                ))

              }

            </ProductGrid>

          </RelatedSection>
        )
      }
    </>

  );
}