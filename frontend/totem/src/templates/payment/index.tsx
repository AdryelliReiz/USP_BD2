import { useContext } from "react";
import { InformationsContext } from "../../contexts/informationsProvider";
import "./styles.scss";
import api from "../../services/api";

export default function Payment() {
  const { tabActive, setTabActive, selectedTickets, selectedMovieName, selectedSeats, CPF, selectedSession } = useContext(InformationsContext);

  const totalValue = selectedTickets.filter((ticket) => ticket.tipo != 3).reduce((total, ticket) => total + ticket.quantity * ticket.value, 0);
  const totalPoints = selectedTickets.filter((ticket) => ticket.tipo == 3).reduce((total, ticket) => total + ticket.quantity * ticket.value, 0);

  const handlePayment = async (type: "credito" | "debito" | "pix" ) => {

    const paymentData = {
      cpf: CPF,
      session_id: selectedSession,
      payment_method: type,
      seats: selectedSeats.map((seat, index) => {
        const match = seat.match(/^([A-Z])(\d+)$/);
        return {
          seat_letter: match ? match[1] : "",
          seat_number: match ? match[2] : "",
          value: selectedTickets[index].value || 0,
          type: selectedTickets[index].tipo,
        };
      }),
    }

    await handleContirmPayment(paymentData);
  }

  async function handleConfirm() {
    const paymentData = {
      cpf: CPF,
      session_id: selectedSession,
      payment_method: "pontos",
      seats: selectedSeats.map((seat, index) => {
        const match = seat.match(/^([A-Z])(\d+)$/);
        return {
          seat_letter: match ? match[1] : "",
          seat_number: match ? match[2] : "",
          value: selectedTickets[index].value || 0,
          type: selectedTickets[index].tipo,
        };
      }),
    }

    await handleContirmPayment(paymentData);
  }

  async function handleContirmPayment(data: Any) {
    const { status } = await api.post("/totem/payment/", data);
    if (status === 201) {
      setTabActive(tabActive + 1);
    } else {
      alert("Erro ao processar pagamento. Por favor, tente novamente.");
    }
  }

  console.log(selectedSeats)
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
          <h4>{selectedMovieName}</h4>
          <h4>R$ {totalValue.toFixed(2)}</h4>
          {totalPoints > 0 && <h4>{totalPoints.toFixed(0)} pontos</h4>}
        </div>

        <div className="ingressos">
          {selectedTickets.map((ticket, index) => (
            <p key={index}>
              {ticket.tipo  != 3 ? <span>{ticket.quantity}x Ingresso {ticket.name} - R$ {ticket.value.toFixed(2)} cada</span>
                : <span>{ticket.quantity}x Ingresso {ticket.name} - {ticket.value} pontos cada</span>
            }
            </p>
          ))}
        </div>

        <div className="divisoria"></div>

        <div className="botoes">
          {selectedTickets.filter((ticket) => ticket.tipo != 3).length > 0 ? (
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
