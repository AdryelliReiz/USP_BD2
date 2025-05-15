'use client';

import { useState } from "react";
import { useSession } from "@/context/sessionContext";
import z from 'zod';

const cinemasData = [
    {
        cnpj: "00.000.000/0001-00",
        nome: "Cinemark",
    },
    {
        cnpj: "00.000.000/0001-01",
        nome: "Cinepolis",
    },
    {
        cnpj: "00.000.000/0001-02",
        nome: "UCI",
    },
    {
        cnpj: "00.000.000/0001-03",
        nome: "Playarte",
    },
]


export default function NewEmployeePage() {
    const { sessionUser } = useSession();

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cpf, setCpf] = useState('');
    const [cnpjCinema, setCnpjCinema] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <section>
            {sessionUser ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Registrando Funcionário</h2>
                    </div>

                    <div className="dash-content">
                        <h4>Informe os dados do novo funcionário</h4>

                        <div className="new-container">
                            <form action="">
                                <div className="form-group-3">
                                    <div className="input-group">
                                        <label htmlFor="name">Primeiro Nome</label>
                                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="lastName">Sobrenome</label>
                                        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="cpf">CPF</label>
                                        <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-group">
                                        <label htmlFor="cnpjCinema">Cinema</label>
                                        <select name="cnpjCinema" id="cnpjCinema" value={cnpjCinema} onChange={(e) => setCnpjCinema(e.target.value)}>
                                            <option value="">Selecione um cinema</option>
                                            {cinemasData.map((cinema, index) => (
                                                <option key={index} value={cinema.cnpj}>{cinema.nome}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="check-group">
                                        <input type="checkbox" id="admin" onChange={() => setIsAdmin(!isAdmin)} />
                                        <label htmlFor="admin">Administrador</label>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <div className="form-group-3">
                                        <div className="input-group">
                                            <label htmlFor="email">E-mail</label>
                                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="password">Senha</label>
                                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="confirmPassword">Confirmar Senha</label>
                                            <input type="password" id="confirmPassword" />
                                        </div>
                                    </div>
                                )}

                                <div className="btn-submit-container">
                                    <button type="submit">Cadastrar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                null
            )}
        </section>
    )
}