// lib/wordpress-api.js
// Configuration and utility functions for WordPress WooCommerce API integration

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://nazarbrothers.pk';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;


// For client-side requests (public endpoints)
const API_BASE = `${WORDPRESS_URL}/wp-json/wc/v3`;

// Helper function to create Basic Auth header for server-side requests
const getAuthHeader = () => {
  if (WC_CONSUMER_KEY && WC_CONSUMER_SECRET) {
    const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
    return {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
};

// ============ PRODUCTS ============

export const getProducts = async ({ page = 1, per_page = 12 }) => {
    const url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products?per_page=${per_page}&page=${page}&consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;
  
    const res = await fetch(url);
    const data = await res.json();
  
    // 🔥 fallback pagination logic
    const totalProducts = res.headers.get('x-wp-total');
  
    const totalPages = totalProducts
      ? Math.ceil(totalProducts / per_page)
      : 1;
  
    return {
      products: Array.isArray(data) ? data : [],
      totalPages,
    };
  };

// Get single product by ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      headers: getAuthHeader(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// ============ CATEGORIES ============



export const getCategories1 = async ()=>{
  try {
    const response = await fetch("https://nazarbrothers.pk/wp-json/wc/store/v1/products/categories");
    
    // Check if the request was successful (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
   
    return data
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Get single category
export const getCategoryById = async (slug) => {
  try {
    const response = await fetch(`https://nazarbrothers.pk/wp-json/wc/store/v1/products/categories/slug=${slug}`, {
      headers: getAuthHeader(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// async function getProducts(categoryId) {
//   const consumerKey = process.env.WC_KEY
//   const consumerSecret = process.env.WC_SECRET

//   const res = await fetch(
//     `https://nazarbrothers.pk/wp-json/wc/store/v1/products?category=${categoryId}&per_page=100&`,
//     {
//       next: { revalidate: 60 }
//     }
//   )

//   return res.json()
// }

// ============ ATTRIBUTES ============

export const getAttributes = async () => {
  try {
    const response = await fetch(`${API_BASE}/products/attributes`, {
      headers: getAuthHeader(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch attributes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching attributes:', error);
    throw error;
  }
};

// Get attribute terms (values)
export const getAttributeTerms = async (attributeId, params) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params?.orderby) searchParams.append('orderby', params.orderby);
    if (params?.order) searchParams.append('order', params.order);

    const url = `${API_BASE}/products/attributes/${attributeId}/terms?${searchParams.toString()}`;

    const response = await fetch(url, {
      headers: getAuthHeader(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch attribute terms: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching attribute terms:', error);
    throw error;
  }
};

// ============ ORDERS ============

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// ============ SEARCH ============

export const searchProducts = async (searchTerm, params) => {
  return getProducts({
    search: searchTerm,
    page: params?.page,
    per_page: params?.per_page,
  });
};

  {/* ── Products ── */}
//   <main className="cat-main">
//   <div className="product-grid">
//     {loading ? (
//       Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
//     ) : products.length === 0 ? (
//       <div className="empty-state">
//         <h3>No products found</h3>
//         <p>This category has no products yet.</p>
//       </div>
//     ) : (
//       products.map((product) => (
//         <ProductCard key={product.id} product={product} />
//       ))
//     )}
//   </div>

//   {/* ── Pagination ── */}
//   {totalPages > 1 && !loading && (
//     <nav className="pagination" aria-label="Pagination">
//       <button
//         className="page-btn"
//         onClick={() => handlePageChange(currentPage - 1)}
//         disabled={currentPage <= 1}
//         aria-label="Previous page"
//       >
//         ‹
//       </button>

//       {Array.from({ length: totalPages }, (_, i) => i + 1)
//         .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
//         .reduce((acc, p, idx, arr) => {
//           if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
//           acc.push(p);
//           return acc;
//         }, [])
//         .map((item, idx) =>
//           item === '…' ? (
//             <span key={`ellipsis-${idx}`} style={{ padding: '0 0.25rem', color: '#999' }}>…</span>
//           ) : (
//             <button
//               key={item}
//               className={`page-btn${item === currentPage ? ' active' : ''}`}
//               onClick={() => handlePageChange(item)}
//               aria-current={item === currentPage ? 'page' : undefined}
//             >
//               {item}
//             </button>
//           )
//         )}

//       <button
//         className="page-btn"
//         onClick={() => handlePageChange(currentPage + 1)}
//         disabled={currentPage >= totalPages}
//         aria-label="Next page"
//       >
//         ›
//       </button>
//     </nav>
//   )}
// </main>



// <style>{`
//         /* ── Reset / Base ──────────────────────── */
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .cat-page {
//           font-family: 'Georgia', 'Times New Roman', serif;
//           background: #faf9f7;
//           min-height: 100vh;
//           color: #1a1a1a;
//         }

//         /* ── Hero Banner ───────────────────────── */
//         .cat-hero {
//           position: relative;
//           width: 100%;
//           height: 320px;
//           overflow: hidden;
//           background: #1a1a1a;
//           display: flex;
//           align-items: flex-end;
//         }

//         .cat-hero-img {
//           position: absolute;
//           inset: 0;
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           opacity: 0.45;
//         }

//         .cat-hero-overlay {
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 100%);
//         }

//         .cat-hero-content {
//           position: relative;
//           z-index: 2;
//           padding: 2.5rem 3rem;
//           width: 100%;
//         }

//         .cat-breadcrumb {
//           font-size: 0.78rem;
//           color: #ccc;
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//           margin-bottom: 0.75rem;
//         }

//         .cat-breadcrumb a {
//           color: #ccc;
//           text-decoration: none;
//           transition: color 0.2s;
//         }

//         .cat-breadcrumb a:hover { color: #fff; }
//         .cat-breadcrumb span { margin: 0 0.4em; }

//         .cat-title {
//           font-size: clamp(2rem, 5vw, 3.5rem);
//           font-weight: 400;
//           color: #fff;
//           letter-spacing: -0.01em;
//           line-height: 1.1;
//         }

//         .cat-desc {
//           margin-top: 0.75rem;
//           font-size: 0.95rem;
//           color: #ddd;
//           max-width: 560px;
//           line-height: 1.6;
//           font-style: italic;
//         }

//         /* ── Toolbar ───────────────────────────── */
//         .toolbar {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 1rem;
//           padding: 1.25rem 3rem;
//           background: #fff;
//           border-bottom: 1px solid #e8e4df;
//           flex-wrap: wrap;
//         }

//         .toolbar-count {
//           font-size: 0.85rem;
//           color: #666;
//           letter-spacing: 0.04em;
//         }

//         .toolbar-sort {
//           display: flex;
//           align-items: center;
//           gap: 0.6rem;
//           font-size: 0.85rem;
//           color: #555;
//         }

//         .sort-select {
//           border: 1px solid #d0ccc7;
//           background: #faf9f7;
//           color: #1a1a1a;
//           padding: 0.45rem 2rem 0.45rem 0.75rem;
//           font-size: 0.85rem;
//           font-family: inherit;
//           border-radius: 4px;
//           appearance: none;
//           background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
//           background-repeat: no-repeat;
//           background-position: right 0.6rem center;
//           cursor: pointer;
//           transition: border-color 0.2s;
//         }

//         .sort-select:focus {
//           outline: none;
//           border-color: #1a1a1a;
//         }

//         /* ── Main Layout ───────────────────────── */
//         .cat-main {
//           max-width: 1400px;
//           margin: 0 auto;
//           padding: 2.5rem 3rem 4rem;
//         }

//         /* ── Product Grid ──────────────────────── */
//         .product-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
//           gap: 2rem 1.5rem;
//         }

//         /* ── Product Card ──────────────────────── */
//         .product-card {
//           display: flex;
//           flex-direction: column;
//           text-decoration: none;
//           color: inherit;
//           transition: transform 0.25s ease;
//         }

//         .product-card:hover { transform: translateY(-3px); }

//         .card-image-wrap {
//           position: relative;
//           width: 100%;
//           aspect-ratio: 3/4;
//           overflow: hidden;
//           background: #f0ede8;
//           border-radius: 2px;
//         }

//         .card-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           transition: opacity 0.35s ease;
//         }

//         .badge-sale, .badge-out {
//           position: absolute;
//           top: 0.65rem;
//           left: 0.65rem;
//           font-size: 0.7rem;
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//           padding: 0.25rem 0.6rem;
//           border-radius: 2px;
//           font-weight: 600;
//         }

//         .badge-sale { background: #b5451b; color: #fff; }
//         .badge-out { background: #555; color: #fff; }

//         .card-body {
//           padding: 0.85rem 0.25rem 0;
//         }

//         .card-name {
//           font-size: 0.9rem;
//           font-weight: 400;
//           color: #1a1a1a;
//           line-height: 1.4;
//           margin-bottom: 0.4rem;
//         }

//         .card-price {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           font-size: 0.88rem;
//         }

//         .price-regular { color: #1a1a1a; }
//         .price-sale { color: #b5451b; font-weight: 600; }
//         .price-old { color: #999; text-decoration: line-through; font-size: 0.8rem; }

//         /* ── Skeleton ──────────────────────────── */
//         .skeleton-card { display: flex; flex-direction: column; gap: 0.6rem; }

//         .skeleton-img {
//           aspect-ratio: 3/4;
//           background: linear-gradient(90deg, #ece9e4 25%, #f5f3f0 50%, #ece9e4 75%);
//           background-size: 200% 100%;
//           animation: shimmer 1.4s infinite;
//           border-radius: 2px;
//         }

//         .skeleton-line {
//           height: 14px;
//           background: linear-gradient(90deg, #ece9e4 25%, #f5f3f0 50%, #ece9e4 75%);
//           background-size: 200% 100%;
//           animation: shimmer 1.4s infinite;
//           border-radius: 2px;
//         }

//         .skeleton-line.short { width: 60%; }
//         .skeleton-line.long { width: 85%; }

//         @keyframes shimmer {
//           0% { background-position: 200% 0; }
//           100% { background-position: -200% 0; }
//         }

//         /* ── Empty State ───────────────────────── */
//         .empty-state {
//           grid-column: 1/-1;
//           text-align: center;
//           padding: 5rem 2rem;
//         }

//         .empty-state h3 {
//           font-size: 1.4rem;
//           font-weight: 400;
//           color: #555;
//           margin-bottom: 0.5rem;
//         }

//         .empty-state p {
//           color: #888;
//           font-size: 0.9rem;
//         }

//         /* ── Pagination ────────────────────────── */
//         .pagination {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           gap: 0.4rem;
//           margin-top: 3.5rem;
//           flex-wrap: wrap;
//         }

//         .page-btn {
//           width: 40px;
//           height: 40px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border: 1px solid #d0ccc7;
//           background: #fff;
//           color: #1a1a1a;
//           font-family: inherit;
//           font-size: 0.88rem;
//           cursor: pointer;
//           border-radius: 2px;
//           transition: all 0.2s;
//         }

//         .page-btn:hover:not(:disabled) {
//           border-color: #1a1a1a;
//           background: #1a1a1a;
//           color: #fff;
//         }

//         .page-btn.active {
//           border-color: #1a1a1a;
//           background: #1a1a1a;
//           color: #fff;
//         }

//         .page-btn:disabled {
//           opacity: 0.35;
//           cursor: not-allowed;
//         }

//         /* ── Not Found ─────────────────────────── */
//         .not-found {
//           padding: 5rem 3rem;
//           text-align: center;
//           font-family: Georgia, serif;
//         }

//         .not-found h1 { font-size: 2rem; margin-bottom: 1rem; }

//         /* ── Responsive ────────────────────────── */
//         @media (max-width: 768px) {
//           .cat-hero { height: 220px; }
//           .cat-hero-content { padding: 1.5rem; }
//           .toolbar { padding: 1rem 1.25rem; }
//           .cat-main { padding: 1.5rem 1.25rem 3rem; }
//           .product-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem 1rem; }
//         }

//         @media (max-width: 400px) {
//           .product-grid { grid-template-columns: 1fr; }
//         }
//       `}</style>