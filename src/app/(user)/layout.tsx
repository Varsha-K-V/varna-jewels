import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <CartProvider>
      <WishlistProvider>

      <Navbar />
      {children}
      <Footer />

    </WishlistProvider>
    </CartProvider>
    
     
    </>
  );
}