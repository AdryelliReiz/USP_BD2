'use client';

import { useEffect, useState } from "react";
import { useSession } from "@/context/sessionContext";
import Card from "@/components/Card";

async function fetchCinemaId(params: Promise<{ slug: string }>) {
    const { slug } = await params;
    return slug;
}

export default function CinemaPage({
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
                        <h2>Dashboard</h2>
                        <h3>Cinema {cinemaId /* mostrar o nome do cinema*/}</h3>
                    </div>

                    <div className="dash-content">
                        <h4>Gerencimaneto</h4>

                        <div className="cards-container-grid">
                            <Card 
                                title="Sessões"
                                description="Gerencie as sessões de cinema"
                                image={<img src="/imgs/cine.svg" alt="Cinema" />}
                                link={`/dashboard/cinemas/${cinemaId}/sessions`}
                            />
                            <Card
                                title="Relatórios"
                                description="Visualize relatórios de vendas"
                                image={<img src="/imgs/graficos.svg" alt="Relatório" />}
                                link={`/dashboard/cinemas/${cinemaId}/reports`}
                            />
                            <Card
                                title="Funcionários"
                                description="Gerencie os funcionários"
                                image={<img src="/imgs/funcionario.svg" alt="Funcionário" />}
                                link={`/dashboard/cinemas/${cinemaId}/employees`}
                            />
                            <Card
                                title="Salas"
                                description="Gerencie as salas de cinema"
                                image={<img src="/imgs/assentos.svg" alt ="Salas" />}
                                link={`/dashboard/cinemas/${cinemaId}/rooms`}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                null
            )}
        </section>
    )
}