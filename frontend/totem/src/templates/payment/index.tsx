import { useContext } from "react";
import { InformationsContext } from "../../contexts/informationsProvider";
import "./styles.scss";

export default function Payment() {
  const { tabActive, setTabActive, selectedTickets } = useContext(InformationsContext);

  const totalValue = selectedTickets.reduce((total, ticket) => total + ticket.quantity * ticket.value, 0);

  return (
    <div className="payment-container">
      <div className="p-content">
        <div className="p-header">
          <h1>CINEACH</h1>
        </div>

        <div className="p-title">
          <h2>Escolha a forma de pagamento</h2>
        </div>

        <div className="descricao">
          <h3><strong>Descrição</strong></h3>
          <h3><strong>Valor total</strong></h3>
        </div>

        <div className="divi"></div>

        <div className="valor">
          <h4>Deadpool & Wolverine</h4>
          <h4>R$ {totalValue.toFixed(2)}</h4>
        </div>

        <div className="ingressos">
          {selectedTickets.map((ticket, index) => (
            <p key={index}>
              {ticket.quantity}x Ingresso {ticket.name} - R$ {ticket.value.toFixed(2)} cada
            </p>
          ))}
        </div>

        <div className="divisoria"></div>

        <div className="botoes">
          <button onClick={() => setTabActive(tabActive + 1)}>Cartão de débito</button>
          <button onClick={() => setTabActive(tabActive + 1)}>Cartão de crédito</button>
          <button onClick={() => setTabActive(tabActive + 1)}>PIX</button>
        </div>

        <div className="voltar-container">
          <button className="voltar-button" onClick={() => setTabActive(tabActive - 1)}>Voltar</button>
        </div>
      </div>
    </div>
  );
}
