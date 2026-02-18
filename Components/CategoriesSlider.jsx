import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/Components/ui/carousel"

const CategoriesSlider = () => {
  return (
    
    <Carousel>
        
    <CarouselContent>
      <CarouselItem className="basis-1/3">.5..</CarouselItem>
      <CarouselItem className="basis-1/3">...</CarouselItem>
      <CarouselItem className="basis-1/3">Acrylic Paint</CarouselItem>
      <CarouselItem className="basis-1/3">Acrylic Paint</CarouselItem>
      <CarouselItem className="basis-1/3">Acrylic Paint</CarouselItem>
    </CarouselContent>
    <CarouselNext />
    <CarouselPrevious />
  </Carousel>
      
   
  )
}

export default CategoriesSlider
