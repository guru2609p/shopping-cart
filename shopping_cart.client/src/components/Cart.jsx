import { createPortal } from 'react-dom';
export default function Cart({ dialog, cartItems, onUpdate, showRegister, showLogin, showCheckout, loginUser })
{
    function handleCloseCart() {
        dialog.current.close();
    }

    const totalPrice = cartItems.reduce((total, item) => {

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

        return total + (cleanPrice * item.quantity)
    }, 0);

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
                                    <span id="cart-item-price">- {item.price}</span>
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
                            {/*<button onClick={() => showCheckout()}>Checkout</button>*/}
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
}
