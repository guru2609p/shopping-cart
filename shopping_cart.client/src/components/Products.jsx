import { useRef, useState } from 'react';

export default function Products({ onAdd, onAdd1, products, setProducts, setCategoryProducts,
    setProductState, loginUser }) {

    
    function handleShowCategory() {
        setProductState(false);
    }

    async function handleDelete(id) {
        // 1. Send the DELETE request to your C# API
        try {

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5285/api/Products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete the product from the database.');
            }

            // Remove from the main products list
            setProducts(prevProducts =>
                prevProducts.filter(product => product.item_id !== id)
            );

            // Remove from the currently displayed category list
            setCategoryProducts(prevProducts =>
                prevProducts.filter(product => product.item_id !== id)
            );

        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }

    const [search, setSearch] = useState('');

    //PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(2);

    // Filter the products first based on search state
    const filteredProducts = products.filter(product =>
        product.item_name.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const currentPosts = filteredProducts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(filteredProducts.length / postsPerPage);
    const pages = [];
    function paginate(page) {
        setCurrentPage(page)
    }

    for (let i = 0; i < totalPages; i++) {
        pages.push(i + 1)
    }


    //DIALOG
    const dialog = useRef();

    const [selectedItem, setSelectedItem] = useState(null);
    function showModal(item) {
        setSelectedItem(item);
        dialog.current.showModal();
    }

    function closeModal() {
        dialog.current.close();
        setSelectedItem(null);
    }

    //search
    function handleSearch(value) {
        setSearch(value);
        setCurrentPage(1);
    }

    return (
        <>
            <div id='search'>
                <input type='search' placeholder='Search or type URL' value={search} onChange={(event) => handleSearch(event.target.value)} />
            </div>

            <ul id='products'>
                {currentPosts.map((item) => (
                    <li key={item.item_id}>
                        <div id='item' >
                            <img src={item.item_image} alt={item.item_image}/>
                            <div id='sub1' onClick={() => showModal(item)}>
                                <h2>{item.item_name}</h2>
                                <h3>{item.item_brand}</h3>
                            </div>
                            <div id='sub2'>
                                {(loginUser.firstName !== '' && loginUser.role === 'user') &&(
                                    <>
                                        <p>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</p>
                                        <button onClick={() => onAdd1(item.item_id)}>ADD</button>
                                    </>
                                )
                                }
                                {loginUser.firstName === '' &&(
                                    <>
                                        <p>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</p>
                                        <button onClick={() => onAdd(item.item_id)}>ADD</button>
                                    </>
                                )
                                }
                                
                                
                                {(loginUser.firstName !== '' && loginUser.role === 'admin') &&
                                    <>
                                    <p>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</p>
                                    <button onClick={() => handleDelete(item.item_id)}>DELETE</button>
                                    </>
                                    
                                } 
                            </div>
                        </div>

                    </li>
                )
                )}
            </ul>

            <dialog ref={dialog} id='product_dialog'>
                {selectedItem && (
                    <>
                        <div onClick={closeModal}>
                            <img src={selectedItem.item_image} alt={selectedItem.item_name}  />
                            <h1> {selectedItem.item_name} </h1>
                            <p>{selectedItem.item_description?selectedItem.item_description:''}</p>
                        </div>
                        
                    </>
                )}
            </dialog>

            <div className='pagination'>
                <button onClick={() => paginate(1)}>Prev</button>
                {pages.map((page, index) => {
                    return (<button key={index} onClick={() => paginate(page)}>{page}</button>)
                })}
                <button onClick={() => paginate(totalPages)}>Next</button>
            </div>

            <div id='home' onClick={handleShowCategory}>
                <p>Back to Home</p>
                <i className='fas fa-angle-right' style={{ fontSize: '24px' }} />
            </div>

        </>
    );
}
