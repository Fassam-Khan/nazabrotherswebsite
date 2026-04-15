// app/products/page.js
import { getProducts } from '@/lib/wordpress-api';

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;

  const page = Number(params?.page || 1);

  const data = await getProducts({
    page,
    per_page: 12,
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div>
      {/* PRODUCTS */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>Rs. {product.price}</p>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex gap-4 mt-6">
        
        {/* Prev */}
        {page > 1 && (
          <a href={`/products?page=${page - 1}`}>
            ⬅ Prev
          </a>
        )}

        {/* Page Info */}
        <span>
          Page {page} of {totalPages}
        </span>

        {/* Next */}
        {page < totalPages && (
          <a href={`/products?page=${page + 1}`}>
            Next ➡
          </a>
        )}

      </div>
    </div>
  );
}