import { useRef, useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login.jsx';
import Category from './components/Category';
import Products from './components/Products';
import Cart from './components/Cart';
import Register from './components/Register';
import Checkout from './components/Checkout';
import Form from './components/Form';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    // Navigation State ('category', 'products', 'login', 'register')
    const [currentView, setCurrentView] = useState('category');

    // Data State
    const [products, setProducts] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    //const [loginUser, setLoginUser] = useState({ email: '', firstName: '', lastName: '' });
    const [loginUser, setLoginUser] = useState(() => {
        const savedUser = localStorage.getItem('loginUser');

        return savedUser
            ? JSON.parse(savedUser)
            : {
                email: '',
                firstName: '',
                lastName: '',
                role: ''
            };
    });
    //const [cartItems, setCartItems] = useState([]);
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [userCartItems, setUserCartItems] = useState([]);
    const [userPurchase, setUserPurchase] = useState([]);

    const loggedCartItems = userCartItems.filter((item) => {
        return item.email === loginUser.email
    });
    console.log('cart items', loggedCartItems);
    // Dialog Refs
    const dialog = useRef();
    const dialog1 = useRef();

    // Debugging user registration
    /*useEffect(() => {
        console.log("All Registered Users:", registeredUsers);
    }, [registeredUsers]);*/


    useEffect(() => {
        console.log("All Products:", products);
    }, [products]);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);


    useEffect(() => {
        console.log("Your Cart Items:", userCartItems);
    }, [userCartItems]);

    // Debugging purchases
    console.log('User Purchase', userPurchase);
    console.log('Cart Items', cartItems);

    async function loadProducts() {
        try {
            const response = await fetch(
                "http://localhost:5285/api/Products"
            );

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();

            setProducts(data);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadUserCartItems() {
        try {
            const response = await fetch(
                "http://localhost:5285/api/UserCartItems"
            );

            if (!response.ok) {
                throw new Error('Failed to fetch user cart items');
            }

            const datas = await response.json();

            const userItems = datas

            console.log('user cart items',userItems);
            /*
            const newItem = {
                id: item.item_id,
                name: item.item_name,
                price: item.price,
                quantity: 1
            };
            */

            setUserCartItems(datas);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadUserCartItems();
    }, []);

    async function transferGuestCart(email) {

        if (cartItems.length === 0) {
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }


        try {

            for (const item of cartItems) {

                const userCartItem = {
                    email: email,
                    item_name: item.name,
                    item_price: item.price,
                    item_quantity: item.quantity
                };

                const response = await fetch(
                    "http://localhost:5285/api/UserCartItems",
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(userCartItem)
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to transfer ${item.name} to database`
                    );
                }
            }

            // Reload the database cart
            await loadUserCartItems();

            // Guest cart is now stored in database
            setCartItems([]);
            localStorage.removeItem('cartItems');

        } catch (error) {
            console.error('Error transferring guest cart:', error);
        }
    }


    /*async function loadRegisteredUsers() {
        try {
            const response = await fetch(
                "http://localhost:5285/api/RegisteredUsers"
            );

            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }

            const data = await response.json();

            setRegisteredUsers(data);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadRegisteredUsers();
    }, []);
    */

    // Navigation Handlers
    function showRegister() { setCurrentView('register'); }
    function showLogin() { setCurrentView('login'); }
    function handleHome() { setCurrentView('category'); }

    function handleAddProduct() { setCurrentView('addproduct'); }

    
    function handleShowProducts(categoryData) {
        const category_products1 = products.filter((product) => {
            return product.category === categoryData;
        })
        setCategoryProducts(category_products1);
        setCurrentView('products');
    }
    
    /* same as above function
    function handleShowProducts(categoryData) {
        const category_products1 = products.filter((product) => {
            return product.category
                .split(',')
                .map(category => category.trim())
                .includes(categoryData)
        })
        setCategoryProducts(category_products1);
        setCurrentView('products');
    }
    */

    function handleClick() {
        showLogin();
    }

    function handleSignOut() {
        localStorage.removeItem('token'); // Clears the saved JWT security key
        localStorage.removeItem('loginUser');

        setLoginUser({ email: '', password: '', firstName: '', lastName: '' });
        handleHome();
    }

    // Cart & Checkout Handlers
    function handleShowCart() {
        dialog.current.showModal();
    }

    async function handleShowCheckout() {

        const email = loginUser.email;
        const firstName = loginUser.firstName;
        const lastName = loginUser.lastName;
        const totalCartItems = [...cartItems, ...loggedCartItems]
        const userItems = { email: email, first_name: firstName, last_name: lastName, cart_items: JSON.stringify(totalCartItems) };

        // Pull the saved secure key out of storage
        const token = localStorage.getItem('token'); 
        
        try {
            const response = await fetch(
                "http://localhost:5285/api/UserItems",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Sends token to C# Auth Pipeline
                    },
                    body: JSON.stringify(userItems)
                }
            );

            //const responseText = await response.text();

            /*
            if (response.status === 401) {
                
                alert("Your session has expired. Please sign in again.");
                showLogin();
                dialog.current.close();
                return;
            }
            */

            

            console.log("Status:", response.status);
            //console.log("Server response:", responseText);

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('You are not authorized to buy a product.');
                    return;
                }
                toast.error('Failed to buy product.');
                throw new Error('Failed to buy product');
                //`Request failed: ${response.status} - ${responseText}`
            }

            const user_items_data = await response.json();

            console.log('user items added:', user_items_data);
            //console.log("User data added:", responseText);

            dialog.current.close();
            setCartItems([]);
            setUserCartItems([]);
            dialog1.current.showModal();

        } catch (error) {
            console.error('Error buying product:', error);
        }

        toast.success("Items bought successfully");
    }

    /*
    function handleShowCheckout() {
        dialog.current.close();
        setUserPurchase({ loginUser, cartItems });
        setCartItems([]);
        dialog1.current.showModal();
    }*/

    
    function handleAddToCart(id) {
        const item = products.find((product) => product.item_id === id);
        if (!item) return; // Safeguard if item is not found

        const newItem = {
            id: item.item_id,
            name: item.item_name,
            price: item.price,
            quantity: 1
        };

        setCartItems(prevCartItems => {
            const existingItem = prevCartItems.find(cartItem => cartItem.id === id);

            if (existingItem) {
                return prevCartItems.map(cartItem =>
                    cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }

            return [...prevCartItems, newItem];
        });
    }

    async function handleAddToCart1(id) {
        const email = loginUser.email;

        const product = products.find((product) => {
            return product.item_id === id
        })

        if (!product) return;

        const item_name = product.item_name;
        const item_price = product.price;
        const item_quantity = 1;

        const userCartItems = { email: email, item_name: item_name, item_price: item_price, item_quantity: item_quantity };
        // Pull the saved secure key out of storage
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                "http://localhost:5285/api/UserCartItems",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Sends token to C# Auth Pipeline
                    },
                    body: JSON.stringify(userCartItems)
                }
            );

            //const responseText = await response.text();

            /*if (response.status === 401) {
                alert("Your session has expired. Please sign in again.");
                showLogin();
                dialog.current.close();
                return;
            }*/

            
            
            console.log("Status:", response.status);
            //console.log("Server response:", responseText);

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('You are not authorized to add the product in the cart.');
                    return;
                }
                throw new Error('Failed to add user cart items');
                //`Request failed: ${response.status} - ${responseText}`
            }

            const user_cart_items_data = await response.json();

            console.log('user cart items added:', user_cart_items_data);

            await loadUserCartItems();

                
        } catch (error) {
            console.error('Error adding user cart items:', error);
        }
    }

    function handleUpdateToCart(id, number) {
        setCartItems(prevCartItems =>
            prevCartItems
                .map(cartItem => cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity + number } : cartItem)
                .filter(cartItem => cartItem.quantity > 0)
        );
    }

    
    async function handleUpdateToCart1(id, number) {

        const item = userCartItems.find(
            item => item.item_id === id
        );

        if (!item) {
            return;
        }

        const newQuantity = item.item_quantity + number;

        const token = localStorage.getItem('token');

        try {

            // If quantity reaches 0, DELETE the item
            if (newQuantity <= 0) {

                const response = await fetch(
                    `http://localhost:5285/api/UserCartItems/${id}?email=${encodeURIComponent(item.email)}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to remove cart item');
                }

                // Remove it from React state
                setUserCartItems(prevItems =>
                    prevItems.filter(item => item.item_id !== id)
                );

                return;
            }

            // Otherwise update quantity
            const response = await fetch(
                `http://localhost:5285/api/UserCartItems/update/${id}?number=${number}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        email: item.email
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update cart quantity');
            }

            // Update React state
            setUserCartItems(prevItems =>
                prevItems.map(item =>
                    item.item_id === id
                        ? {
                            ...item,
                            item_quantity: item.item_quantity + number
                        }
                        : item
                )
            );

        }
        catch (error) {
            console.error('Error updating cart:', error);
        }
    }

    

    // Determine Main Content View
    let content;
    switch (currentView) {
        case 'login':
            content = <Login showRegister={showRegister} /*registeredUsers={registeredUsers}*/ handleHome={handleHome} setLoginUser={setLoginUser} cartItems={cartItems}
                transferGuestCart={transferGuestCart} />;
            break;
        case 'register':
            content = <Register showLogin={showLogin}/>;
            break;
        case 'products':
            content = <Products onAdd={handleAddToCart} onAdd1={handleAddToCart1} products={categoryProducts} setProducts={setProducts}
                setCategoryProducts={setCategoryProducts} setProductState={() => setCurrentView('category')}
                loginUser={loginUser}
            />;
            break;
        case 'category':
        default:
            content = <Category products={products} setProducts={setProducts} productState={currentView === 'products'} setProductState={() => { }} onShow={handleShowProducts} />;
            break;
        case 'addproduct':
            content = <Form handleHome={handleHome} loadProducts={loadProducts} />
            break;
    }

    return (
        <>
            <header id='header'>
                <div id='title' onClick={handleHome} style={{ cursor: 'pointer' }}>
                    <img src='shopping cart logo.png' alt='shopping cart' width='50px'/>
                    <h1>Guruzon</h1>
                </div>

                <div id='cart'>
                    {(loginUser.firstName !== '' && loginUser.role==='user')&&(
                        <>
                            <div className="user-dropdown">
                                <h2 className="dropdown-trigger" style={{ cursor: 'pointer' }}>
                                    Hi, {loginUser.firstName}
                                    <i className='fas fa-user-alt' style={{ fontSize: "24px", marginLeft: "8px" }} ></i>
                                </h2>
                                <div className="dropdown-menu">
                                    <button onClick={handleSignOut} className="signout-btn">
                                        Sign out
                                    </button>
                                </div>
                            </div>
                            <h2>|</h2>
                            <h2 onClick={handleShowCart} style={{ cursor: 'pointer' }}>Cart({loggedCartItems.length + cartItems.length})</h2>
                        </>
                    )}

                    {(loginUser.firstName !== '' && loginUser.role=== 'admin')&&(
                        <>
                            <div className="user-dropdown">
                                <h2 className="dropdown-trigger" style={{ cursor: 'pointer' }}>
                                    Hi, {loginUser.firstName}
                                    <i className='fas fa-user-alt' style={{ fontSize: "24px", marginLeft: "8px" }} ></i>
                                </h2>
                                <div className="dropdown-menu">
                                    <button onClick={handleSignOut} className="signout-btn">
                                        Sign out
                                    </button>
                                </div>
                            </div>
                            <h2>|</h2>
                            <h2 onClick={handleAddProduct}>Add Product</h2>
                        </>
                    )}

                    {loginUser.firstName === '' && (
                        <>
                            <h2 onClick={handleClick} style={{ cursor: 'pointer' }}>
                            Sign in<i className='fas fa-user-alt' style={{ fontSize: "24px", marginLeft: "8px" }} ></i>
                            </h2>
                            <h2>|</h2>
                            <h2 onClick={handleShowCart} style={{ cursor: 'pointer' }}>Cart({cartItems.length})</h2>
                        </>
                    )}
                    
                    
                </div>
            </header>

            <section>
                {content}
            </section>

            <section>
                <Cart
                    dialog={dialog}
                    cartItems={cartItems}
                    userCartItems={userCartItems}
                    loggedCartItems={loggedCartItems}
                    onUpdate={handleUpdateToCart}
                    onUpdate1={handleUpdateToCart1}
                    showRegister={showRegister}
                    showLogin={showLogin}
                    loginUser={loginUser}
                    showCheckout={handleShowCheckout}
                    serPurchase={userPurchase}
                    setUserPurchase={setUserPurchase}
                />
            </section>
            <section>
                <Checkout dialog1={dialog1} />
            </section>
            <section>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    theme="light"
                />
            </section>
        </>
    );
}

export default App;
