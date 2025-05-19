import React, { useState } from "react";
import "./styles.scss";

// Interface para o componente TicketCard
export interface ITicketCardProps {
    name: string; // Nome do ingresso
    value: number; // Valor do ingresso
    type: "monetario" | "pontos"; // Tipo (monetário ou pontos)
    onQuantityChange: (quantity: number, operation: "minus" | "plus") => boolean; // Callback para mudança de quantidade
}

const TicketCard: React.FC<ITicketCardProps> = ({ name, value, type, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(0);

    const handleIncrement = () => {
        const newQuantity = quantity + 1;
        
       if(onQuantityChange(newQuantity, "plus")) {
            setQuantity(newQuantity);
        }
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            if(onQuantityChange(newQuantity, "minus")) {
                setQuantity(newQuantity);
            }
        }
    };

    return (
        <div className="ticket-card">
            <h3>{name}</h3>
            <p>{type === "monetario" ? `R$ ${value.toFixed(2)}` : `${value} pontos`}</p>
            <div className="quantity-controls">
                <button onClick={handleDecrement} disabled={quantity <= 0}>-</button>
                <span>{quantity}</span>
                <button onClick={handleIncrement}>+</button>
            </div>
        </div>
    );
};

export default TicketCard;
