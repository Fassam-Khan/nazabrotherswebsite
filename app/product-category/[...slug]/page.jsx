// app/product-category/[slug]/page.jsx

import CategoryProductsClient from './CategoryProductsClient';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://nazarbrothers.pk';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

async function getCategoryBySlug(slug) {
  try {
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products/categories?slug=${encodeURIComponent(slug)}&consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`;
    console.log('[CategoryPage] Fetching category:', url.replace(WC_CONSUMER_SECRET, '***'));

    const res = await fetch(url, { cache: 'no-store' });
    const text = await res.text();
    console.log('[CategoryPage] Category response status:', res.status);

    const data = JSON.parse(text);
    console.log('[CategoryPage] Categories found:', Array.isArray(data) ? data.length : 'not array', data?.[0]?.name);

    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (err) {
    console.error('[CategoryPage] getCategoryBySlug error:', err);
    return null;
  }
}

async function getProductsByCategory(categoryId, page = 1, per_page = 12) {
  try {
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?category=${categoryId}&per_page=${per_page}&page=${page}&consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    const total = res.headers.get('x-wp-total');
    const totalPages = total ? Math.ceil(Number(total) / per_page) : 1;
    return { products: Array.isArray(data) ? data : [], totalPages };
  } catch (err) {
    console.error('[CategoryPage] getProductsByCategory error:', err);
    return { products: [], totalPages: 1 };
  }
}

export async function generateMetadata({ params }) {
  // Next.js 15: params is a Promise
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return {
    title: category ? `${category.name} – Nazar Brothers` : 'Category – Nazar Brothers',
    description: category?.description ? category.description.replace(/<[^>]*>/g, '') : '',
  };
}

export default async function CategoryPage({ params, searchParams }) {
  // Next.js 15: both params and searchParams are Promises
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const page = Number(resolvedSearch?.page) || 1;

  console.log('[CategoryPage] Rendering slug:', slug, 'page:', page);
  console.log('[CategoryPage] WC_CONSUMER_KEY set:', !!WC_CONSUMER_KEY);
  console.log('[CategoryPage] WORDPRESS_URL:', WORDPRESS_URL);

  const category = await getCategoryBySlug(slug);

  if (!category) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Category not found</h1>
        <p style={{ color: '#666' }}>
          No category matching <strong>&quot;{slug}&quot;</strong> was found.
          Check your terminal logs for the API response.
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#999' }}>
          Make sure <code>WC_CONSUMER_KEY</code> and <code>WC_CONSUMER_SECRET</code> are set in <code>.env.local</code>
        </p>
      </div>
    );
  }

  const { products, totalPages } = await getProductsByCategory(category.id, page);

  return (
    <CategoryProductsClient
      category={category}
      initialProducts={products}
      totalPages={totalPages}
      currentPage={page}
      slug={slug}
    />
  );
}