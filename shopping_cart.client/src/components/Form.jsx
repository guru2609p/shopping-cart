import React, { useState } from 'react'
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Form({ handleHome, loadProducts }) {

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    console.log(selectedCategories);
    const options = [
        { value: "electronic items", label: 'Electronic Items' },
        { value: "books", label: 'Books' },
        { value: "men's clothes", label: "Men's Clothes" },
        { value: "women's clothes", label: "Women's Clothes" },
        { value: "bags and luggages", label: 'Bags and Luggages' },
        { value: "health items", label: 'Health Items' },
        { value: "home and kitchen", label: 'Home And Kitchen' }
    ]

    
    const handleFileChange = (event) => {
        // 1. Get the list of selected files (event.target.files)
        const files = event.target.files;

        // 2. Check if the user actually selected a file
        if (files.length > 0) {
            const selectedFile = files[0];

            // 3. Read the filename string
            console.log("Filename:", selectedFile.name);
            console.log("File size (bytes):", selectedFile.size);
            console.log("File type:", selectedFile.type);
        }
    };

    async function handleSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        const itemName = fd.get('item_name');
        const itemDescription= fd.get('item_description');
        const itemBrand = fd.get('item_brand');
        const price = fd.get('price');
        const itemImage = fd.get('item_image');

        // 2. UPDATED: Map selected category objects to an array of raw strings
        const categoriesArray = selectedCategories
            .map(option => option.value)
            .join(',');


        // This payload schema maps directly to your database column naming scheme
        const newProduct = {
            item_name: itemName,
            item_description: itemDescription,
            item_brand: itemBrand,
            price: price,
            category: categoriesArray,
            item_image: itemImage.name
        };

        // 2. REMOVED: The client-side array search has been deleted for efficiency and security

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                "http://localhost:5285/api/Products",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newProduct)
                }
            );

            console.log("Status:", response.status);

            // 3. ADDED: Catch if the C# server rejects the email due to a duplicate record entry
            if (response.status === 409) {
                setValidationErrors(['This email address is already registered. Please login instead.']);
                return;
            }

            if (!response.ok) {

                if (response.status === 401) {
                    toast.error('You are not authorized to add a product.');
                    return;
                }

                toast.error('Failed to add product.');
                /*throw new Error('Failed to add product');*/
                /*return;*/
            }

            const registered_product = await response.json();
            console.log('product added:', registered_product);


            await loadProducts();


            event.target.reset();
            setSelectedCategories([]); 
            handleHome();

        } catch (error) {
            console.error('Error adding product:', error);
            /*setValidationErrors(['Failed to establish a network connection to the server.']);*/
            toast.error('Failed to add product.');
            
        }

        toast.success("Product added successfully");
    }

    return (
        <>
            <div id='form-page'>
                <div id='form'>
                    <h1>Form</h1>
                    <form onSubmit={handleSubmit}>
                        <div id='form-inputs'>
                            <div>
                                <label>Name:</label>
                                <input required type='text' name="item_name" placeholder='Enter item name'></input>
                            </div>
                            <div>
                                <label>Description:</label>
                                <textarea required name="item_description" /*style={{ width: '200px', height: '100px' }}*/ ></textarea>
                            </div>
                            <div>
                                <label>Brand:</label>
                                <input required type='text' name='item_brand' placeholder='Enter Brand'></input>
                            </div>
                            <div>
                                <label>Price:</label>
                                <input required type='number' name='price' placeholder='Enter Price'></input>
                            </div>
                            <div>
                                <label>Category:</label>
                                {/*<input required type='text' name="category" placeholder='Enter Category'></input>*/}
                                {/* 4. UPDATED: Connected value and onChange handlers */}
                                <Select 
                                    id='select'
                                    value={selectedCategories}
                                    onChange={setSelectedCategories}
                                    isMulti
                                    name="category"
                                    options={options}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />

                                
                            </div>
                            <div>
                                <label>Attach Image:</label>
                                <input required type='file' name='item_image' onChange={handleFileChange} />
                            </div>
                            <div id='add-product-buttons'>
                                <button id='add-product-button' type='submit'>Add Product</button>
                            </div>
                        </div>
                         <div>
                                {/*
                                <ul style={{ color: 'red', listStyleType: "none" }}>
                                    {validationErrors.map((error, index) => {
                                        return (<li key={index}>{error}</li>)
                                    })}
                                </ul>
                                */}
                         </div>
                    </form>
                </div>
            </div>
        </>
    );
}

