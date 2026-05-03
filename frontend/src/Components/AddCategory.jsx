import React, { useState } from 'react';

export default function AddCategory() {
  const [cname, setCname] = useState('');
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/addcategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cname, logo }),
      });

      if (response.ok) {
        alert('Category added successfully!');
        setCname('');
        setLogo('');
      } else {
        const errorData = await response.json();
        alert(`Failed to add category: ${errorData.message || 'Unknown error'}`);
        setCname(''); // Clear the form
        setLogo('');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('An error occurred while adding the category.');
      setCname(''); // Clear the form
        setLogo('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center">Add Category</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="cname" className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            id="cname"
            value={cname}
            onChange={(e) => setCname(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="logo" className="form-label">Logo URL</label>
          <input
            type="url"
            className="form-control"
            id="logo"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
}
