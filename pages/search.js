import React, {useState, useEffect} from 'react';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import ProductDetails from '../components/layout/ProductDetails';
import useProducts from '../hooks/useProducts';

const Search = () => {
  const router = useRouter();
  const { query: { q}} = router;

  const [filteredProducts, setFilteredProducts] = useState([]);

  // Get all the products
  const { products } = useProducts('created');

  useEffect(() => {
    const search = q.toLowerCase();
    const filterProducts = products.filter(product => {
      return (
        product.name.toLowerCase().includes(search) || 
        product.description.toLowerCase().includes(search)
      )
    });
    setFilteredProducts(filterProducts);
  }, [q, products])

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {filteredProducts.map(product => (
                <ProductDetails 
                  key={product.id}
                  product={product}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Search;