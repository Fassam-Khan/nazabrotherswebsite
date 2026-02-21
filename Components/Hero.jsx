import React from 'react'
import Image from 'next/image'
import { Fullscreen } from 'lucide-react'

const Hero = () => {
  return (
    <div className='mt-6 relative  h-[400px] w-[100%]  '>
      <Image src={'/Images/hero.jpg'} alt='hero' fill className='object-cover '/>
      <div className='absolute left-1/3 top-1/2 text-center'>
      <p className='text-black   text-4xl font-bold '>Art Supplies Store
       </p>
       <span className='text-center'>Since 1948</span>

      </div>
   
      

        
        
      
    </div>
  )
}

export default Hero

