import React, { useEffect, useState } from 'react';

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('bname'); // Default sort field
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://shobhasaree.onrender.com/api/getproducts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bname: 'All Brands',
            cname: 'All Categories',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        // Convert price and quantity fields if they are objects
        const safeDecimal = (value) => {
          if (value === null || value === undefined) return 0;
          if (typeof value === 'object' && value.$numberDecimal !== undefined) {
            return parseFloat(value.$numberDecimal);
          } else if (typeof value === 'number') {
            return value;
          } else if (typeof value === 'string' && !isNaN(value)) {
            return parseFloat(value);
          }
          return 0;
        };
        const convertedProducts = data.map(product => ({
          ...product,
          price: safeDecimal(product.price),
          quantity: safeDecimal(product.quantity),
        }));

        // Initial sort by default field
        const sortedProducts = sortProducts(convertedProducts, sortField, sortOrder);
        setProducts(sortedProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sorting function
  const sortProducts = (productsArray, field, order) => {
    return [...productsArray].sort((a, b) => {
      let fieldA = a[field];
      let fieldB = b[field];
  
      if (field === 'dop') {
        // Convert date strings to Date objects
        const [dayA, monthA, yearA] = fieldA.split('/').map(Number);
        const [dayB, monthB, yearB] = fieldB.split('/').map(Number);
        fieldA = new Date(yearA, monthA - 1, dayA);
        fieldB = new Date(yearB, monthB - 1, dayB);
      } else if (['price', 'quantity', 'mrp'].includes(field)) {
        fieldA = parseFloat(fieldA);
        fieldB = parseFloat(fieldB);
      }

      if (order === 'asc') {
        return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
      } else {
        return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
      }
    });
  };

  // Handle sorting whenever the sort field or order is changed
  const handleSort = () => {
    const sortedProducts = sortProducts(products, sortField, sortOrder);
    setProducts(sortedProducts);
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-danger text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product List</h2>

      {/* Sorting Controls */}
      <div className="mb-3 d-flex justify-content-center">
        <select
          className="form-select mr-2"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="pname">Product Name</option>
          <option value="quantity">Quantity</option>
          <option value="price">Price</option>
          <option value="bname">Brand</option>
          <option value="cname">Category</option>
          <option value="vendor">Vendor</option>
          <option value="mrp">MRP</option>
          <option value="dop">Date of Purchase</option>
        </select>

        <select
          className="form-select mr-2"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button className="btn btn-primary" onClick={handleSort}>
          Sort
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        {/* Product Table */}
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>PNAME</th>
              <th>QUANTITY</th>
              <th>PRICE</th>
              <th>BRAND</th>
              <th>CATEGORY</th>
              <th>VENDOR</th>
              <th>MRP</th>
              <th>DOP</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.pname}</td>
                <td>{product.quantity}</td>
                <td>₹{product.price}</td>
                <td>{product.bname}</td>
                <td>{product.cname}</td>
                <td>{product.vendor}</td>
                <td>{product.mrp}</td>
                <td>{product.dop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
