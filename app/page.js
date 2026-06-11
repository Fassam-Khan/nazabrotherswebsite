import Header from "@/Components/Header";
import Image from "next/image";
import  CategoriesSlider  from "@/Components/CategoriesSlider";
import Hero from "@/Components/Hero";
import Categories from "@/Components/Categories";
import BestDealPro from "@/Components/BestDealPro";

export default function Home() {
  return (
    <>
    <main className="md:max-w-[1200px] mt-2 m-auto md:p-0     ">
      {/* Categories Section  */}
      <div className="w-[100%] m-auto ">
     <CategoriesSlider/>
      </div>
      {/* Hero Section  */}
      <Hero/>
      <Categories/>
      <BestDealPro/>
      
    </main>
    
    </>
  
  );
}
