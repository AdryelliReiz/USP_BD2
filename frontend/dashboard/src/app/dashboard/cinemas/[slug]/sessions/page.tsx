'use client';

import Table from "@/components/Table";
import { useSession } from "@/context/sessionContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiCheck, BiPlus, BiSearch, BiX } from "react-icons/bi";

const sessionsData = [
    {
        number: 1,
        room: "Sala 1",
        movie: "Filme 1",
        date: "01/01/2021",
        time: "13:00",
        imax: true,
        threeD: true,
        classification: "Livre",
        ocupation: "50%",
        status: "Ativa",
    },
    {
        number: 2,
        room: "Sala 2",
        movie: "Filme 2",
        date: "01/01/2021",
        time: "15:00",
        imax: false,
        threeD: false,
        classification: "Livre",
        ocupation: "56%",
        status: "Ativa",
    },
    {
        number: 3,
        room: "Sala 3",
        movie: "Filme 3",
        date: "01/01/2021",
        time: "17:00",
        imax: true,
        threeD: false,
        classification: "Livre",
        ocupation: "72%",
        status: "Ativa",
    },
    {
        number: 4,
        room: "Sala 4",
        movie: "Filme 4",
        date: "01/01/2021",
        time: "19:00",
        imax: false,
        threeD: true,
        classification: "Livre",
        ocupation: "90%",
        status: "Ativa",
    }
]

async function fetchCinemaId(params: Promise<{ slug: string }>) {
    const { slug } = await params;
    return slug;
}


export default function SessionsPage({
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
                        <h2>Sessões</h2>
                        <h3>Gerencie as sessões deste cinema</h3>
                    </div>

                    <div className="dash-content">
                        <h4>Procurando algo em especifico</h4>
                        <div className="dash-actions">
                            <div className="search-container">
                                <input type="text" placeholder="Buscar sessão" />
                                <button className="search-btn" >
                                    Buscar
                                    <BiSearch size={20} />
                                </button>
                            </div>

                            <Link href={`/dashboard/cinemas/${cinemaId}/sessions/new`}>
                                <button className="add-btn">
                                    <BiPlus size={20} />
                                </button>
                            </Link>
                        </div>

                        <Table
                            columns={['N° Sessão', 'Sala', 'Filme', 'Data', 'Horário', 'IMax', '3D', 'Classificação Indicativa', 'Ocupação', 'Status']}
                            data={sessionsData.map((session) => [
                                session.number,
                                session.room,
                                session.movie,
                                session.date,
                                session.time,
                                session.imax ? <BiCheck /> : <BiX />,
                                session.threeD ? <BiCheck /> : <BiX />,
                                session.classification,
                                session.ocupation,
                                session.status,

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