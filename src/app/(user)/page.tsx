import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import NewArrivals from "@/components/home/NewArrivals";
import LuxuryBanner from "@/components/home/LuxuryBanner";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home(){
  return(
   <>
   <Hero/>
   <FeaturedCategories/>
   <NewArrivals/>
   <LuxuryBanner/>
   <WhyChooseUs/>
   </>
  );
}