import React from 'react'

const Categories = () => {
    return (
        <div className='mt-10 '>
            {/* Heading  */}
            <div className='flex justify-between items-center border-b-2 border-[#c2c2c241] h-[60px]'>
                <div> <h2 className='text-2xl font-extrabold'>Popular categories</h2></div>
                <div className='hidden md:flex'><a href="#">View All Categories</a></div>
            </div>
            {/* Categories  */}
            <div className='grid grid-cols-5 w-[100%] mt-6'>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
                <div>Box</div>
            </div>
        </div>
    )
}

export default Categories
