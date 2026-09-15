import { useRef, useState } from 'react';
export default function Products({ onAdd, products, setProductState }) {

    function handleShowCategory() {
        setProductState(false);
    }

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
    return (
        <>
            <ul id='products'>
                {products.map((item) => (
                    <li key={item.item_id}>
                        <div id='item' >
                            <img src={item.item_image} alt={item.item_image}/>
                            <div id='sub1' onClick={() => showModal(item)}>
                                <h2>{item.item_name}</h2>
                                <h3>{item.item_brand}</h3>
                            </div>
                            <div id='sub2'>
                                <p>{item.price}</p>
                                <button onClick={()=>onAdd(item.item_id)}>ADD</button>
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

            <div id='home' onClick={handleShowCategory}>
                <p>Back to Home</p>
                <i className='fas fa-angle-right' style={{ fontSize: '24px' }} />
            </div>

        </>
    );
}
