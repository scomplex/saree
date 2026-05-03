import React, { useState } from 'react';

export default function AddBrand() {
  const [bname, setBname] = useState('');
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/addbrand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bname, logo }),
      });

      if (response.ok) {
        alert('Brand added successfully!');
        setBname('');
        setLogo('');
      } else {
        const errorData = await response.json();
        alert(`Failed to add brand: ${errorData.message || 'Unknown error'}`);
        setBname(''); // Clear the form
        setLogo('');
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      alert('An error occurred while adding the brand.');
      setBname(''); // Clear the form
        setLogo('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center">Add Brand</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="bname" className="form-label">Brand Name</label>
          <input
            type="text"
            className="form-control"
            id="bname"
            value={bname}
            onChange={(e) => setBname(e.target.value)}
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
          {loading ? 'Loading...' : 'Add Brand'}
        </button>
      </form>
    </div>
  );
}
