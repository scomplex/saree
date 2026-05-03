import React, { useEffect, useState } from 'react';

export default function AddProduct() {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productName, setProductName] = useState('');
    const [allProductNames, setAllProductNames] = useState([]);
    const [availableProductNames, setAvailableProductNames] = useState([]);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [logo, setLogo] = useState('');
    const [dop, setDop] = useState('');
    const [vendor, setVendor] = useState('');
    const [mrp, setMrp] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New state for loading
    const [tax, setTax] = useState(0); // Tax rate in percentage
    const [extraCharges, setExtraCharges] = useState(0); // Additional charges
    const [actualPrice, setActualPrice] = useState(0);

    useEffect(() => {
        fetch('http://localhost:5000/api/getbrands')
            .then(response => response.json())
            .then(data => setBrands(data))
            .catch(error => console.error('Error fetching brands:', error));

        fetch('http://localhost:5000/api/getcategories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching categories:', error));

        fetch('http://localhost:5000/api/getproductnames')
            .then(response => response.json())
            .then(data => setAllProductNames(data))
            .catch(error => console.error('Error fetching product names:', error));
    }, []);
    useEffect(() => {
        // Calculate actual price whenever price, tax, or extraCharges changes
        const calculatedPrice = parseFloat(price || 0);
        const taxAmount = calculatedPrice * (tax / 100);
        setActualPrice(calculatedPrice + taxAmount + parseFloat(extraCharges || 0));
    }, [price, tax, extraCharges]);


    const handleProductNameChange = (e) => {
        const name = e.target.value;
        setProductName(name);

        if (name) {
            const filteredNames = allProductNames.filter((product) =>
                product.toLowerCase().includes(name.toLowerCase())
            );
            setAvailableProductNames(filteredNames);
        } else {
            setAvailableProductNames([]);
        }
    };

    const handleProductNameSelect = (name) => {
        setProductName(name);
        setAvailableProductNames([]); // Hide the suggestions
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        const requestBody = {
            pname: productName,
            bname: selectedBrand ? selectedBrand.bname : '',
            cname: selectedCategory ? selectedCategory.cname : '',
            price: parseFloat(actualPrice),
            quantity: parseInt(quantity),
            logo: logo || undefined,
            dop: dop || undefined,
            vendor: vendor || undefined,
            mrp: parseFloat(mrp) || undefined,
            baseprice:price,
            extracharges:extraCharges,
            tax:tax
        };

        fetch('http://localhost:5000/api/addproduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || 'Adding response is not received');

                // Reset all fields
                setProductName('');
                setSelectedBrand(null);
                setSelectedCategory(null);
                setPrice('');
                setQuantity('');
                setLogo('');
                setDop('');
                setVendor('');
                setMrp('');
                setAvailableProductNames([]);
                setTax(0);
                setExtraCharges(0);
                setActualPrice(0);
            })
            .catch(error => {
                console.error('Error adding product:', error);
                alert('Error adding product');
            })
            .finally(() => {
                setIsLoading(false); // Stop loading
            });
    };

    return (
        <div className='container mt-5'>
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} className='border p-4 rounded'>
                {/* Brand Dropdown */}
                <div className="mb-3">
                    <label htmlFor="brandSelect" className="form-label">Brand</label>
                    <select
                        id="brandSelect"
                        className="form-select"
                        onChange={(e) => setSelectedBrand(brands.find(brand => brand.bname === e.target.value))}
                        value={selectedBrand ? selectedBrand.bname : ''}
                        required
                    >
                        <option value="">Select Brand</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.bname}>
                                {brand.bname}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Dropdown */}
                <div className="mb-3">
                    <label htmlFor="categorySelect" className="form-label">Category</label>
                    <select
                        id="categorySelect"
                        className="form-select"
                        onChange={(e) => setSelectedCategory(categories.find(category => category.cname === e.target.value))}
                        value={selectedCategory ? selectedCategory.cname : ''}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.cname}>
                                {category.cname}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product Name Input */}
                <div className="mb-3">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input
                        type="text"
                        id="productName"
                        className="form-control"
                        value={productName}
                        onChange={handleProductNameChange}
                        required
                    />
                    {availableProductNames.length > 0 && (
                        <ul className="list-group bg-warning">
                            {availableProductNames.map((name, index) => (
                                <li
                                    key={index}
                                    className="list-group-item"
                                    onClick={() => handleProductNameSelect(name)} // Use the updated function
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Price Input */}
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Base Price</label>
                    <input
                      type="text" // Keeping as text to avoid input arrows
                      inputMode="numeric" // Opens numeric keypad on mobile, allows only numbers
                      pattern="^\d*\.?\d*$" // Ensures only integers are matched
                      id="price"
                      className="form-control"
                      value={price}
                      onChange={(e) => {
                          // Allow only numeric input
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) { // Regex allows only numbers
                              setPrice(value);
                          }
                      }}
                        style={{
                            // Inline styles to hide the number input arrows
                            MozAppearance: 'textfield', // For Firefox
                            WebkitAppearance: 'none', // For Chrome, Safari, Edge, Opera
                            margin: 0
                        }}
                        required
                    />
                </div>

                 {/* TAX Charges Input */}
                <div className="mb-3">
                    <label htmlFor="tax" className="form-label">Tax Applied (%)</label>
                    <select

                        id="tax"
                        className="form-select"
                        value={tax}
                        onChange={(e) => setTax(parseFloat(e.target.value))}
                    >
                        {[0, 5, 12, 18, 24, 28].map((rate) => (
                            <option key={rate} value={rate}>{rate}%</option>
                        ))}
                    </select>
                    <input
                     type="text" // Keeping as text to avoid input arrows
                     inputMode="numeric" // Opens numeric keypad on mobile, allows only numbers
                     pattern="^\d*\.?\d*$" // E
                        // type="number"
                        className="form-control mt-2"
                        value={tax}
                        onChange={(e) => {
                            // Allow only numeric input
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) { // Regex allows only numbers
                                setTax(value);
                            }
                        }}
                        placeholder="Enter custom tax rate"
                        style={{
                            // Inline styles to hide the number input arrows
                            MozAppearance: 'textfield', // For Firefox
                            WebkitAppearance: 'none', // For Chrome, Safari, Edge, Opera
                            margin: 0
                        }}
                    />
                </div>

                {/* Extra Charges Input */}
                <div className="mb-3">
                    <label htmlFor="extraCharges" className="form-label">Extra Charges (e.g., Transport)</label>
                    <input
                     type="text" // Keeping as text to avoid input arrows
                     inputMode="numeric" // Opens numeric keypad on mobile, allows only numbers
                     pattern="^\d*\.?\d*$" // E
                        // type="number"
                        id="extraCharges"
                        className="form-control"
                        value={extraCharges}
                        onChange={(e) => {
                            // Allow only numeric input
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) { // Regex allows only numbers
                                setExtraCharges(value);
                            }
                        }}
                        // onChange={(e) => setExtraCharges(e.target.value)}
                        style={{
                            // Inline styles to hide the number input arrows
                            MozAppearance: 'textfield', // For Firefox
                            WebkitAppearance: 'none', // For Chrome, Safari, Edge, Opera
                            margin: 0
                        }}
                        required
                    />
                </div>

                {/* Actual Price (Calculated) */}
                <div className="mb-3">
                    <label className="form-label">Actual Price</label>
                    <input
                        type="number"
                        className="form-control"
                        value={actualPrice.toFixed(2)}
                        disabled
                    />
                </div>

                {/* Quantity Input */}
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                    type="text" // Keeping as text to avoid input arrows
                    inputMode="numeric" // Opens numeric keypad on mobile, allows only numbers
                    pattern="\d*" // E
                        // type="number"
                        id="quantity"
                        className="form-control"
                        value={quantity}
                        step="1"
                        onChange={(e) => {
                            const value = e.target.value;
                            // Allow only integers by checking for a non-decimal number
                            if (/^\d*$/.test(value)) {
                                setQuantity(value);
                            }
                        }}
                        style={{
                            // Inline styles to hide the number input arrows
                            MozAppearance: 'textfield', // For Firefox
                            WebkitAppearance: 'none', // For Chrome, Safari, Edge, Opera
                            margin: 0
                        }}
                        required

                    />
                </div>

                {/* Logo Input (Optional) */}
                <div className="mb-3">
                    <label htmlFor="logo" className="form-label">Logo URL (Optional)</label>
                    <input
                        type="text"
                        id="logo"
                        className="form-control"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                    />
                </div>

                {/* Date of Purchase Input (Optional) */}
                <div className="mb-3">
                    <label htmlFor="dop" className="form-label">Date of Purchase (Optional)</label>
                    <input
                        type="date"
                        id="dop"
                        className="form-control"
                        value={dop}
                        onChange={(e) => setDop(e.target.value)}
                    />
                </div>

                {/* Vendor Input (Optional) */}
                <div className="mb-3">
                    <label htmlFor="vendor" className="form-label">Vendor (Optional)</label>
                    <input
                        type="text"
                        id="vendor"
                        className="form-control"
                        value={vendor}
                        onChange={(e) => setVendor(e.target.value)}
                    />
                </div>

                {/* MRP Input (Optional) */}
                <div className="mb-3">
                    <label htmlFor="mrp" className="form-label">MRP (Optional)</label>
                    <input
                        type="number"
                        id="mrp"
                        className="form-control"
                        value={mrp}
                        onChange={(e) => setMrp(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
}
