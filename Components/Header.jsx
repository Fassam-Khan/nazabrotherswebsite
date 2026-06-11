import React from 'react'
import Image from 'next/image'
import { Search, User, Star, ShoppingBag, Menu } from "lucide-react";
import Link from 'next/link';
import CategoriesData from "@/data/Categories"
import { Button } from './ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/Components/ui/hover-card';
import { getCategories } from '@/lib/wordpress-api';

const Header = async () => {

    const categories = await getCategories()

    const allowedCategories = ["Art Supplies", "Office Supplies", "School Stationery", "Gifts & Souvenirs", "Deals"]

    // ✅ Step 1 - Level 1: Parent Categories
    const parentCategories = categories?.filter(
        (cat) => cat.parent === 0 && allowedCategories.includes(cat.name)
    )

    // ✅ Step 2 - Level 1 IDs
    const parentIds = parentCategories?.map((cat) => cat.id)

    // ✅ Step 3 - Level 2: Sub Categories
    const subCategories = categories?.filter(
        (cat) => parentIds?.includes(cat.parent)
    )

    // ✅ Step 4 - Level 2 IDs
    const subIds = subCategories?.map((cat) => cat.id)

    // ✅ Step 5 - Level 3: Sub Sub Categories
    const subSubCategories = categories?.filter(
        (cat) => subIds?.includes(cat.parent)
    )

    return (
        <div className=''>
            {/* Top Head */}
            <div className='md:flex hidden justify-center items-center border-b border-[#eeeeee] h-10'>
                <p className='font-[600] text-sm'>
                    FREE SHIPPING FOR ORDERS EXCEEDING PKR 6000 | <a href="">See Terms & Condition</a>
                </p>
            </div>

            {/* Sticky Section */}
            <div className='sticky top-0 z-50 bg-white w-[100%] shadow-sm left-0'>

                {/* Middle Head */}
                <div className='wrapper md:m-auto h-18 p-4 md:p-0'>
                    <div className='flex justify-between items-center md:h-16 h-12 mt-2'>

                        {/* Logo */}
                        <div>
                            <a href="/"><Image className='md:flex hidden' src={'/Images/logo.png'} alt='nazarLogo' width={200} height={100} /></a>
                            <Menu className='md:hidden block' />
                        </div>

                        <Image className='md:hidden flex' src={'/Images/logo.png'} alt='nazarLogo' width={150} height={100} />

                        {/* Search */}
                        <div className='border-2 border-[#eeeeee] md:flex p-2 w-[45%] hidden'>
                            <select name="" id="" className='outline-none border-r-2 border-[#eeeeee]'>
                                <option value="">All Categories</option>
                                {CategoriesData?.map((category, index) => (
                                    <option value="" key={index}>{category.name}</option>
                                ))}
                            </select>
                            <input type="text" placeholder='Search Product' className='outline-none ml-2 w-[100%]' />
                            <Search />
                        </div>

                        {/* Icons */}
                        <div className='flex gap-6'>
                            <div title='Sign In' className='cursor-pointer hidden md:block'><User /></div>
                            <div className="star relative cursor-pointer hidden md:block" title='My Wish List'>
                                <Star className='cursor-pointer' />
                                <span className='absolute font-bold h-4 w-4 p-2 bg-[var(--primary-color)] top-[-6px] right-[-8px] rounded-full flex items-center justify-center text-sm text-white'>0</span>
                            </div>
                            <div className="cart relative cursor-pointer" title="Cart">
                                <ShoppingBag />
                                <span className='absolute font-bold h-4 w-4 p-2 bg-[var(--primary-color)] top-[-6px] right-[-8px] rounded-full flex items-center justify-center text-sm text-white'>0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Nav */}
                <div className='md:flex bg-[var(--primary-color)] hidden text-white h-10 justify-center items-center'>
                    <ul className='flex gap-5'>
                        {parentCategories?.map((category) => {

                            // Is parent ki sub categories
                            const thisCategorySubs = subCategories?.filter(
                                (sub) => sub.parent === category.id
                            )

                            return (
                                <HoverCard key={category.id} openDelay={10} closeDelay={100}>
                                    <HoverCardTrigger asChild>
                                        <Button variant="link">
                                            <Link href={`/`}>
                                                <li className='font-bold text-[14px] text-white'>
                                                    {category.name.toUpperCase()}
                                                </li>
                                            </Link>
                                        </Button>
                                    </HoverCardTrigger>

                                    {thisCategorySubs?.length > 0 && (
                                        <HoverCardContent className="w-56 p-2 max-h-[400px] overflow-y-auto">
                                            {thisCategorySubs.map((sub) => {

                                                // Is sub ki sub-sub categories
                                                const thisSubSubs = subSubCategories?.filter(
                                                    (subsub) => subsub.parent === sub.id
                                                )

                                                return (
                                                    <div key={sub.id} className="mb-2">
                                                        {/* Level 2 - Sub Category */}
                                                        <Link
                                                            href={`/`}
                                                            className="block font-semibold text-sm text-gray-800 hover:text-black px-2 py-1 hover:bg-gray-100 rounded"
                                                        >
                                                            {sub.name}
                                                        </Link>

                                                        {/* Level 3 - Sub Sub Categories */}
                                                        {thisSubSubs?.length > 0 && (
                                                            <div className="ml-3 border-l-2 border-gray-200 pl-2">
                                                                {thisSubSubs.map((subsub) => (
                                                                    <Link
                                                                        key={subsub.id}
                                                                        href={`/`}
                                                                        className="block text-xs text-gray-500 hover:text-black py-0.5 hover:bg-gray-100 px-1 rounded"
                                                                    >
                                                                        {subsub.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </HoverCardContent>
                                    )}
                                </HoverCard>
                            )
                        })}
                    </ul>
                </div>

            </div>

            {/* Mobile Search */}
            <div className='p-4  md:hidden'>
                <div className='border-2 border-[#eeeeee] flex p-2 w-[100%]'>
                    <input type="text" placeholder='Search Product' className='outline-none ml-2 w-[100%]' />
                    <Search />
                </div>
            </div>

        </div>
    )
}

export default Header