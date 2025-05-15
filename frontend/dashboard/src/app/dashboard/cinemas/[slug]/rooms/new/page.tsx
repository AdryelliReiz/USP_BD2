'use client';

import { MouseEvent, useEffect, useState } from "react";
import { useSession } from "@/context/sessionContext";
import { TbArmchair } from "react-icons/tb";

async function fetchCinemaId(params: Promise<{ slug: string }>) {
    const { slug } = await params;
    return slug;
}

export default function NewRoomPage({
    params,
  }: {
    params: Promise<{ slug: string }>
  }
) {
    const { sessionUser } = useSession();
    const [cinemaId, setCinemaId] = useState<string | null>(null);

    // informações do form
    const [roomNumber, setRoomNumber] = useState<number | null>(null);
    const [roomWidth, setRoomWidth] = useState<number>(0);
    const [roomDepth, setRoomDepth] = useState<number>(0);
    const [roomIsIMax, setRoomIsIMax] = useState<boolean>(false);
    const [roomIs3D, setRoomIs3D] = useState<boolean>(false);
    const [roomPCDSeats, setRoomPCDSeats] = useState<string[]>([]);

    function handleSeatSelection(e: MouseEvent,seat: string) {
        e.preventDefault();
        
        if (roomPCDSeats.includes(seat)) {
            setRoomPCDSeats(roomPCDSeats.filter((s) => s !== seat));
        } else {
            setRoomPCDSeats([...roomPCDSeats, seat]);
        }
        console.log(seat);
        console.log(roomPCDSeats);
    }

    useEffect(() => {
        fetchCinemaId(params).then(setCinemaId);
    }, [params]);

    useEffect(() => {
        // reseta os assentos PCD
        setRoomPCDSeats([]);
    }, [roomWidth, roomDepth]);

    return (
        <section>
            {sessionUser && cinemaId ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Criando uma Sala</h2>
                        <h3>Cinema {cinemaId /* mostrar o nome do cinema*/}</h3>
                    </div>

                    <div className="dash-content">
                        <h4>Configure uma nova sala de cinema</h4>
                        <form action="" className="room-form-container">
                            <div className="form-grid-group">
                                <div className="input-group">
                                    <label htmlFor="room-number">Número da Sala</label>
                                    <input type="number" min="1" max="100" id="room-number" name="room-number" value={roomNumber?.toString()} onChange={(e) => setRoomNumber((Number(e.target.value) > 100 ? 100 : Number(e.target.value)))} />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="room-width">Largura da Sala (m)</label>
                                    <input type="number" min="1" max="20" id="room-width" name="room-width" value={roomWidth.toString()} onChange={(e) => setRoomWidth((Number(e.target.value) > 20 ? 20 : Number(e.target.value)))} />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="room-depth">Profundidade da Sala (m)</label>
                                    <input type="number" min="1" max="20" id="room-depth" name="room-depth" value={roomDepth.toString()} onChange={(e) => setRoomDepth(Number(e.target.value) > 20 ? 20 : Number(e.target.value))} />
                                </div>

                                <div className="check-group">
                                    <input type="checkbox" id="room-is-imax" name="room-is-imax" checked={roomIsIMax} onChange={(e) => setRoomIsIMax(e.target.checked)} />
                                    <label htmlFor="room-is-imax">É IMAX?</label>
                                </div>

                                <div className="check-group">
                                    <input type="checkbox" id="room-is-3d" name="room-is-3d" checked={roomIs3D} onChange={(e) => setRoomIs3D(e.target.checked)} />
                                    <label htmlFor="room-is-3d">É 3D?</label>
                                </div>
                            </div>

                            <div className="form-grid-group">
                                <div className="input-group">
                                    {roomDepth > 0 && roomWidth > 0 && (
                                        <>
                                            <label htmlFor="room-pcd-seats">Assentos PCD:</label>
                                            <p>
                                                {roomPCDSeats.length > 0 && roomPCDSeats.map((seat) => (
                                                    <span key={seat}>{seat} </span>
                                                ))}
                                            </p>
                                            <div className="room-seats-container">
                                                {Array.from({ length: roomDepth }).map((_, i) => (
                                                    <div key={i}>
                                                        {Array.from({ length: roomWidth }).map((_, j) => (
                                                            <button className={`${roomPCDSeats.includes(`${String.fromCharCode(65 + i)}${j + 1}`) && "seat-selected"}`} 
                                                                onClick={(e) => handleSeatSelection(e, `${String.fromCharCode(65 + i)}${j + 1}`)} key={`${i}-${j}`}
                                                            >
                                                                <TbArmchair size={20} />
                                                                {`${String.fromCharCode(65 + i)}${j + 1}`}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>   
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="btn-submit-container">
                                <button type="submit">Criar Sala</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                null
            )}
        </section>
    )
}