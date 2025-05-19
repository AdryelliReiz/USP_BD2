import React, { createContext, useState, ReactNode } from 'react';

// Interface para ingressos selecionados
export interface SelectedTicket {
    name: string; // Nome do ingresso
    quantity: number; // Quantidade selecionada
    value: number; // Valor unitário
    tipo: 'monetario' | 'pontos'; // Tipo do ingresso
}
type Payment = "credito" | "debito" | "pix" | null;

// Interface do contexto
interface InformationsContextProps {
    tabActive: number;
    setTabActive: (tabActive: number) => void;
    CPF: string;
    setCPF: (CPF: string) => void;
    selectedTickets: SelectedTicket[]; // Ingressos selecionados
    setSelectedTickets: (tickets: SelectedTicket[]) => void; // Atualizar ingressos
    selectedCinema: string; // Cinema selecionado
    setSelectedCinema: (cinema: string) => void; // Atualizar cinema
    dateSelected: string;
    setDateSelected: (date: string) => void;
    selectedMovie: number;
    setSelectedMovie: (movie: number) => void;
    selectedMovieName: string;
    setSelectedMovieName: (movie: string) => void;
    selectedSession: string;
    setSelectedSession: (session: string) => void;
    selectedSessionTime: string;
    setSelectedSessionTime: (sessionTime: string) => void;
    selectedSeats: string[];
    setSelectedSeats: (seats: string[]) => void;
    payment: Payment;
    setPayment: (payment: Payment) => void;
}

// Criação do contexto
export const InformationsContext = createContext<InformationsContextProps>({} as InformationsContextProps);

interface InformationsProviderProps {
    children: ReactNode;
}

// Provedor do contexto
export const InformationsProvider: React.FC<InformationsProviderProps> = ({ children }) => {
    const [tabActive, setTabActive] = useState(0); // Controle de abas
    const [CPF, setCPF] = useState<string>(''); // CPF do usuário
    const [selectedCinema, setSelectedCinema] = useState<string>(''); // Cinema selecionado
    const [dateSelected, setDateSelected] = useState<string>("");
    const [selectedMovie, setSelectedMovie] = useState<number>(0);
    const [selectedMovieName, setSelectedMovieName] = useState<string>("");
    const [selectedSession, setSelectedSession] = useState<string>("");
    const [selectedSessionTime, setSelectedSessionTime] = useState<string>("");
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]); // Ingressos selecionados
    const [payment, setPayment] = useState<Payment>(null);

    return (
        <InformationsContext.Provider
            value={{
                tabActive,
                setTabActive,
                CPF,
                setCPF,
                selectedTickets,
                setSelectedTickets,
                selectedCinema,
                setSelectedCinema,
                dateSelected,
                setDateSelected,
                selectedMovie,
                setSelectedMovie,
                selectedMovieName,
                setSelectedMovieName,
                selectedSession,
                setSelectedSession,
                selectedSessionTime,
                setSelectedSessionTime,
                selectedSeats,
                setSelectedSeats,
                payment,
                setPayment
            }}
        >
            {children}
        </InformationsContext.Provider>
    );
};
