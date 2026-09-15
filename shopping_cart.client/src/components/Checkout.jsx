import { createPortal } from 'react-dom';
export default function Checkout({ dialog1 }) {

    function closeCheckout() {
        dialog1.current.close();
    }
    return createPortal(
        <dialog ref={dialog1} id='dialog1'>
            <div>
                <div>
                    <h2>Success!</h2>
                    <p>Your Order was submitted sucessfully.</p>
                    <p>We will get back to you with more details via email within the next few minutes.</p>
                </div>
                <div id="success-button">
                    <button onClick={closeCheckout}>Close</button>
                </div>
            </div>
        </dialog>,
        document.getElementById('modal')
    );
}

