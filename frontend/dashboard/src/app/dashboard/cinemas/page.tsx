'use client';

import Table from "@/components/Table";
import { useSession } from "@/context/sessionContext";
import api from "@/services/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiPlus, BiSearch, BiTrash, BiEdit } from "react-icons/bi";
import {MdClose} from "react-icons/md";

type ICinemaData = {
    cinema_nome: string;
    cnpj: string;
    gerente_nome: string;
    gerente_id: string;
    telefone: string;
    rua: string;
    n_end: number;
    complemento?: string;
}

type Employees = {
    nome: string;
    sobrenome: string;
    cpf: string;
}

export default function CinemasPage(){
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [cinemasData, setCinemasData] = useState<ICinemaData[]>([]);
    const [cinemaSelected, setCinemaSelected] = useState(0);
    const [search, setSearch] = useState('');

    // Estados de edição de dados do cinema selecionado
    const [nome, setNome] = useState('');
    const [gerente, setGerente] = useState('');
    const [telefone, setTelefone] = useState('');
    const [CEP, setRua] = useState('');
    const [number, setNumber] = useState<number>();
    const [complement, setComplement] = useState<string | null>();

    const [employees, setEmployees] = useState<Employees[]>([]);

    const { sessionUser } = useSession();

    function toggleModal(cinemaIndex: number){
        if (Number.isNaN(cinemaIndex)){
            setNome('');
            setGerente('');
            setTelefone('');
            setRua('');
            setNumber(0);
            setComplement('');
        } else  {
            setNome(cinemasData[cinemaIndex].cinema_nome);
            setGerente(cinemasData[cinemaIndex].gerente_id);
            setTelefone(cinemasData[cinemaIndex].telefone);
            setRua(cinemasData[cinemaIndex].rua);
            setNumber(cinemasData[cinemaIndex].n_end);
            setComplement(cinemasData[cinemaIndex].complemento);
        }

        setCinemaSelected(cinemaIndex);
        setModalIsOpen(!modalIsOpen);
    }
  
    useEffect(() => {
        async function searchAllCinemas() {
            const { data, status } = await api.get('/admin/cinemas?search=');

            if (status === 200){
                setCinemasData(data);
            }
        }

        searchAllCinemas()
    },[]);

    async function searchCinemas(){
        const { data, status } = await api.get(`/admin/cinemas?search=${search}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionUser?.access_token}`
            }
        });

        if (status === 200){
            setCinemasData(data);
        }
    }

    useEffect(() => {
        if(modalIsOpen) {
            async function getAllEmployees(){
                const { data, status } = await api.get(`/admin/cinemas/employees/${cinemasData[cinemaSelected].cnpj}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionUser?.access_token}`
                    }
                });
                
                if (status === 200){
                    setEmployees(data);
                }
            }
    
            getAllEmployees()
        } else {
            setEmployees([]);
        }

    }, [modalIsOpen, cinemaSelected]);
    
    return (
        <section>
            {sessionUser ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Cinemas</h2>
                        <h3>Gerencie os cinemas da nossa rede</h3>
                    </div>

                    <div className="dash-content">
                        <h4>Procurando algo em especifico</h4>
                        <div className="dash-actions">
                            <div className="search-container">
                                <input type="text" placeholder="Buscar cinema" value={search} onChange={(e) => setSearch(e.target.value)} />
                                <button onClick={searchCinemas} className="search-btn" >
                                    Buscar
                                    <BiSearch size={20} />
                                </button>
                            </div>
                            <Link href="/dashboard/cinemas/new">
                                <button className="add-btn" >
                                    <BiPlus size={24} />
                                </button>
                            </Link>
                        </div>

                        {cinemasData.length > 0 && (
                            <Table
                                columns={['Nome', 'CNPJ', 'Gerente', 'Telefone', 'Endereço', 'Ações']}
                                data={cinemasData.map((cinema, index) => [
                                    cinema.cinema_nome,
                                    cinema.cnpj,
                                    cinema.gerente_nome,
                                    cinema.telefone,
                                    cinema.rua + ', ' + cinema.n_end + (cinema.complemento ? ' - ' + cinema.complemento : ''),
                                    
                                    <div key={cinema.cnpj} className="td-actions" >
                                        <Link href={`/dashboard/cinemas/${cinema.cnpj.replace(/\D/g, "")}`} key="view">Visualizar</Link>
                                        <button key="edit" onClick={() => toggleModal(index)}>
                                            <BiEdit size={18} />
                                        </button>
                                        <button key="delete">
                                            <BiTrash size={18} />
                                        </button>
                                    </div>
                                    
                                ])}
                            />
                        )}
                    </div>

                    {modalIsOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div>
                                        <h3>Editar dados</h3>
                                        <p>{cinemasData[cinemaSelected].cinema_nome}</p>
                                    </div>

                                    <button onClick={() => toggleModal(NaN)} >
                                        <MdClose size={18} />
                                    </button>
                                </div>

                                <div className="modal-body">
                                    <form action="">
                                        <div className="input-group">
                                            <label htmlFor="nome">Nome</label>
                                            <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="gerente">Gerente</label>
                                            <select id="gerente" value={gerente} onChange={(e) => setGerente(e.target.value)}>
                                                <option value={cinemasData[cinemaSelected].gerente_nome} disabled>
                                                    {cinemasData[cinemaSelected].gerente_nome} (Gerente atual)
                                                </option>
                                                {employees.map((employee, index) => (
                                                    <option key={index} value={employee.cpf} >
                                                        {employee.nome} {employee.sobrenome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {
                                            // Se o gerente for diferente do gerente atual, exibir campo para preencher email e senha
                                            gerente !== cinemasData[cinemaSelected].gerente_id && (
                                                <>
                                                    <div className="input-group">
                                                        <label htmlFor="email">E-mail do novo gerente</label>
                                                        <input type="email" id="email" />
                                                    </div>
                                                    <div className="input-group">
                                                        <label htmlFor="senha">Senha do novo gerente</label>
                                                        <input type="password" id="senha" />
                                                    </div>
                                                </>
                                            )
                                        }
                                        <div className="input-group">
                                            <label htmlFor="telefone">Telefone</label>
                                            <input type="text" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="CEP">CEP</label>
                                            <input type="text" id="CEP" value={CEP} onChange={(e) => setRua(e.target.value)} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="number">Número</label>
                                            <input type="text" id="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="complement">Complemento</label>
                                            <input type="text" id="complement" value={complement || ""} onChange={(e) => setComplement(e.target.value)} />
                                        </div>
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