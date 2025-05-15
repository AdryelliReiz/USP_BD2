'use client';

import { MouseEvent, useEffect, useState } from "react";
import { useSession } from "@/context/sessionContext";
import { TbArmchair } from "react-icons/tb";

const filmsData = [
    {
        id: '1',
        titulo: 'Spideman',
        genero: ['Ação', 'Aventura'],
        duraçao: 120,
        classificaçao: 12,
        poster: 'https://sm.ign.com/t/ign_br/screenshot/s/spider-man/spider-man-2002-poster-tobey-maguire-as-spider-man_nbcp.600.jpg',
        suporta3D: false,
    },
    {
        id: '2',
        titulo: 'Spideman 2',
        genero: ['Ação', 'Aventura'],
        duraçao: 127,
        classificaçao: 12,
        poster: 'https://i.pinimg.com/736x/72/61/67/72616709f3a5d440f17c88684be8040a.jpg',
        suporta3D: false,
    },
    {
        id: '3',
        titulo: 'Spideman 3',
        genero: ['Ação', 'Aventura'],
        duraçao: 139,
        classificaçao: 12,
        poster: 'https://i.ebayimg.com/images/g/LmsAAOSwfBNk0~CA/s-l1200.jpg',
        suporta3D: false,
    },
]

const roomsData = [
    {
        id: '1',
        numero: 1,
        imax: true,
        suporta3D: true,
        ocupacaoMaxima: 100,
    },
    {
        id: '2',
        numero: 2,
        imax: false,
        suporta3D: true,
        ocupacaoMaxima: 100,
    },
    {
        id: '3',
        numero: 3,
        imax: false,
        suporta3D: false,
        ocupacaoMaxima: 100,
    }
]

async function fetchCinemaId(params: Promise<{ slug: string }>) {
    const { slug } = await params;
    return slug;
}

export default function NewSessionPage({
    params,
  }: {
    params: Promise<{ slug: string }>
  }
) {
    const { sessionUser } = useSession();
    const [cinemaId, setCinemaId] = useState<string | null>(null);

    const [filmSelected, setFilmSelected] = useState<string | null>(null);

    

    useEffect(() => {
        fetchCinemaId(params).then(setCinemaId);
    }, [params]);


    return (
        <section>
            {sessionUser && cinemaId ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Criando uma Sessão</h2>
                        <h3>Cinema {cinemaId /* mostrar o nome do cinema*/}</h3>
                    </div>

                    <div className="dash-content">
                        {!filmSelected ? (
                            <>
                                <h4>Selecione um filme</h4>
                                <div className="films-selected-list">
                                    {filmsData.map((film) => (
                                        <div
                                            key={film.id}
                                            className="film-card"
                                            onClick={() => setFilmSelected(film.id)}
                                        >
                                            <img src={film.poster} alt={film.titulo} />
                                            
                                            <div className="film-info">
                                                <h5>{film.titulo}</h5>
                                                <p>{film.duraçao}min</p>
                                                <p>{film.genero.map(genero => <span key={genero}>{genero} </span>)}</p>
                                                <p>Classificação: {film.classificaçao}</p>
                                                <p>{film.suporta3D ? 'Suporta 3D' : 'Não suporta 3D'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ): (
                            <>
                                <h4>Configure a sessão</h4>

                                <div className="session-config">
                                    <div className="film-selected">
                                        <img src={filmsData.find(film => film.id === filmSelected)?.poster} alt="Filme selecionado" />
                                        <div className="film-info">
                                            <h5>{filmsData.find(film => film.id === filmSelected)?.titulo}</h5>
                                            <p>
                                                <span>{filmsData.find(film => film.id === filmSelected)?.duraçao}min | </span>
                                                {filmsData.find(film => film.id === filmSelected)?.genero.map(genero => <span key={genero}>{genero} </span>)}
                                                <span> | {filmsData.find(film => film.id === filmSelected)?.classificaçao} | </span>
                                                <span>{filmsData.find(film => film.id === filmSelected)?.suporta3D ? 'Suporta 3D' : 'Não suporta 3D'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <form action="">
                                        <div className="form-content">
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <label htmlFor="data">Data</label>
                                                    <input type="date" id="data" name="data" min={new Date().toISOString().split('T')[0]} />
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="horario">Horário</label>
                                                    <input type="time" id="horario" name="horario" />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="input-group">
                                                    <label htmlFor="Salas">Sala de exibição:</label>
                                                    <select name="Salas" id="Salas">
                                                        {roomsData.map(room => (
                                                            <option key={room.id} value={room.id}>Sala {room.numero}{room.imax && ' | IMax'}{room.suporta3D && ' | 3D'} | Capacidade {room.ocupacaoMaxima}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="check-group">
                                                    <input type="checkbox" id="3d" name="3d" />
                                                    <label htmlFor="3d">3D</label>
                                                </div>

                                                <div className="check-group">
                                                    <input type="checkbox" id="dublado" name="dublado" />
                                                    <label htmlFor="dublado">Dublado</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="btn-submit-container">
                                            <button type="submit">Criar Sessão</button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                null
            )}
        </section>
    )
}