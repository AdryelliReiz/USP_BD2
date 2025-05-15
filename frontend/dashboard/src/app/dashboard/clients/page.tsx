'use client';

import Table from "@/components/Table";
import { useSession } from "@/context/sessionContext";
import { BiSearch, BiTrash } from "react-icons/bi";

const clientsData = [
    {
        //nome, CPF, e-mail, telefone, endereço e saldo pontos
        cpf: "000.000.000-00",
        nome: "Adryelli Reis",
        email: "adry@gmail.com",
        telefone: "0000-0000",
        endereco: "Rua das Flores, 123",
        saldoPontos: 1000
    },
    {
        cpf: "000.000.000-01",
        nome: "João da Silva",
        email: "joao@gmail.com",
        telefone: "1111-1111",
        endereco: "Rua das Flores, 123",
        saldoPontos: 600
    },
    {
        cpf: "000.000.000-02",
        nome: "Maria da Silva",
        email: "maria@gmail.com",
        telefone: "2222-2222",
        endereco: "Rua das Flores, 123",
        saldoPontos: 360
    },
    {
        cpf: "000.000.000-03",
        nome: "José da Silva",
        email: "jose@gmail.com",
        telefone: "3333-3333",
        endereco: "Rua das Flores, 123",
        saldoPontos: 280
    },
    {
        cpf: "000.000.000-04",
        nome: "Ana da Silva",
        email: "ana@gmail.com",
        telefone: "4444-4444",
        endereco: "Rua das Flores, 123",
        saldoPontos: 450
    },
    {
        cpf: "000.000.000-05",
        nome: "Carlos da Silva",
        email: "carlos@gmail.com",
        telefone: "5555-5555",
        endereco: "Rua das Flores, 123",
        saldoPontos: 100
    },
    {
        cpf: "000.000.000-06",
        nome: "Antônio da Silva",
        email: "antonio@gmail.com",
        telefone: "6666-6666",
        endereco: "Rua das Flores, 123",
        saldoPontos: 500
    }
]

export default function ClientsPage(){
    const { sessionUser } = useSession();
    
    return (
        <section>
            {sessionUser ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Clientes</h2>
                        <h3>Busque por informações dos nossos clientes</h3>
                    </div>

                    <div className="dash-content">
                        <h4>Procurando algo em especifico</h4>
                        <div className="dash-actions">
                            <div className="search-container">
                                <input type="text" placeholder="Buscar cliente" />
                                <button className="search-btn" >
                                    Buscar
                                    <BiSearch size={20} />
                                </button>
                            </div>
                        </div>

                        <Table
                            columns={['Nome', 'CPF', 'E-mail', 'Telefone', 'Endereço', 'Saldo de Pontos', 'Ações']}
                            data={clientsData.map((employee) => [
                                employee.nome,
                                employee.cpf,
                                employee.email,
                                employee.telefone,
                                employee.endereco,
                                employee.saldoPontos,
                                
                                <div key={employee.cpf} className="td-actions" >
                                    <button key="delete">
                                        <BiTrash size={18} />
                                    </button>
                                </div>
                                
                            ])}
                        />
                    </div>
                </div>
            ) : (
                null
            )}
        </section>
    )
}