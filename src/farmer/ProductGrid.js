import React from 'react';
import ProductCard from './ProductCard'; // Assuming the ProductCard component is in the same folder
import AddNewProductCard from './AddNewProductCard';

export default function ProductGrid({ allProducts }) {
  return (
    <>
    <div style={styles.gridContainer}>
      {/* Product Cards */}
      {allProducts.map((prod) => (
        <ProductCard key={prod.prod_id} product={prod} />
      ))}
    </div>
    <div style={styles.addNewContainer}>
      <AddNewProductCard />
    </div>
  </>
  );
}

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(345px, 1fr))', // Adjust based on your ProductCard width
    gap: '16px',
    padding: '16px',
  },
  addNewContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000, // Ensure it's above other elements
  },
};
