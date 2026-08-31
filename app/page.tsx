import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductSection from "@/components/home/ProductSection";
import CustomRequestSection from "@/components/home/CustomRequestSection";
import OffersSection from "@/components/home/OffersSection";
import WhyShopWithUs from "@/components/home/WhyShopWithUs";
import { getProducts } from "@/lib/data/products";

// Always serve the latest products (added/changed from the admin panel)
export const dynamic = "force-dynamic";

export default function HomePage() {
  const allProducts = getProducts();
  const featured = allProducts.filter((p) => p.featured);

  return (
    <>
      <Hero />
      <FeaturedCategories />
      <div id="featured-picks" className="scroll-mt-28">
        <ProductSection
          title="Featured Picks"
          subtitle="Handpicked for you"
          products={featured}
          viewAllHref="/shop"
        />
      </div>
      <CustomRequestSection />
      <OffersSection />
      <WhyShopWithUs />
    </>
  );
}