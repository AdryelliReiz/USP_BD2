'use client';

import Table from "@/components/Table";
import { useSession } from "@/context/sessionContext";
import Link from "next/link";
import { useState } from "react";
import { BiPlus, BiSearch, BiTrash, BiEdit } from "react-icons/bi";
import {MdClose} from "react-icons/md";

const employeesData = [
    {
        cpf: "000.000.000-00",
        nome: "Adryelli Reis",
        tipo: "Admin",
        cinema: "Cinemark",
        dataInicio: "01/01/2021",
        emailCorporativo: "joaodasilva@gmail.com",
    },
    {
        cpf: "000.000.000-01",
        nome: "João da Silva",
        tipo: "Gerente",
        cinema: "Cinemark",
        dataInicio: "01/01/2021",
        emailCorporativo: "joaodasilva@gmail.com",
    },
    {
        cpf: "000.000.000-02",
        nome: "Maria da Silva",
        tipo: "Gerente",
        cinema: "Cinepolis",
        dataInicio: "01/01/2021",
        emailCorporativo: "mariadasilva@gmail.com",
    },
    {
        cpf: "000.000.000-03",
        nome: "José da Silva",
        tipo: "Funcionário",
        cinema: "Cinemark",
        dataInicio: "01/01/2021",
        emailCorporativo: null,
    },
    {
        cpf: "000.000.000-04",
        nome: "Ana da Silva",
        tipo: "Funcionário",
        cinema: "Cinemark",
        dataInicio: "01/01/2021",
        emailCorporativo: null,
    },
    {
        cpf: "000.000.000-05",
        nome: "Carlos da Silva",
        tipo: "Funcionário",
        cinema: "Cinemark",
        dataInicio: "01/01/2021",
        emailCorporativo: null,
    },
    {
        cpf: "000.000.000-06",
        nome: "Antônio da Silva",
        tipo: "Funcionário",
        cinema: "Cinemark",
        dataInicio: "01/01/2021",
        emailCorporativo: null,
    },
]

export default function EmployeesPage(){
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [employeeSelected, setEmployeeSelected] = useState(NaN);
    // dados do funcionário selecionado
    const [name, setName] = useState('');
    const [cinema, setCinema] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { sessionUser } = useSession();

    function toggleModal(employeeIndex: number){

        if(!isNaN(employeeIndex)){
            setName(employeesData[employeeIndex].nome);
            setCinema(employeesData[employeeIndex].cinema);
            if(employeesData[employeeIndex].tipo === 'Admin'){
                setEmail(employeesData[employeeIndex].emailCorporativo || '');
                setPassword('');
            }
        }

        setEmployeeSelected(employeeIndex);
        setModalIsOpen(!modalIsOpen);
    }
    
    return (
        <section>
            {sessionUser ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Funcionários</h2>
                        <h3>Gerencie os dados dos nossos funcionários</h3>
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
                            
                            <Link href="/dashboard/employees/new">
                                <button className="add-btn">
                                    <BiPlus size={20} />
                                </button>
                            </Link>
                        </div>

                        <Table
                            columns={['Nome', 'CPF', 'Tipo', 'Trabalha em', 'Data de contrato', 'Email corporativo ','Ações']}
                            data={employeesData.map((employee, index) => [
                                employee.nome,
                                employee.cpf,
                                employee.tipo,
                                employee.cinema,
                                employee.dataInicio,
                                employee.emailCorporativo,
                                
                                <div key={employee.cpf} className="td-actions" >
                                    <button key="edit" onClick={() => toggleModal(index)}>
                                        <BiEdit size={18} />
                                    </button>
                                    <button key="delete">
                                        <BiTrash size={18} />
                                    </button>
                                </div>
                                
                            ])}
                        />
                    </div>

                    {modalIsOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div>
                                        <h3>Editar dados de um {employeesData[employeeSelected].tipo}</h3>
                                    </div>

                                    <button onClick={() => toggleModal(NaN)} >
                                        <MdClose size={18} />
                                    </button>
                                </div>

                                <div className="modal-body">
                                    <form action="">
                                        <div className="input-group">
                                            <label htmlFor="nome">Nome</label>
                                            <input type="text" id="nome" value={name} onChange={(e) => setName(e.target.value)}/>
                                        </div>

                                        {employeesData[employeeSelected].tipo === 'Funcionário' && (
                                            <div className="input-group">
                                                <label htmlFor="cinema">Ciname</label>
                                                <select id="gerente" value={cinema} onChange={(e) => setCinema(e.target.value)}>
                                                    <option value={employeesData[employeeSelected].cinema} disabled>
                                                        {employeesData[employeeSelected].cinema} (Gerente atual)
                                                    </option>
                                                    <option value="Cinemark">Cinemark</option>
                                                    <option value="Cinepolis">Cinepolis</option>
                                                    <option value="UCI">UCI</option>
                                                </select>
                                            </div>
                                        )}

                                        {(employeesData[employeeSelected].tipo === 'Admin' ||
                                        employeesData[employeeSelected].tipo === 'Gerente')  && (
                                            <>
                                                <div className="input-group">
                                                    <label htmlFor="email">Email corporativo</label>
                                                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="password">Senha</label>
                                                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                                </div>
                                            </>
                                        )}
                                        
                                    </form>
                                    
                                    <div className="modal-actions">
                                        <button onClick={() => toggleModal(NaN)}>Fechar</button>
                                        <button>Salvar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                null
            )}
        </section>
    )
}