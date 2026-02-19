import React from 'react'
import Image from 'next/image'
import { Fullscreen } from 'lucide-react'

const Hero = () => {
  return (
    <div className='mt-6 relative w-[100%] h-[400px] '>
        <Image src={'/Images/hero.png'} fill className='object-fit w-[100%]'/>

        
        
      
    </div>
  )
}

export default Hero

