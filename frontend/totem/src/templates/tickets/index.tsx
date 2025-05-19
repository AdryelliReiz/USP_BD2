import { useContext, useEffect, useState } from "react";
import { InformationsContext, SelectedTicket } from "../../contexts/informationsProvider";
import TicketCard from "../../components/ticketCard";
import "./styles.scss";
import api from "../../services/api";
import formatarHora from "../../utils/formatarHora";

type Ticket = {
    valor: number;
    nome: string;
    tipo_pago: "monetario" | "pontos";
}

type Data = {
    pontos: number
    ingressos: Ticket[]
}

export default function Tickets() {
    const { tabActive, setTabActive, selectedTickets, setSelectedTickets, CPF, selectedSeats, selectedSession, selectedMovieName, selectedSessionTime } = useContext(InformationsContext);

    const [allTickets, setAllTickets] = useState<Ticket[]>([]);
    const [pontos, setPontos] = useState<number>(0);  
   

    const updateSelection = (id: number, quantity: number, operation: "minus" | "plus") => {

        // Verifica se a quantidade fornecida é válida (não pode ser negativa)
        if (quantity < 0) return false;
    
        const totalSelectedTickets = selectedTickets.reduce((total, ticket) => total + ticket.quantity, 0);
    
        // Verifica se a nova quantidade ultrapassa o número de assentos disponíveis
        if (operation === "plus" && (selectedSeats.length - totalSelectedTickets - 1) < 0) {
            return false;
        }
    
        // Lógica de atualização dos ingressos
        let updatedTickets;
    
        const ticketExists = selectedTickets.some(ticket => ticket.name === allTickets[id].nome );
    
        if (ticketExists) {
            // Atualiza a quantidade do ingresso se ele já existir.
            updatedTickets = selectedTickets.map(ticket => {
                if (ticket.name === allTickets[id].nome) {
                    const newQuantity = operation === "plus" ? ticket.quantity + 1 : ticket.quantity - 1;
                    if (newQuantity <= 0) {
                        return null; // Marca para remoção se a quantidade for zero.
                    }
                    return { ...ticket, quantity: newQuantity };
                }
                return ticket;
            }).filter(Boolean); // Remove os tickets com quantidade zero.
        } else if (operation === "plus") {
            // Adiciona um novo ingresso se ele ainda não estiver na lista (somente ao adicionar).
            updatedTickets = [...selectedTickets, { name: allTickets[id].nome, value: allTickets[id].valor, tipo: allTickets[id].tipo_pago, quantity: 1 }];
        } else {
            // Não faz nada se tentarmos remover um ingresso que não existe.
            return false;
        }
    
        // Atualiza o estado com a nova lista de ingressos selecionados.
        setSelectedTickets(updatedTickets.filter(ticket => ticket !== null) as SelectedTicket[]);
    
        return true;
    };

    const confirmarIngressos = () => {
        if(selectedTickets.reduce((total, ticket) => total + ticket.quantity, 0) === 0 
            || selectedTickets.reduce((total, ticket) => total + ticket.quantity, 0) !== selectedSeats.length
        ) return;

        setTabActive(tabActive + 1);
    };

    useEffect(() => {
        // seta os ingressos selecionados para null
        setSelectedTickets([]);

        async function fetchTickets() {
            const { data } = await api.get<Data>(`/totem/tickets/${selectedSession}/?cpf=${CPF}`);

            setAllTickets(data.ingressos);
            setPontos(data.pontos);
        }

        fetchTickets();
    }, [])

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
                    <h3>{selectedMovieName}</h3>
                    <p><strong>Sessão - {formatarHora(selectedSessionTime)}</strong></p>
                    <p>Assentos: {selectedSeats.map(seat => <span>{seat} </span>)}</p>
                </div>

                <div className="t-tickets">
                    {allTickets.map((ticket, index) => (
                        <TicketCard
                            key={index}
                            name={ticket.nome}
                            value={ticket.valor}
                            type={ticket.tipo_pago}
                            onQuantityChange={(quantity, operation) => updateSelection(index, quantity, operation)}
                        />
                    ))}
                </div>

                <div className="botoes-container">
                    <button className="voltar-button" onClick={() => setTabActive(tabActive - 1)}>
                        Voltar
                    </button>

                    {CPF != "" && (
                        <div className="pontos">
                            <p>Pontos: {pontos}</p>
                        </div>
                    )}

                    <div className="tickets-i">
                        <p>{selectedTickets.reduce((total, seat) => total + seat.quantity, 0)} Ingressos Selecionados</p>

                        <button className="ingressos-button" onClick={confirmarIngressos}>
                            Comprar ingressos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
