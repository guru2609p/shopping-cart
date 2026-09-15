import { useRef, useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login.jsx';
import Category from './components/Category';
import Products from './components/Products';
import Cart from './components/Cart';
import Register from './components/Register';
import Checkout from './components/Checkout';

function App() {



    // Navigation State ('category', 'products', 'login', 'register')
    const [currentView, setCurrentView] = useState('category');

    // Data State
    const [products, setProducts] = useState(undefined);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [loginUser, setLoginUser] = useState({ email: '', firstName: '', lastName: '' });
    const [cartItems, setCartItems] = useState([]);
    const [userPurchase, setUserPurchase] = useState([]);

    // Dialog Refs
    const dialog = useRef();
    const dialog1 = useRef();

    // Debugging user registration
    /*useEffect(() => {
        console.log("All Registered Users:", registeredUsers);
    }, [registeredUsers]);*/

    // Debugging purchases
    console.log('User Purchase', userPurchase);
    console.log('Cart Items', cartItems);

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

    function handleShowProducts(categoryData) {
        setProducts(categoryData);
        setCurrentView('products');
    }

    function handleClick() {
        showLogin();
    }

    function handleSignOut() {
        localStorage.removeItem('token'); // Clears the saved JWT security key
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

        const userItems = { email: email, first_name: firstName, last_name: lastName, cart_items: JSON.stringify(cartItems) };

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

            if (response.status === 401) {
                alert("Your session has expired. Please sign in again.");
                showLogin();
                dialog.current.close();
                return;
            }

            console.log("Status:", response.status);
            //console.log("Server response:", responseText);

            if (!response.ok) {
                throw new Error('Failed to add user items');
                //`Request failed: ${response.status} - ${responseText}`
            }

            const user_items_data = await response.json();

            console.log('user items added:', user_items_data);
            //console.log("User data added:", responseText);

            dialog.current.close();
            setCartItems([]);
            dialog1.current.showModal();

        } catch (error) {
            console.error('Error adding registered user:', error);
        }
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

    function handleUpdateToCart(id, number) {
        setCartItems(prevCartItems =>
            prevCartItems
                .map(cartItem => cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity + number } : cartItem)
                .filter(cartItem => cartItem.quantity > 0)
        );
    }

    // Determine Main Content View
    let content;
    switch (currentView) {
        case 'login':
            content = <Login showRegister={showRegister} /*registeredUsers={registeredUsers}*/ handleHome={handleHome} setLoginUser={setLoginUser} />;
            break;
        case 'register':
            content = <Register showLogin={showLogin}/>;
            break;
        case 'products':
            content = <Products onAdd={handleAddToCart} products={products} setProductState={() => setCurrentView('category')} />;
            break;
        case 'category':
        default:
            content = <Category products={products} setProducts={setProducts} productState={currentView === 'products'} setProductState={() => { }} onShow={handleShowProducts} />;
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
                    {loginUser.firstName !== '' && (
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
                    )}

                    {loginUser.firstName === '' && (
                        <h2 onClick={handleClick} style={{ cursor: 'pointer' }}>
                            Sign in<i className='fas fa-user-alt' style={{ fontSize: "24px", marginLeft: "8px" }} ></i>
                        </h2>
                    )}
                    <h2>|</h2>
                    <h2 onClick={handleShowCart} style={{ cursor: 'pointer' }}>Cart({cartItems.length})</h2>
                </div>
            </header>

            <section>
                {content}
            </section>

            <section>
                <Cart
                    dialog={dialog}
                    cartItems={cartItems}
                    onUpdate={handleUpdateToCart}
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
        </>
    );
}

export default App;
