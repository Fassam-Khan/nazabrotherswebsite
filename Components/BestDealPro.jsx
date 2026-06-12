import React from 'react'
import {getProductBySlug} from "@/lib/wordpress-api"
import AddToCartButton from './AddToCartButton'


const BestDealPro = async () => {

    const bestDealPro = await getProductBySlug(process.env.BEST_DEAL_SLUG || 'daler-rowney-simply-mini-wooden-table-easel-12inches')

 // ✅ Don't crash if product not found
 if (!bestDealPro) return null
  return (
    <div className='mt-10'>
         {/* Heading  */}
         <div className='flex justify-between items-center border-b-2 border-[#c2c2c241] h-[60px]'>
                <div> <h2 className='text-2xl font-extrabold'>Today’s Best Deals.</h2></div>
                <div className='hidden md:flex'><a href="#">View All Categories</a></div>
            </div>


            {/* product card  */}

            <div className='mt-8 border border-black flex flex-wrap p-4 items-center gap-4'>

                {/* left box  */}

                <div>
                    <img src={bestDealPro.images[0].src || "../public/Images/not.webp"} alt="" />
                </div>

                {/* right Box  */}
                <div className='flex flex-col gap-4'>
                    <div>
                        <p className='font-extrabold text-xl'>{bestDealPro?.name}</p>
                    </div>

                    <div>
                        <p className='font-bold text-2xl '>PKR {bestDealPro?.price}</p>
                    </div>

                    <div>
                    <AddToCartButton product={bestDealPro} />

                    </div>
                </div>

            </div>
      
    </div>
  )
}

export default BestDealPro
