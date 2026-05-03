import React, { useState } from 'react';
import ShowAll from './ShowAll';
import EditStock from './EditStock';
import AddProduct from './AddProduct';
import AddCategory from './AddCategory';
import AddBrand from './AddBrand';
import AllSales from './AllSales';

export default function EditPage() {
  const [view, setView] = useState('edit');

  const handleShowSearch = () => {
    setView('edit');
  };

  const handleShowAll = () => {
    setView('all');
  };

  const handleAddProduct = () => {
    setView('add');
  };

  const handleAddCategory = () => {
    setView('addCategory');
  };

  const handleAddBrand = () => {
    setView('addBrand');
  };

  const handleAllSales = () => {
    setView('allSales');
  };

  return (
    <div className="container">
      <h1 className="text-danger text-center my-4">Shobha Inventory</h1>
      <div 
        className="d-flex flex-wrap justify-content-center mb-3"
        style={{ gap: '10px' }}  // Add gap for spacing between buttons
      >
        <button
          className="btn btn-primary"
          onClick={handleShowSearch}
          disabled={view === 'edit'}
        >
          Edit An Item
        </button>
        <button
          className="btn btn-warning"
          onClick={handleShowAll}
          disabled={view === 'all'}
        >
          All Stock
        </button>
        <button
          className="btn btn-success"
          onClick={handleAddProduct}
          disabled={view === 'add'}
        >
          Add Product
        </button>
        <button
          className="btn btn-info"
          onClick={handleAddCategory}
          disabled={view === 'addCategory'}
        >
          Add Category
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleAddBrand}
          disabled={view === 'addBrand'}
        >
          Add Brand
        </button>
        <button
          className="btn btn-dark"
          onClick={handleAllSales}
          disabled={view === 'allSales'}
        >
          All Sales
        </button>
      </div>
      
      {/* Conditionally render the components based on selected view */}
      {view === 'edit' && <EditStock />}
      {view === 'all' && <ShowAll />}
      {view === 'add' && <AddProduct />}
      {view === 'addCategory' && <AddCategory />}
      {view === 'addBrand' && <AddBrand />}
      {view === 'allSales' && <AllSales />}
    </div>
  );
}
