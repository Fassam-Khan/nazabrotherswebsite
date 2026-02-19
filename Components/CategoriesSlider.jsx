import React from 'react'
import categories from '@/data/Categories'
import Image from 'next/image'
import Link from 'next/link'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/Components/ui/carousel"

const CategoriesSlider = () => {
  console.log(categories)
  return (
    
    <Carousel>
        
    <CarouselContent>
      {categories.map((category,index)=>{
       return  <CarouselItem className="basis-1/3 " key={index}>
       <Link href={category.slug}>
       <div className='flex gap-2 items-center text-sm'>
         <div className="categoty-img">
           <Image src={'/Images/brushes.jpg'} alt='brush' width={40} height={40} className='rounded-full '/>
         </div>
         <p>{category.name}</p>
       </div>
       </Link>
     </CarouselItem>

       

      })}
     
     
    </CarouselContent>
    <CarouselNext />
    <CarouselPrevious />
  </Carousel>
      
   
  )
}

export default CategoriesSlider
