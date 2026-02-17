import React from 'react'
import Image from 'next/image'
import CategoriesData from '@/data/Categories'
import { Search ,User,Star ,ShoppingBag} from "lucide-react";

import categories from '@/data/Categories'

const Header = () => {
    console.log(CategoriesData)
    return (
        <div className=''>
            {/* Top Head  */}
            <div className=' flex justify-center items-center border-b border-[#eeeeee] h-10 '>
                <p className='font-[600] text-sm'>FREE SHIPPING FOR ORDERS EXCEEDING PKR 6000  |  <a href="">See Terms & Condition</a>
                </p>
            </div>
            {/* middle Head  */}
            <div className='max-w-[1600px] m-auto p-5'>
                <div className='flex justify-between items-center h-16'>
                    {/* logo div  */}
                    <div >
                        <Image src={'/Images/logo.png'} alt='nazarLogo' width={200} height={100} />
                    </div>
                    {/* Search div  */}
                    <div className='border-2 border-[#eeeeee] flex p-2 w-[45%]'>
                        <select name="" id="" className='outline-none border-r-2 border-[#eeeeee]'>
                            <option value="">All Categories</option>
                            {CategoriesData.map((category,index)=>{
                                return <option value="" key={index}>{category.name}</option>
                            })}

                        </select>
                        <input type="text text-gray-500" placeholder='Search Product' className='outline-none ml-2 w-[100%]' />
                        <Search/>
                        

                    </div>
                    <div className='flex gap-6'>
                        <User/>
                        <div className="star relative ">
                            <Star/>
                            <span className='absolute h-5 w-5 bg-red-500 top-0 ri'>0</span>
                        </div>
                        <div className="cart">
                            <ShoppingBag/>
                        </div>
                    </div>

                </div>
            </div>
            {/* Bottom Head  */}
            <div></div>


        </div>
    )
}

export default Header
