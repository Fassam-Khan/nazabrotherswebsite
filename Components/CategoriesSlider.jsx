import React from 'react'
import { getCategories1 } from '@/lib/wordpress-api'
import Link from 'next/link'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

/**
 * Builds the full slug path for a category by walking up the parent chain.
 * Works for parent, sub, and subsub categories.
 *
 * @param {object} category  - the category whose link you want
 * @param {Map}    idMap     - Map<id, category> for fast parent lookups
 * @returns {string}          e.g. "/category/parent/sub/subsub"
 */
function buildCategoryPath(category, idMap) {
  const slugs = []
  let current = category

  // Walk up the tree collecting slugs (deepest first)
  while (current) {
    slugs.unshift(current.slug)          // prepend so order is root → leaf
    current = current.parent ? idMap.get(current.parent) : null
  }

  return `/product-category/${slugs.join('/')}`
}

const CategoriesSlider = async () => {
  const categories = await getCategories1()

  // Build a fast id → category lookup map
  const idMap = new Map(categories.map((cat) => [cat.id, cat]))

  return (
    <div className="px-4 py-2">
      <Carousel>
        <CarouselContent>
          {categories.map((category) => {
            const href = buildCategoryPath(category, idMap)

            return (
              <CarouselItem key={category.id} className="basis-1/3">
                <Link href={href} className="flex items-center gap-2">
                  {/* Category image – falls back to a placeholder */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={category?.image?.src || "/Images/not.webp"}
                      width={40}
                      height={40}
                      alt={category.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Category label */}
                  <p className="text-sm font-medium truncate">{category.name}</p>
                </Link>
              </CarouselItem>
            )
          })}
        </CarouselContent>

      
      </Carousel>
    </div>
  )
}

export default CategoriesSlider