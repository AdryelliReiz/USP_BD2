import { useContext, useState } from "react";
import { InformationsContext } from "../../contexts/informationsProvider";
import TicketCard, { ITicketCardProps } from "../../components/ticketCard";
import "./styles.scss";

const tickets: Array<ITicketCardProps> = [
    { name: "Inteira", value: 24, type: "monetario" },
    { name: "Meia", value: 12, type: "monetario" },
    { name: "Club", value: 240, type: "pontos" },
];

export default function Tickets() {
    const { tabActive, setTabActive, setSelectedTickets } = useContext(InformationsContext);

    const [selected, setSelected] = useState<{ [key: string]: number }>({});

    const updateSelection = (name: string, quantity: number) => {
        setSelected((prev) => ({ ...prev, [name]: quantity }));
    };

    const confirmarIngressos = () => {
        const ingressosSelecionados = tickets
            .filter((ticket) => selected[ticket.name] > 0)
            .map((ticket) => ({
                name: ticket.name,
                quantity: selected[ticket.name],
                value: ticket.value,
            }));
        setSelectedTickets(ingressosSelecionados);
        setTabActive(tabActive + 1);
    };

    return (
        <div className="tickets-container">
            <div className="t-content">
                <div className="t-header">
                    <h1>CINEACH</h1>
                </div>

                <div className="t-title">
                    <h2>SELECIONE SEUS INGRESSOS</h2>
                </div>

                <div className="t-session-information">
                    <h3>Deadpool & Wolverine</h3>
                    <p><strong>Sessão - 20h30</strong></p>
                    <p>Assentos: J8, J9</p>
                </div>

                <div className="t-tickets">
                    {tickets.map((ticket, index) => (
                        <TicketCard
                            key={index}
                            name={ticket.name}
                            value={ticket.value}
                            type={ticket.type}
                            onQuantityChange={(quantity) => updateSelection(ticket.name, quantity)}
                        />
                    ))}
                </div>

                <div className="botoes-container">
                    <button className="voltar-button" onClick={() => setTabActive(tabActive - 1)}>
                        Voltar
                    </button>

                    <button className="ingressos-button" onClick={confirmarIngressos}>
                        Ingressos Selecionados
                    </button>
                </div>
            </div>
        </div>
    );
}
