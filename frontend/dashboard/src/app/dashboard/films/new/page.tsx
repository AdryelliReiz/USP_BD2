'use client';

import { useState } from "react";
import { useSession } from "@/context/sessionContext";
import { File } from "buffer";


export default function FilmPage() {
    const { sessionUser } = useSession();

    const [name, setName] = useState('');
    const [year, setYear] = useState<number>();
    const [director, setDirector] = useState('');
    const [genre, setGenre] = useState<string[]>([]);
    const [classification, setClassification] = useState('');
    const [duration, setDuration] = useState<number>();
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [dubbed, setDubbed] = useState(false);
    const [contract, setContract] = useState('');
    const [cover, setCover] = useState<File>();

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log(file);
        }

        const formData = new FormData();
        formData.append('file', file as Blob);

        setCover(file as unknown as File);
    };

    //useEffect(() => {
    //    genre.map((genre) => { console.log(genre) })
    //}, [genre]);

    return (
        <section>
            {sessionUser ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Registrando Filme</h2>
                    </div>

                    <div className="dash-content">
                        <div className="film-container">
                            <div className="film-poster">
                                <img src={cover ? URL.createObjectURL(cover) : ''} alt="capa do filme" />

                                <input type="file" id="imageUpload" onChange={handleImageUpload} />

                            </div>

                            <div className="film-forms-edit">
                                <form action="">
                                    <div className="input-group">
                                        <label htmlFor="name">Nome</label>
                                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="year">Ano</label>
                                        <input type="number" id="year" value={year} onChange={(e) => setYear(Number(e.target.value))} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="director">Diretor</label>
                                        <input type="text" id="director" value={director} onChange={(e) => setDirector(e.target.value)} />
                                    </div>


                                    <div className="input-group">
                                        <label htmlFor="genre">Genêro</label>
                                        <input type="text" id="genre" value={genre.join(' ')} onChange={(e) => setGenre(e.target.value.split(/(?:,| )+/))} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="classification">Classificação</label>
                                        
                                        <select id="classification" value={classification} onChange={(e) => setClassification(e.target.value)}>
                                            <option value="L">L</option>
                                            <option value="10">10</option>
                                            <option value="12">12</option>
                                            <option value="14">14</option>
                                            <option value="16">16</option>
                                            <option value="18">18</option>
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="duration">Duração</label>
                                        <input type="number" id="duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="description">Descrição</label>
                                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="language">Idioma</label>
                                        <input type="text" id="language" value={language} onChange={(e) => setLanguage(e.target.value)} />
                                    </div>

                                    <div className="input-check-group">
                                        <input type="checkbox" id="dubbed" checked={dubbed} onChange={() => setDubbed(!dubbed)} />
                                        <label htmlFor="dubbed">Dublado</label>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="contract">Contrato</label>
                                        <input type="date" id="contract" value={contract} onChange={(e) => setContract(e.target.value)} />
                                    </div>
                                </form>

                                <button>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                null
            )}
        </section>
    )
}