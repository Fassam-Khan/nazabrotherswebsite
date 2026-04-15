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

export const getCategories = async (params) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params?.parent) searchParams.append('parent', params.parent.toString());
    if (params?.orderby) searchParams.append('orderby', params.orderby);
    if (params?.order) searchParams.append('order', params.order);

    const url = `${API_BASE}/products/categories?${searchParams.toString()}`;

    const response = await fetch(url, {
      headers: getAuthHeader(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get single category
export const getCategoryById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/products/categories/${id}`, {
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