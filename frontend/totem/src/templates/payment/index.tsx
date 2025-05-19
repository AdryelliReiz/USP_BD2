import { useContext } from "react";
import { InformationsContext } from "../../contexts/informationsProvider";
import "./styles.scss";
import api from "../../services/api";

export default function Payment() {
  const { tabActive, setTabActive, selectedTickets, setPayment } = useContext(InformationsContext);

  const totalValue = selectedTickets.filter((ticket) => ticket.tipo == "monetario").reduce((total, ticket) => total + ticket.quantity * ticket.value, 0);
  const totalPoints = selectedTickets.filter((ticket) => ticket.tipo == "pontos").reduce((total, ticket) => total + ticket.quantity * ticket.value, 0);

  const handlePayment = (type: "credito" | "debito" | "pix" ) => {
    setPayment(type);
    setTabActive(tabActive + 1)
  }

  async function handleConfirm() {
    //const {status} = await api.post("/totem/payment", {});
  }

  console.log(selectedTickets)

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
          {totalPoints > 0 && <h4>{totalPoints.toFixed(0)} pontos</h4>}
        </div>

        <div className="ingressos">
          {selectedTickets.map((ticket, index) => (
            <p key={index}>
              {ticket.tipo  == 'monetario' ? <span>{ticket.quantity}x Ingresso {ticket.name} - R$ {ticket.value.toFixed(2)} cada</span>
                : <span>{ticket.quantity}x Ingresso {ticket.name} - {ticket.value} pontos cada</span>
            }
            </p>
          ))}
        </div>

        <div className="divisoria"></div>

        <div className="botoes">
          {selectedTickets.filter((ticket) => ticket.tipo == "monetario").length > 0 ? (
            <>
              <button onClick={() => handlePayment("debito")}>Cartão de débito</button>
              <button onClick={() => handlePayment("credito")}>Cartão de crédito</button>
              <button onClick={() => handlePayment("pix")}>PIX</button>
            </>
          ) : (
            <button onClick={handleConfirm}>Confirmar</button>
          )}
        </div>

        <div className="voltar-container">
          <button className="voltar-button" onClick={() => setTabActive(tabActive - 1)}>Voltar</button>
        </div>
      </div>
    </div>
  );
}
