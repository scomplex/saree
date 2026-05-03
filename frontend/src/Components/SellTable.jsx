import React, { useEffect, useState } from 'react';

export default function SellTable() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getsales', {
          method: 'GET', // Adjust the method if needed for your API
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sales');
        }

        const data = await response.json();
        // Log fetched sales data

        setSales(data.reverse());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-danger text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Sales List</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>PNAME</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th>SELLING PRICE</th>
            <th>DATE OF SALE</th>
            <th>SALESPERSON</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={index}>
              <td>{sale.pname}</td>
              <td>{sale.cname}</td>
              <td>{sale.bname}</td>
              <td>₹{sale.sellingprice}</td>
              <td>{sale.dos}</td>
              <td>{sale.salesperson}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
