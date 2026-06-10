'use client';

// app/product-category/[slug]/CategoryProductsClient.jsx

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://nazarbrothers.pk';

// ─── helpers ────────────────────────────────────────────────────────────────

function formatPrice(price) {
  if (!price) return '';
  return `Rs. ${Number(price).toLocaleString('en-PK')}`;
}

function getImageSrc(product) {
  return product?.images?.[0]?.src || '/placeholder-product.jpg';
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

// ─── Product Card ────────────────────────────────────────────────────────────

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const secondImage = product?.images?.[1]?.src;

  const isOnSale = product.on_sale;
  const regularPrice = product.regular_price;
  const salePrice = product.sale_price;

  return (
    <Link href={`/product/${product.slug}`} className="product-card" aria-label={product.name}>
      <div
        className="card-image-wrap"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={hovered && secondImage ? secondImage : getImageSrc(product)}
          alt={product.name}
          className="card-image"
          loading="lazy"
        />
        {isOnSale && <span className="badge-sale">Sale</span>}
        {product.stock_status === 'outofstock' && (
          <span className="badge-out">Out of Stock</span>
        )}
      </div>

      <div className="card-body">
        <p className="card-name">{product.name}</p>
        <div className="card-price">
          {isOnSale ? (
            <>
              <span className="price-old">{formatPrice(regularPrice)}</span>
              <span className="price-sale">{formatPrice(salePrice)}</span>
            </>
          ) : (
            <span className="price-regular">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-line short" />
      <div className="skeleton-line long" />
    </div>
  );
}

// ─── Main Client Component ───────────────────────────────────────────────────

export default function CategoryProductsClient({
  category,
  initialProducts,
  totalPages: initialTotalPages,
  currentPage: initialPage,
  slug,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  console.log("Hi", category)

  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [sortBy, setSortBy] = useState('default');
  const [perPage] = useState(12);

  const fetchProducts = useCallback(
    async (page, sort) => {
      setLoading(true);
      try {
        let orderby = 'menu_order';
        let order = 'asc';

        if (sort === 'price-asc') { orderby = 'price'; order = 'asc'; }
        else if (sort === 'price-desc') { orderby = 'price'; order = 'desc'; }
        else if (sort === 'newest') { orderby = 'date'; order = 'desc'; }
        else if (sort === 'popularity') { orderby = 'popularity'; order = 'desc'; }

        const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?category=${category.id}&per_page=${perPage}&page=${page}&orderby=${orderby}&order=${order}&consumer_key=${process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || ''}&consumer_secret=${process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || ''}`;

        const res = await fetch(url);
        const data = await res.json();
        const total = res.headers.get('x-wp-total');
        const pages = total ? Math.ceil(Number(total) / perPage) : 1;

        setProducts(Array.isArray(data) ? data : []);
        setTotalPages(pages);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    },
    [category.id, perPage]
  );

  useEffect(() => {
    if (currentPage !== initialPage || sortBy !== 'default') {
      fetchProducts(currentPage, sortBy);
    }
  }, [currentPage, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    router.push(`/product-category/${slug}?page=${page}`, { scroll: false });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const categoryImage = category?.image?.src;

  return (
    <>
      

      <div className="">
        {/* ── Hero ── */}
        {/* <div className="cat-hero">
          {categoryImage && (
            <img src={categoryImage} alt={category.name} className="cat-hero-img" />
          )}
          <div className="cat-hero-overlay" />
          <div className="cat-hero-content">
            <nav className="cat-breadcrumb">
              <a href="/">Home</a>
              <span>›</span>
              <span>{category.name}</span>
            </nav>
            <h1 className="cat-title">{category.name}</h1>
            {category.description && (
              <p className="cat-desc">{stripHtml(category.description)}</p>
            )}
          </div>
        </div> */}

        {/* Hero 2  */}
        <div className='flex flex-col wrapper  md:p-0 p-4 !mt-10 gap-4'>
            <div className='text-center'>
            <h2 className='text-4xl font-bold'>{category.name}</h2>

            </div>
            <p className='font-light text-sm'>{category.description}</p>
        </div>


        {/* BreadCam  */}


        {/* My Hero  */}

        {/* ── Toolbar ── */}
        {/* <div className="toolbar">
          <span className="toolbar-count">
            {loading
              ? 'Loading…'
              : `${products.length > 0 ? `${(currentPage - 1) * 12 + 1}–${(currentPage - 1) * 12 + products.length}` : '0'} products`}
          </span>

          <div className="toolbar-sort">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              className="sort-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="default">Default</option>
              <option value="newest">Newest</option>
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div> */}

      
      </div>
    </>
  );
}