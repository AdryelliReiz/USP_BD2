import React, { createContext, useState, ReactNode } from 'react';

// Interface para ingressos selecionados
interface SelectedTicket {
    name: string; // Nome do ingresso
    quantity: number; // Quantidade selecionada
    value: number; // Valor unitário
}

// Interface do contexto
interface InformationsContextProps {
    tabActive: number;
    setTabActive: (tabActive: number) => void;
    CPF: string;
    setCPF: (CPF: string) => void;
    selectedTickets: SelectedTicket[]; // Ingressos selecionados
    setSelectedTickets: (tickets: SelectedTicket[]) => void; // Atualizar ingressos
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
    const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]); // Ingressos selecionados

    return (
        <InformationsContext.Provider
            value={{
                tabActive,
                setTabActive,
                CPF,
                setCPF,
                selectedTickets,
                setSelectedTickets,
            }}
        >
            {children}
        </InformationsContext.Provider>
    );
};
