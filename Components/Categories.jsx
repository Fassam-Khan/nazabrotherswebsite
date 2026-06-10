import React from 'react'
import { getCategories1 } from '@/lib/wordpress-api'
import { Link } from 'lucide-react'

const Categories = async () => {

    const categories = await getCategories1()
    const filterCategories = categories?.filter((cat) =>
  ["Paint Brushes", "Acrylic Paints","Watercolor", "Canvas", "Office Supplies","Art Tool &amp; Wire"].includes(cat.name)
);  



    return (
        <div className='mt-10 '>
            {/* Heading  */}
            <div className='flex justify-between items-center border-b-2 border-[#c2c2c241] h-[60px]'>
                <div> <h2 className='text-2xl font-extrabold'>Popular categories</h2></div>
                <div className='hidden md:flex'><a href="#">View All Categories</a></div>
            </div>
            {/* Categories  */}
            <div className='grid grid-cols-5 w-[100%] mt-6'>

           

                {/* card  */}
                <Link href='/'>
                <div className='relative grayscale bg-cover bg-center w-[150px] h-[150px] rounded p-2 bg-[#EBEBEB] ' style={{
                    backgroundImage: `url("https://www.parasartfever.com/media/catalog/product/cache/1bbdda1a8e63ff7a58f534b4616cd23f/u/n/untitled-1.png")`,
                }} >
                    <div className='bg-white absolute bottom-2 w-full '>
                        <p>Acrylic Paint</p>
                    </div>


                </div>
                </Link>

            </div>
        </div>
    )
}

export default Categories
