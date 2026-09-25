import { createPortal } from 'react-dom';
export default function Cart({ dialog, cartItems, userCartItems, loggedCartItems, onUpdate, onUpdate1, showRegister, showLogin, showCheckout, loginUser })
{
    function handleCloseCart() {
        dialog.current.close();
    }

    

    const totalPrice = cartItems.reduce((total, item) => {
        /*
        // 1. Check if price is a string (e.g., "?12,990.00")
        let cleanPrice = item.price;

        if (typeof item.price === 'string') {
            // This removes the ? and commas, but KEEPS the numbers and the decimal point '.'
            cleanPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        }

        // 2. If parsing fails for some reason, fallback to 0 to avoid breaking the cart
        if (isNaN(cleanPrice)) {
            cleanPrice = 0;
        }
        */
        return total + (item.price * item.quantity)
    }, 0);

    const totalPrice1 = loggedCartItems.reduce((total, item) => {
        return total + (item.item_price * item.item_quantity)
    }, 0);

    return createPortal(
        <dialog ref={dialog} id='dialog'>
            {(loginUser.firstName !== '' && loggedCartItems.length !== 0 && cartItems.length === 0) &&
                <div id='items'>
                    <h2>Your Cart</h2>
                    <div>
                        {loggedCartItems.map(item => (
                            <div key={item.item_id} id='cart-item'>
                                <div id="cart-item_name_price">
                                    <span id="cart-item-name">{item.item_name}</span>
                                    <span id="cart-item-price">- {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.item_price)}</span>
                                </div>
                                <div id='cart-item_button'>
                                    <button onClick={() => onUpdate1(item.item_id, 1)}>+</button>
                                    <p>{item.item_quantity}</p>
                                    <button onClick={() => onUpdate1(item.item_id, -1)}>-</button>
                                </div>
                            </div>
                        )
                        )}
                    </div>
                    <div>
                        <p>Total price: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalPrice1)}</p>
                    </div>
                    <div id='cart-button'>
                        <button onClick={() => handleCloseCart()}>Close</button>
                        <button onClick={() => showCheckout()}>Buy</button>
                    </div>
                </div>
            }

            {(loginUser.firstName === '' && cartItems.length===0) &&
                <>
                <div id='empty-cart'>
                    <p>Your cart is empty. Please add items in the cart. Login or register to buy.</p>
                    <button onClick={() => {
                        handleCloseCart();
                        showLogin();
                    }}>Sign in</button>
                    <button onClick={() => {
                        handleCloseCart();
                        showRegister();
                    }}>Sign up</button>
                </div>
                <div id='cart-button'>
                    <button onClick={() => handleCloseCart()}>Close</button>
                </div>
                </>
            }


            {(loginUser.firstName === '' && cartItems.length !== 0) &&
                <>
                <div id='items'>
                    <h2>Your Cart</h2>
                    <div>
                        {cartItems.map(item => (
                            <div key={item.id} id='cart-item'>
                                <div id="cart-item_name_price">
                                    <span id="cart-item-name">{item.name}</span>
                                    <span id="cart-item-price">- {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</span>
                                </div>
                                <div id='cart-item_button'>
                                    <button onClick={() => onUpdate(item.id, 1)}>+</button>
                                    <p>{item.quantity}</p>
                                    <button onClick={() => onUpdate(item.id, -1)}>-</button>
                                </div>
                            </div>
                        )
                        )}
                    </div>
                    <div>
                        <p>Total price: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalPrice)}</p>
                    </div>
                    <div id='cart-button'>
                        <button onClick={() => handleCloseCart()}>Close</button>
                        <button style={{
                            backgroundColor: '#beb700',
                            color: 'black',
                            border: 'none',
                            padding: '10px',
                            borderRadius: '8px',
                            fontFamily: 'Century Gothic'
                        }}
                        onClick={() => {
                            handleCloseCart();
                            showLogin();
                        }}>Sign in to Buy</button>
                    </div>
                </div>
                </>
            }

            {(loginUser.firstName !== '' && cartItems.length !== 0 && loggedCartItems.length !== 0) &&
                <>
                <div id='items'>
                    <h2>Your Cart</h2>
                    <div>
                        {loggedCartItems.map(item => (
                            <div key={item.item_id} id='cart-item'>
                                <div id="cart-item_name_price">
                                    <span id="cart-item-name">{item.item_name}</span>
                                    <span id="cart-item-price">- {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.item_price)}</span>
                                </div>
                                <div id='cart-item_button'>
                                    <button onClick={() => onUpdate1(item.item_id, 1)}>+</button>
                                    <p>{item.item_quantity}</p>
                                    <button onClick={() => onUpdate1(item.item_id, -1)}>-</button>
                                </div>
                            </div>
                        )
                        )}
                        {cartItems.map(item => (
                            <div key={item.id} id='cart-item'>
                                <div id="cart-item_name_price">
                                    <span id="cart-item-name">{item.name}</span>
                                    <span id="cart-item-price">- {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</span>
                                </div>
                                <div id='cart-item_button'>
                                    <button onClick={() => onUpdate(item.id, 1)}>+</button>
                                    <p>{item.quantity}</p>
                                    <button onClick={() => onUpdate(item.id, -1)}>-</button>
                                </div>
                            </div>
                        )
                        )}
                    </div>
                    <div>
                        <p>Total price: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalPrice + totalPrice1)}</p>
                    </div>
                    <div id='cart-button'>
                        <button onClick={() => handleCloseCart()}>Close</button>
                        <button onClick={() => showCheckout()}>Buy</button>
                    </div>
                </div>
                </>
            }

            {(loginUser.firstName !== '' && cartItems.length === 0 && loggedCartItems.length === 0) &&
                <>
                <p>Your cart is empty. Please add items in the cart.</p>
                <div id='cart-button'>
                <button onClick={() => handleCloseCart()}>Close</button>
                </div>
                </>
            }

            {(loginUser.firstName !== '' && cartItems.length !== 0 && loggedCartItems.length === 0) &&
                <>
                <div id='items'>
                    <h2>Your Cart</h2>
                    <div>
                        {cartItems.map(item => (
                            <div key={item.id} id='cart-item'>
                                <div id="cart-item_name_price">
                                    <span id="cart-item-name">{item.name}</span>
                                    <span id="cart-item-price">- {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</span>
                                </div>
                                <div id='cart-item_button'>
                                    <button onClick={() => onUpdate(item.id, 1)}>+</button>
                                    <p>{item.quantity}</p>
                                    <button onClick={() => onUpdate(item.id, -1)}>-</button>
                                </div>
                            </div>
                        )
                        )}
                    </div>
                    <div>
                        <p>Total price: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalPrice)}</p>
                    </div>
                    <div id='cart-button'>
                        <button onClick={() => handleCloseCart()}>Close</button>
                        <button onClick={() => showCheckout()}>Buy</button>
                    </div>
                </div>
                    
                </>
            }

        </dialog>,
        document.getElementById('modal')
    )

    /*
    return createPortal(
        <dialog ref={dialog} id='dialog'>

            {cartItems.length !== 0 &&
                <div id='items'>
                    <h2>Your Cart</h2>
                    <div>
                        {cartItems.map(item => (
                            <div key={item.id} id='cart-item'>
                                <div id="cart-item_name_price">
                                    <span id="cart-item-name">{item.name}</span>
                                    <span id="cart-item-price">- {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</span>
                                </div>
                                <div id='cart-item_button'>
                                    <button onClick={() => onUpdate(item.id, 1)}>+</button>
                                    <p>{item.quantity}</p>
                                    <button onClick={() => onUpdate(item.id, -1)}>-</button>
                                </div>
                            </div>
                        )
                        )}
                    </div>
                    <div>
                        <p>Total price: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalPrice)}</p>
                    </div>
                    {loginUser.firstName === '' &&
                        <>
                        <div id='cart-button'>
                            <button onClick={() => handleCloseCart()}>Close</button>
                            <button style={{
                                backgroundColor: '#beb700',
                                color: 'black',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '8px',
                                fontFamily: 'Century Gothic'
                            }}
                                onClick={() => {
                                    handleCloseCart();
                                    showLogin();
                                }}>Sign in to Buy</button>
                        </div>
                        </>
                    }

                    {loginUser.firstName !== '' &&
                        <>
                            <div id='cart-button'>
                                <button onClick={() => handleCloseCart()}>Close</button>
                                <button onClick={()=>showCheckout()}>Buy</button>
                            </div>
                        </>
                    }
                    
                </div>
            }

            {cartItems.length === 0 &&
                <>
                    <div id='empty-cart'>
                    
                    {loginUser.firstName === '' &&
                    <>
                    <p>Your cart is empty. Please add items in the cart. Login or register to buy.</p>
                    <button onClick={() => { 
                        handleCloseCart();
                        showLogin();
                    }}>Sign in</button>
                    <button onClick={() => {
                        handleCloseCart();
                        showRegister();
                        }}>Sign up</button>
                    </>
                    }
                    {loginUser.firstName !== '' &&
                        <p>Your cart is empty. Please add items in the cart.</p>
                    }
                    </div>

                    <div id='cart-button'>
                    <button onClick={() => handleCloseCart()}>Close</button>
                    </div>
                </>
            }

        </dialog>
        ,
        document.getElementById('modal')
    );
*/
}
