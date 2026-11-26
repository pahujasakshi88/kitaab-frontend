import Hero from "../components/public/Hero";
import TrendingBooks from "../components/public/Categories";
import Categories from "../components/public/TrendingBooks";
import WhyKitaab from "../components/public/WhyKitaab";
import FinalCTA from "../components/public/FinalCTA";
import Footer from "../components/public/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrendingBooks />
      <Categories />
      <WhyKitaab />
      <FinalCTA />
      <Footer />
    </main>
  );
}
