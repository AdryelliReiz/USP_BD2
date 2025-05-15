'use client';

import Table from "@/components/Table";
import { useSession } from "@/context/sessionContext";
import api from "@/services/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiPlus, BiSearch, BiTrash, BiEdit } from "react-icons/bi";
import {MdClose} from "react-icons/md";

const cinemasData = [
    {
        nome: 'Cineflix',
        cpf: '00.000.000/0000-00',
        gerente: 'João da Silva',
        gerenteId: '000.000.000-01',
        telefone: '(00) 0000-0000',
        endereco: 'Rua dos Cinemas, 0000',
    },
    {
        nome: 'Cinemark',
        cpf: '00.000.000/0000-00',
        gerente: 'Maria da Silva',
        gerenteId: '000.000.000-02',
        telefone: '(00) 0000-0000',
        endereco: 'Rua dos Cinemas, 0000',
    },
    {
        nome: 'Cineart',
        cpf: '00.000.000/0000-00',
        gerente: 'José da Silva',
        gerenteId: '000.000.000-03',
        telefone: '(00) 0000-0000',
        endereco: 'Rua dos Cinemas, 0000',
    },
    {
        nome: 'Cinépolis',
        cpf: '00.000.000/0000-00',
        gerente: 'Ana da Silva',
        gerenteId: '000.000.000-04',
        telefone: '(00) 0000-0000',
        endereco: 'Rua dos Cinemas, 0000',
    },
    {
        nome: 'CineSystem',
        cpf: '00.000.000/0000-00',
        gerente: 'Carlos da Silva',
        gerenteId: '000.000.000-05',
        telefone: '(00) 0000-0000',
        endereco: 'Rua dos Cinemas, 0000',
    },
    {
        nome: 'CineShow',
        cpf: '00.000.000/0000-00',
        gerente: 'Antônio da Silva',
        gerenteId: '000.000.000-06',
        telefone: '(00) 0000-0000',
        endereco: 'Rua dos Cinemas, 0000',
    },
]

export default function CinemasPage(){
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [cinemaSelected, setCinemaSelected] = useState(NaN);
    // Estados de edição de dados do cinema selecionado
    const [nome, setNome] = useState('');
    const [gerente, setGerente] = useState('');
    const [telefone, setTelefone] = useState('');
    const [CEP, setCEP] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');

    const { sessionUser } = useSession();

    function toggleModal(cinemaIndex: number){
        if (Number.isNaN(cinemaIndex)){
            setNome('');
            setGerente('');
            setTelefone('');
            setCEP('');
            setNumber('');
            setComplement('');
        } else  {
            setNome(cinemasData[cinemaIndex].nome);
            setGerente(cinemasData[cinemaIndex].gerenteId);
            setTelefone(cinemasData[cinemaIndex].telefone);
            setCEP('');
            setNumber('');
            setComplement('');
        }

        setCinemaSelected(cinemaIndex);
        setModalIsOpen(!modalIsOpen);
    }

    //useEffect(() => {
    //    const {} = api.get('/cinemas');
    //W}, [])
    
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
                                <input type="text" placeholder="Buscar cinema" />
                                <button className="search-btn" >
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

                        <Table
                            columns={['Nome', 'CNPJ', 'Gerente', 'Telefone', 'Endereço', 'Ações']}
                            data={cinemasData.map((cinema, index) => [
                                cinema.nome,
                                cinema.cpf,
                                cinema.gerente,
                                cinema.telefone,
                                cinema.endereco,
                                
                                <div key={cinema.cpf} className="td-actions" >
                                    <Link href={`/dashboard/cinemas/${cinema.cpf.replace(/\D/g, "")}`} key="view">Visualizar</Link>
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
                                        <h3>Editar dados</h3>
                                        <p>{cinemasData[cinemaSelected].nome}</p>
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
                                                <option value={cinemasData[cinemaSelected].gerente} disabled>
                                                    {cinemasData[cinemaSelected].gerente} (Gerente atual)
                                                </option>
                                                <option value="000.000.000-01">João da Silva</option>
                                                <option value="000.000.000-02">Maria da Silva</option>
                                                <option value="000.000.000-03">José da Silva</option>
                                                <option value="000.000.000-04">Ana da Silva</option>
                                                <option value="000.000.000-05">Carlos da Silva</option>
                                                <option value="000.000.000-06">Antônio da Silva</option>
                                            </select>
                                        </div>
                                        {
                                            // Se o gerente for diferente do gerente atual, exibir campo para preencher email e senha
                                            gerente !== cinemasData[cinemaSelected].gerenteId && (
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
                                            <input type="text" id="CEP" value={CEP} onChange={(e) => setCEP(e.target.value)} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="number">Número</label>
                                            <input type="text" id="number" value={number} onChange={(e) => setNumber(e.target.value)} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="complement">Complemento</label>
                                            <input type="text" id="complement" value={complement} onChange={(e) => setComplement(e.target.value)} />
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