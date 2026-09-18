import {
    ELECTRONIC_ITEMS,
    BOOKS,
    MENS_CLOTHES,
    WOMENS_CLOTHES,
    BAGS_AND_LUGGAGES,
    HEALTH_ITEMS,
    HOMES_AND_KITCHEN
} from '../products.js';

export default function Category({ dialog1, productState, setProductState, products, setProducts,onShow }) {

   

    let content = (
        <div id='categories'>
            <div onClick={() => onShow('electronic items')}>
                <img src='electronics.jpg' />
                <div className="overlay">
                    <h1>Electronic Items</h1>
                </div>
            </div>
            <div onClick={() => onShow('books')} >
                <img src='books.jpg' />
                <div className="overlay">
                    <h1>Books</h1>
                </div>
            </div>
            <div onClick={() => onShow("men's clothes")}>
                <img src="mens clothes.jpg" />
                <div className="overlay">
                    <h1>Men's Clothes</h1>
                </div>
            </div>
            <div onClick={() => onShow("women's clothes")}>
                <img src="womens clothes.jpg" />
                <div className="overlay">
                    <h1>Women's Clothes</h1>
                </div>

            </div>
            <div onClick={() => onShow("bags and luggages")}>
                <img src='bags & luggages.jpg' />
                <div className='overlay'>
                    <h1>Bags & Luggages</h1>
                </div>

            </div>
            <div onClick={() => onShow("health items")}>
                <img src='health items.jpg' />
                <div className='overlay'>
                    <h1>Health Items</h1>
                </div>

            </div>
            <div onClick={() => onShow("home and kitchen")}>
                <img src='home and kitchen.jpg' />
                <div className='overlay'>
                    <h1>Home and Kitchen</h1>
                </div>

            </div>
        </div>
    )
    return (
        <>
            {content}
            
        </>
    );
}
