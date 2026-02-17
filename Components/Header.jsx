import React from 'react'
import Image from 'next/image'

const Header = () => {
    return (
        <div>
            {/* Top Head  */}
            <div className=' flex justify-center items-center border-b border-[#eeeeee] h-10 '>
                <p className='font-[600] text-sm'>FREE SHIPPING FOR ORDERS EXCEEDING PKR 6000  |  <a href="">See Terms & Condition</a>
                </p>
            </div>
            {/* middle Head  */}
            <div className='max-w-[1600px] m-auto'>
                <div className='flex justify-between items-center h-18'>
                    {/* logo div  */}
                    <div >
                        <Image src={'/Images/logo.png'} alt='nazarLogo' width={200} height={100} />
                    </div>
                    {/* Search div  */}
                    <div>
                        <input type="text" placeholder='Search Product' className='' />

                    </div>
                    <div></div>

                </div>
            </div>
            {/* Bottom Head  */}
            <div></div>


        </div>
    )
}

export default Header
