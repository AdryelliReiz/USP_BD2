'use client';

import Table from "@/components/Table";
import { useSession } from "@/context/sessionContext";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";

const employeesData = [
    {
        cpf: "000.000.000-01",
        nome: "João da Silva",
        tipo: "Gerente",
        dataInicio: "01/01/2021",
        emailCorporativo: "joaodasilva@gmail.com",
    },
    {
        cpf: "000.000.000-03",
        nome: "José da Silva",
        tipo: "Funcionário",
        dataInicio: "01/01/2021",
        emailCorporativo: null,
    },
    {
        cpf: "000.000.000-04",
        nome: "Ana da Silva",
        tipo: "Funcionário",
        dataInicio: "01/01/2021",
        emailCorporativo: null,
    },
    {
        cpf: "000.000.000-05",
        nome: "Carlos da Silva",
        tipo: "Funcionário",
        dataInicio: "01/01/2021",
        emailCorporativo: null,
    },
    {
        cpf: "000.000.000-06",
        nome: "Antônio da Silva",
        tipo: "Funcionário",
        dataInicio: "01/01/2021",
        emailCorporativo: null,
    },
]

async function fetchCinemaId(params: Promise<{ slug: string }>) {
    const { slug } = await params;
    return slug;
}


export default function EmployeesPage({
    params,
  }: {
    params: Promise<{ slug: string }>
  }){

    const { sessionUser } = useSession();
    const [cinemaId, setCinemaId] = useState<string | null>(null);

    useEffect(() => {
        fetchCinemaId(params).then(setCinemaId);
    }, [params]);
    
    return (
        <section>
            {sessionUser ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Funcionários</h2>
                        <h3>Visualize os dados dos nossos funcionários</h3>
                    </div>

                    <div className="dash-content">
                        <h4>Procurando algo em especifico</h4>
                        <div className="dash-actions">
                            <div className="search-container">
                                <input type="text" placeholder="Buscar funcionário" />
                                <button className="search-btn" >
                                    Buscar
                                    <BiSearch size={20} />
                                </button>
                            </div>
                        </div>

                        <Table
                            columns={['Nome', 'CPF', 'Tipo', 'Data de contrato', 'Email corporativo ']}
                            data={employeesData.map((employee) => [
                                employee.nome,
                                employee.cpf,
                                employee.tipo,
                                employee.dataInicio,
                                employee.emailCorporativo,
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