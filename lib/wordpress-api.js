// lib/wordpress-api.js

const BASE = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://nazarbrothers.pk';
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

// ✅ Auth via header (never in URL — keys stay server-side)
const authHeader = () => ({
  Authorization: `Basic ${Buffer.from(`${KEY}:${SECRET}`).toString('base64')}`,
  'Content-Type': 'application/json',
});

const WC = `${BASE}/wp-json/wc/v3`;
const STORE = `${BASE}/wp-json/wc/store/v1`;


// ============ PRODUCTS ============

export const getProducts = async ({ page = 1, per_page = 12, category = '', search = '' } = {}) => {
  const params = new URLSearchParams({ page, per_page });
  if (category) params.append('category', category);
  if (search) params.append('search', search);

  const res = await fetch(`${WC}/products?${params}`, {
    headers: authHeader(),
    next: { revalidate: 300 }, // ✅ cache 5 minutes
  });

  const data = await res.json();
  const total = res.headers.get('x-wp-total');
  const totalPages = total ? Math.ceil(Number(total) / per_page) : 1;

  return {
    products: Array.isArray(data) ? data : [],
    totalPages,
  };
};

// ✅ Get product by ID
export const getProductById = async (id) => {
  const res = await fetch(`${WC}/products/${id}`, {
    headers: authHeader(),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Product ${id} not found`);
  return res.json();
};

// ✅ Get product by slug (was hardcoded before)
export const getProductBySlug = async (slug) => {
  const res = await fetch(`${WC}/products?slug=${slug}`, {
    headers: authHeader(),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Product slug "${slug}" not found`);
  const data = await res.json();
  return data[0] ?? null;
};

// ✅ Featured / best deal products — reusable, not hardcoded
export const getFeaturedProducts = async (per_page = 4) => {
  const res = await fetch(`${WC}/products?featured=true&per_page=${per_page}`, {
    headers: authHeader(),
    next: { revalidate: 600 },
  });
  return res.json();
};


// ============ CATEGORIES ============

// ✅ All categories — long cache since they rarely change
export const getCategories = async () => {
  const res = await fetch(`${WC}/products/categories?per_page=100&hide_empty=true`, {
    headers: authHeader(),
    next: { revalidate: 3600 }, // ✅ cache 1 hour
  });
  return res.json();
};

// ✅ Fixed: was /categories/slug=x (broken) → now ?slug=x (correct)
export const getCategoryBySlug = async (slug) => {
  const res = await fetch(`${WC}/products/categories?slug=${slug}`, {
    headers: authHeader(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Category "${slug}" not found`);
  const data = await res.json();
  return data[0] ?? null;
};

// Get products for a category page — accepts slug or ID
export const getProductsByCategory = async (categoryId, { page = 1, per_page = 12 } = {}) => {
  const params = new URLSearchParams({ category: categoryId, page, per_page });
  const res = await fetch(`${WC}/products?${params}`, {
    headers: authHeader(),
    next: { revalidate: 300 },
  });
  const data = await res.json();
  const total = res.headers.get('x-wp-total');
  return {
    products: Array.isArray(data) ? data : [],
    totalPages: total ? Math.ceil(Number(total) / per_page) : 1,
  };
};


// ============ SEARCH ============

export const searchProducts = async (searchTerm, { page = 1, per_page = 12 } = {}) => {
  return getProducts({ search: searchTerm, page, per_page });
};


// ============ ORDERS ============

export const createOrder = async (orderData) => {
  const res = await fetch(`${WC}/orders`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error(`Order failed: ${res.statusText}`);
  return res.json();
};


// ============ ATTRIBUTES ============

export const getAttributes = async () => {
  const res = await fetch(`${WC}/products/attributes`, {
    headers: authHeader(),
    next: { revalidate: 3600 },
  });
  return res.json();
};

export const getAttributeTerms = async (attributeId, { page = 1, per_page = 100 } = {}) => {
  const params = new URLSearchParams({ page, per_page });
  const res = await fetch(`${WC}/products/attributes/${attributeId}/terms?${params}`, {
    headers: authHeader(),
    next: { revalidate: 3600 },
  });
  return res.json();
};