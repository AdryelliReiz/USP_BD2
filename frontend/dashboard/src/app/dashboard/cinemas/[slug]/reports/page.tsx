'use client'

import ReportCard from "@/components/ReportCard";
import { useSession } from "@/context/sessionContext";
import { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

const data = {
    montlyBilling: 540120,
    lastMonthBilling: 742980,
    yearBilling: 2520080,
    tickets: [
        { name: 'Inteira', value: 321 },
        { name: 'Meia', value: 454 },
        { name: 'Pontos Club', value: 63 }
    ],
    topMovies: [
        {
            name: "Deadpool & Wolverine",
            utilization: 86,
            gender: "Ação/Comédia",
            invoicing: 120250,
            sessions: 1421,
        },
        {
            name: "Homem-Aranha",
            utilization: 92,
            gender: "Ação/Comédia",
            invoicing: 120250,
            sessions: 1421,
        },
        {
            name: "Vingadores",
            utilization: 91,
            gender: "Ação/Comédia",
            invoicing: 120250,
            sessions: 1421,
        },
        {
            name: "Flash",
            utilization: 69,
            gender: "Ação/Comédia",
            invoicing: 120250,
            sessions: 1421,
        },
        {
            name: "Avatar",
            utilization: 74,
            gender: "Ação/Comédia",
            invoicing: 120250,
            sessions: 1421,
        }
    ]
}

async function fetchCinemaId(params: Promise<{ slug: string }>) {
    const { slug } = await params;
    return slug;
}

export default function ReportsPage({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { sessionUser } = useSession();
    const [cinemaId, setCinemaId] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        fetchCinemaId(params).then(setCinemaId);
    }, [params]);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onPieEnter(_: any, index: number) {
        setActiveIndex(index);
    };

    return (
        <section>
            {sessionUser ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Relatórios</h2>
                    </div>

                    <div className="dash-content">
                        <div className="reports-container">
                            <div className="reports-grid grid-3">
                                <ReportCard 
                                    title="Faturamento do mês anterior" 
                                    content={
                                        <p><strong>R$ {data.lastMonthBilling.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
                                    }
                                />

                                <ReportCard 
                                    title="Faturamento do mês atual" 
                                    content={
                                        <p><strong>R$ {data.montlyBilling.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
                                    }
                                />

                                <ReportCard 
                                    title="Faturamento do ano" 
                                    content={
                                        <p><strong>R$ {data.yearBilling.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
                                    }
                                />
                            </div>

                            <div className="reports-grid grid-1-3 charts-container">
                                <ReportCard
                                    title="Filmes mais vendidos"
                                    content={
                                        <table className="movie-table">
                                            <thead>
                                                <tr>
                                                    <th>Título</th>
                                                    <th>Aproveitamento</th>
                                                    <th>Gênero</th>
                                                    <th>Faturamento</th>
                                                    <th>Sessões Exibidas</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.topMovies.map((movie, index) => (
                                                    <tr key={index}>
                                                        <td>{movie.name}</td>
                                                        <td>{movie.utilization}%</td>
                                                        <td>{movie.gender}</td>
                                                        <td>{movie.invoicing.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                        <td>{movie.sessions}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    }
                                />

                                <ReportCard
                                    title="Ingressos mais vendidos"
                                    content={
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart width={400} height={400}>
                                            <Pie
                                                activeIndex={activeIndex}
                                                activeShape={renderActiveShape}
                                                data={data.tickets}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#811FA9"
                                                dataKey="value"
                                                onMouseEnter={onPieEnter}
                                            />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} ingressos`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`${(percent * 100).toFixed(2)}%`}
            </text>
        </g>
    );
};