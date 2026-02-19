import React from 'react'
import Image from 'next/image'

const Maintainance = () => {
  return (
    <div className='w-[100vw] h-[100vh] flex justify-center items-center flex-col gap-4 p-3' >
        <Image src={'/Images/maintainance.webp'} height={180} width={300} alt='maintainance'/>
        <div className='md:w-[600px] w-[100%] text-center'>
        <p>Our website is under maintenance at the moment.
To place your order online, kindly contact us via WhatsApp at 0336-2234470.
Thank you for your support!</p>

        </div>
       
       
      
    </div>
  )
}

export default Maintainance
