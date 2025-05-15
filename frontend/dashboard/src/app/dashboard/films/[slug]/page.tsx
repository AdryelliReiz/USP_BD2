'use client';

import { useEffect, useState } from "react";
import { useSession } from "@/context/sessionContext";
import { File } from "buffer";

async function fetchCinemaId(params: Promise<{ slug: string }>) {
    const { slug } = await params;
    return slug;
}

const filmData ={
    id: 0,
    titulo: 'Spideman',
    ano: 2002,
    diretor: 'Sam Raimi',
    genero: ['Ação'],
    classificacao: '12',
    duracao: 121,
    descriçao: 'Peter Parker é um jovem estudante que vive com seus tios, Ben e May, desde que seus pais faleceram. Peter tem dificuldade em se relacionar com seus colegas, por ser tímido e por eles o considerarem um nerd. Até que, em uma aula de ciências, é mordido por uma aranha geneticamente modificada. A partir de então, Peter desenvolve superpoderes que o ajudam a enfrentar seus problemas cotidianos e a combater o mal.',
    odioma: 'Inglês',
    dublado: true,
    contrato: '30-12-2021',
    capa: 'https://sm.ign.com/t/ign_br/screenshot/s/spider-man/spider-man-2002-poster-tobey-maguire-as-spider-man_nbcp.600.jpg',
}

export default function FilmPage({
    params,
  }: {
    params: Promise<{ slug: string }>
  }
) {
    const { sessionUser } = useSession();
    const [filmId, setFilmId] = useState<string | null>(null);

    // dados atualizados do filme
    const [name, setName] = useState(filmData.titulo);
    const [year, setYear] = useState(filmData.ano);
    const [director, setDirector] = useState(filmData.diretor);
    const [genre, setGenre] = useState(filmData.genero);
    const [classification, setClassification] = useState(filmData.classificacao);
    const [duration, setDuration] = useState(filmData.duracao);
    const [description, setDescription] = useState(filmData.descriçao);
    const [language, setLanguage] = useState(filmData.odioma);
    const [dubbed, setDubbed] = useState(filmData.dublado);
    const [contract, setContract] = useState(filmData.contrato);
    const [cover, setCover] = useState<File>();

    useEffect(() => {
        fetchCinemaId(params).then(setFilmId);
    }, [params]);

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
            {sessionUser && filmId ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Editando Filme</h2>
                    </div>

                    <div className="dash-content">
                        <div className="film-container">
                            <div className="film-poster">
                                <img src={cover ? URL.createObjectURL(cover) : filmData.capa} alt={filmData.titulo} />

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