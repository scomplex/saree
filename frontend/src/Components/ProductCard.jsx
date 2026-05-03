import React, { useState } from 'react';

export default function ProductCard({ pname, bname, cname, price, pimage,aquantity }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [sellingPrice, setSellingPrice] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [quantity, setQuantity] = useState('');

  const [loading, setLoading] = useState(false); // State for loading

  const handleSellClick = () => setShowOverlay(true);
  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setSellingPrice(''); 
    setQuantity('');
    setSalesperson('')
    // Reset selling price when closing the overlay
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toLocaleDateString('en-GB'); // Format: dd/mm/yyyy

    const saleData = {
      pname,
      bname,
      cname,
      sellingprice: sellingPrice,
      dos: today,
      salesperson,
      quantity:quantity
    };

    setLoading(true); // Set loading state to true

    try {
      const response = await fetch('http://localhost:5000/api/sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      });

      const responseText = await response.json(); // Get response text

      if (response.ok) {
        alert('Sale recorded successfully!');
        handleCloseOverlay(); // Close overlay on success
      } else {
        alert(`Failed to record the sale: ${responseText.error}`); // Alert the error
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while recording the sale.');
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  return (
    <div style={{ position: 'relative', width: '160px' ,padding:"0px"}}>
      <div className="card" style={cardStyle}>
        <img
          className="card-img-top"
          src={pimage}
          alt="Product"
          style={{ width: '160px', height: '100px', objectFit: 'contain' }} // Maintain image size
        />
        <div className="card-body d-flex flex-column" style={{ flex: '1', height: '150px' }}>
          <div className='d-flex justify-content-between' style={{fontSize:"10px"}} >
            <div style={{background:"#F1EFEC",color:"#123458",border:"1px solid #123458" , padding:"5px", borderRadius:"17px"}}>{bname}</div>
            <div style={{background:"#ded3db",color:"#6A1E55",border:"1px solid #6A1E55" , padding:"5px", borderRadius:"17px"}}>{cname}</div>

          </div>
          <p className="card-title text-align-center" style={{
            textAlign: "center",
            fontSize: "13px", // Font size


            whiteSpace: "normal", // Allow text to wrap
            marginBottom: 'auto', // Push button to the bottom
          }}>{pname}</p>
          <h6 className="card-text text-align-center" style={{textAlign:"center"}}>₹{price}</h6>
          <h6 className="card-text text-align-center" style={{textAlign:"center",color:"red"}}>Quantity-{aquantity}</h6>
          <button className="btn btn-success" onClick={handleSellClick}>
            Sell
          </button>
        </div>
      </div>

      {showOverlay && (
        <div style={overlayStyle}>
          <div style={formContainerStyle}>
            <button style={closeButtonStyle} onClick={handleCloseOverlay}>
              X
            </button>
            <h3>Sell {pname}</h3>
            <h6 className='text-muted'>{bname}   {cname}</h6>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Price Sold</label>
                <input
                  type="number"
                  className="form-control"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Who Sold</label>
                <select
                  className="form-control"
                  value={salesperson}
                  onChange={(e) => setSalesperson(e.target.value)}
                >
                  <option value="" selected disabled>Select Person</option>
                  <option value="Mahesh">Mahesh</option>
                  <option value="Chiru">Chiru</option>
                  <option value="Kishan">Kishan</option>
                  <option value="Ajay">Ajay</option>
                  <option value="Jitendra">Jitendra</option>
                  <option value="Others">Others</option>
                </select>

              </div>

              <button type="submit" className="btn btn-success mt-3" disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const cardStyle = {
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  transition: '0.3s',
  borderRadius: '10px',
  height: '300px', // Set a fixed height for the card
  display: 'flex',
  flexDirection: 'column',
  padding:"0px"
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const formContainerStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  width: '400px',
  position: 'relative',
  boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
};
