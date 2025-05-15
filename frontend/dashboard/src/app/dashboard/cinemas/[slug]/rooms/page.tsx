'use client';

import { useEffect, useState } from "react";
import { useSession } from "@/context/sessionContext";
import Table from "@/components/Table";
import { BiCheck, BiPlus, BiTrash, BiX } from "react-icons/bi";
import Link from "next/link";

const roomsData = [
    {
        numero: 1,
        capacidade: 100,
        suporta3D: true,
        IMax: false,
    },
    {
        numero: 2,
        capacidade: 100,
        suporta3D: true,
        IMax: false,
    },
    {
        numero: 3,
        capacidade: 100,
        suporta3D: false,
        IMax: false,
    },
    {
        numero: 4,
        capacidade: 100,
        suporta3D: true,
        IMax: true,
    },
    {
        numero: 5,
        capacidade: 100,
        suporta3D: true,
        IMax: true,
    },
];

async function fetchCinemaId(params: Promise<{ slug: string }>) {
    const { slug } = await params;
    return slug;
}

export default function RoomPage({
    params,
  }: {
    params: Promise<{ slug: string }>
  }
) {
    const { sessionUser } = useSession();
    const [cinemaId, setCinemaId] = useState<string | null>(null);

    useEffect(() => {
        fetchCinemaId(params).then(setCinemaId);
    }, [params]);

    return (
        <section>
            {sessionUser && cinemaId ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Salas</h2>
                        <h3>Cinema {cinemaId /* mostrar o nome do cinema*/}</h3>
                    </div>

                    <div className="dash-content">
                        <div className="dash-actions">
                            <h4>Salas disponíveis</h4>
                            <Link href={`/dashboard/cinemas/${cinemaId}/rooms/new`}>
                                <button className="add-btn" >
                                    <BiPlus size={24} />
                                    Adicionar Sala
                                </button>
                            </Link>
                        </div>

                        <Table
                            columns={['Número', 'Capacidade', 'Suporta 3D', 'IMax', 'Ações']}
                            data={roomsData.map((room) => [
                                `Sala ${room.numero}`,
                                room.capacidade,
                                room.suporta3D ? <BiCheck size={20} /> : <BiX size={20} />,
                                room.IMax ? <BiCheck size={20} /> : <BiX size={20} />,

                                <div key={room.numero} className="td-actions" >
                                    <button key="delete">
                                        <BiTrash size={18} />
                                    </button>
                                </div>
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