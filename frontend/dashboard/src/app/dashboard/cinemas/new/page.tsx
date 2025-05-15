'use client';

import { useState } from "react";
import { useSession } from "@/context/sessionContext";
import z from 'zod';


export default function NewCinemaPage() {
    const { sessionUser } = useSession();

    const [name, setName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [phone, setPhone] = useState('');
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState<number>();
    const [complement, setComplement] = useState('');

    return (
        <section>
            {sessionUser ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Registrando Cinema</h2>
                    </div>

                    <div className="dash-content">
                        <h4>Informe os dados do novo cinema</h4>

                        <div className="new-container">
                            <form action="">
                                <div className="input-group">
                                    <label htmlFor="name">Nome do Cinema</label>
                                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>

                                <div className="form-group">
                                    <div className="input-group">
                                        <label htmlFor="cnpj">CNPJ</label>
                                        <input type="text" id="cnpj" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="phone">Telefone</label>
                                        <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-group">
                                        <label htmlFor="cep">CEP</label>
                                        <input type="text" id="cep" value={cep} onChange={(e) => setCep(e.target.value)} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="address">Endereço</label>
                                        <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-group">
                                        <label htmlFor="number">Número</label>
                                        <input type="number" id="number" value={number} onChange={(e) => setNumber(parseInt(e.target.value))} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="complement">Complemento</label>
                                        <input type="text" id="complement" value={complement} onChange={(e) => setComplement(e.target.value)} />
                                    </div>
                                </div>

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