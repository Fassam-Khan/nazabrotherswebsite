import Header from "@/Components/Header";
import Image from "next/image";
import  CategoriesSlider  from "@/Components/CategoriesSlider";

export default function Home() {
  return (
    <>
    <Header/>
    <main className="md:max-w-[1230px] mt-2 m-auto md:p-0 p-5  border  ">
      <div className="w-[80%] m-auto ">
      <CategoriesSlider  />

      </div>
      
    </main>
    
    </>
  
  );
}
