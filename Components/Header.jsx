import React from 'react'
import Image from 'next/image'
import CategoriesData from '@/data/Categories'
import { Search, User, Star, ShoppingBag, ChevronDown,Menu } from "lucide-react";


import categories from '@/data/Categories'

const Header = () => {
    console.log(CategoriesData)
    return (
        <div className=''>
            {/* Top Head  */}
            <div className=' md:flex hidden justify-center items-center border-b border-[#eeeeee] h-10 '>
                <p className='font-[600] text-sm'>FREE SHIPPING FOR ORDERS EXCEEDING PKR 6000  |  <a href="">See Terms & Condition</a>
                </p>
            </div>
            {/* middle Head  */}
            <div className='max-w-[1200px] md:m-auto   '>
                <div className='flex justify-between items-center md:h-16 h-12  mt-2'>
                    {/* logo div  */}
                    <div >
                        <Image className='md:flex hidden' src={'/Images/logo.png'} alt='nazarLogo' width={200} height={100} />
                        <Menu className='md:hidden block'/>

                    </div>
                    {/* Search div  */}
                    <Image className='md:hidden flex' src={'/Images/logo.png'} alt='nazarLogo' width={150} height={100} />

                    <div className='border-2 border-[#eeeeee] md:flex p-2 w-[45%] hidden'>
                        
                        <select name="" id="" className='outline-none border-r-2 border-[#eeeeee]'>
                            <option value="">All Categories</option>
                            {CategoriesData.map((category, index) => {
                                return <option value="" key={index}>{category.name}</option>
                            })}

                        </select>
                        <input type="text text-gray-500" placeholder='Search Product' className='outline-none ml-2 w-[100%]' />
                        <Search />


                    </div>
                    <div className='flex gap-6'>
                        <div title='Sign In' className='cursor-pointer hidden md:block'><User /></div>

                        <div className="star relative cursor-pointer hidden md:block  " title='My Wish List'>
                            <Star className='cursor-pointer' xlinkTitle='Wishlist' />
                            <span className='absolute font-bold h-4 w-4 p-2 bg-[var(--primary-color)] top-[-6px] right-[-8px] rounded-full flex items-center justify-center text-sm text-white'>0</span>
                        </div>
                        <div className="cart relative cursor-pointer" title="Cart">
                            <ShoppingBag />
                            <span className='absolute font-bold h-4 w-4 p-2  bg-[var(--primary-color)] top-[-6px] right-[-8px] rounded-full flex items-center justify-center text-sm text-white'>0</span>

                        </div>
                    </div>

                </div>
            </div>
            {/* Bottom Head  */}
            <div className='md:flex bg-[var(--primary-color)] hidden text-white h-10 justify-center items-center'>
                <ul className='flex gap-5'>
                    {categories.map((category, index) => {
                        return <li key={index} className='flex cursor-pointer font-bold'>{category.name} <ChevronDown className='w-4 text-white' /> </li>

                    })}

                </ul>
            </div>
            <div className='p-2 md:hidden'>
                <div className='border-2 border-[#eeeeee] flex p-2 w-[100%] '>
                    <input type="text text-gray-500" placeholder='Search Product' className='outline-none ml-2 w-[100%]' />
                    <Search />
                </div>
            </div>


        </div>
    )
}

export default Header
