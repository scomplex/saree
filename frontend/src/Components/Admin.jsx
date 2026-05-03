import React, { useState } from 'react';
import ShowSearch from './ShowSearch';
import ShowAll from './ShowAll';
import AllSales from './AllSales';

export default function Admin() {
  const [view, setView] = useState('search'); // 'search', 'all', or 'sales'

  const handleShowSearch = () => {
    setView('search');
  };

  const handleShowAll = () => {
    setView('all');
  };

  const handleShowSales = () => {
    setView('sales');
  };

  return (
    <div className="container">
      <h1 className="text-warning text-center my-4">Shobha</h1>
      <div className="d-flex justify-content-center mb-3">
        <button
          className="btn btn-primary mx-2"
          onClick={handleShowSearch}
          disabled={view === 'search'}
        >
          Search An Item
        </button>
        <button
          className="btn btn-warning mx-2"
          onClick={handleShowAll}
          disabled={view === 'all'}
        >
          All Stock
        </button>
        <button
          className="btn btn-success mx-2"
          onClick={handleShowSales}
          disabled={view === 'sales'}
        >
          All Sales
        </button>
      </div>
      {view === 'search' && <ShowSearch />}
      {view === 'all' && <ShowAll />}
      {view === 'sales' && <AllSales />}
    </div>
  );
}
