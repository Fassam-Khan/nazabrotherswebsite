import React from 'react'
import { getCategories} from '@/lib/wordpress-api'
import Link from 'next/link'

const Categories = async () => {

    const categories = await getCategories()

    const filterCategories = categories?.filter((cat) =>
        ["Paint Brushes", "Acrylic Paints", "Paints &amp; Mediums", "Writing Instruments","Resin Art" ,"Office Supplies", "Art Tool &amp; Wire","Sketch Book"].includes(cat.name)
    );



    return (
        <div className='mt-10 '>
            {/* Heading  */}
            <div className='flex justify-between items-center border-b-2 border-[#c2c2c241] h-[60px]'>
                <div> <h2 className='text-2xl font-extrabold'>Popular categories</h2></div>
                <div className='hidden md:flex'><a href="#">View All Categories</a></div>
            </div>
            {/* Categories  */}
            <div className='grid grid-cols-5 w-[100%] grid-cols-2 gap-8 mt-6 justify-items-center'>
                {filterCategories.map((e, index) => (
                    <div
                        key={index}
                        className="relative bg-cover bg-center w-[150px] h-[150px] rounded p-2 bg-[#EBEBEB]"
                        style={{
                            backgroundImage: `url(${e?.image?.src || "/Images/not.webp"})`, // dynamic image
                        }}
                    >
                        <Link href="/">
                            <div className="bg-white absolute bottom-2 left-0 w-full">
                                <p>{e.name}</p>
                            </div>
                        </Link>
                    </div>
                ))}




            </div>
        </div>
    )
}

export default Categories
