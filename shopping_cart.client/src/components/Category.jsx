import { useState,useRef } from "react";
import Products from './Products.jsx';
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
            <div onClick={() => onShow(ELECTRONIC_ITEMS)}>
                <img src='electronics.jpg' />
                <div className="overlay">
                    <h1>Electronic Items</h1>
                </div>
            </div>
            <div onClick={() => onShow(BOOKS)} >
                <img src='books.jpg' />
                <div className="overlay">
                    <h1>Books</h1>
                </div>
            </div>
            <div onClick={() => onShow(MENS_CLOTHES)}>
                <img src="mens clothes.jpg" />
                <div className="overlay">
                    <h1>Men's Clothes</h1>
                </div>
            </div>
            <div onClick={() => onShow(WOMENS_CLOTHES)}>
                <img src="womens clothes.jpg" />
                <div className="overlay">
                    <h1>Women's Clothes</h1>
                </div>

            </div>
            <div onClick={() => onShow(BAGS_AND_LUGGAGES)}>
                <img src='bags & luggages.jpg' />
                <div className='overlay'>
                    <h1>Bags & Luggages</h1>
                </div>

            </div>
            <div onClick={() => onShow(HEALTH_ITEMS)}>
                <img src='health items.jpg' />
                <div className='overlay'>
                    <h1>Health Items</h1>
                </div>

            </div>
            <div onClick={() => onShow(HOMES_AND_KITCHEN)}>
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
