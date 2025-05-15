'use client';

import { useSession } from "@/context/sessionContext";
import Card from "@/components/Card";

export default function DashboardHome(){
    const { sessionUser } = useSession();
    
    return (
        <section>
            {sessionUser?.role == 'admin' ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Dashboard</h2>
                        <h3>Bem-vindo(a), {sessionUser.nome}</h3>
                    </div>

                    <div className="dash-content">
                        <h4>Área Administrativa</h4>

                        <div className="cards-container-grid">
                            <Card 
                                title="Cinemas"
                                description="Gerencie os cinemas da rede"
                                image={<img src="/imgs/cine.svg" alt="Cinema" />}
                                link="/dashboard/cinemas"
                            />
                            <Card
                                title="Relatórios"
                                description="Visualize relatórios de vendas"
                                image={<img src="/imgs/graficos.svg" alt="Relatório" />}
                                link="/dashboard/reports"
                            />
                            <Card
                                title="Funcionários"
                                description="Gerencie os funcionários"
                                image={<img src="/imgs/funcionario.svg" alt="Funcionário" />}
                                link="/dashboard/employees"
                            />
                            <Card
                                title="Clientes"
                                description="Gerencie os clientes cadastrados"
                                image={<img src="/imgs/cliente.svg" alt="Cliente" />}
                                link="/dashboard/clients"
                            />
                            <Card 
                                title="Filmes"
                                description="Gerencie os filmes em cartaz"
                                image={<img src="/imgs/filme.svg" alt="Filme" />}
                                link="/dashboard/films"
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