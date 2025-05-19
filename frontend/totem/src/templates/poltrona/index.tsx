import { useContext, useEffect, useState } from "react";
import { RiArmchairLine } from "react-icons/ri";
import { TbArmchair2Off } from "react-icons/tb";
import { InformationsContext } from "../../contexts/informationsProvider";
import "./styles.scss";
import api from "../../services/api";

type Seat = {
  numero: number;
  letra: string;
  ocupada: boolean;
  tipo: string;
} 

const Poltrona = () => {
  const { tabActive, setTabActive, selectedSeats, setSelectedSeats, selectedSession } = useContext(InformationsContext);
  const [seats, setSeats] = useState<Seat[]>([]);

  const toggleSeat = (seat: string) => {
    //verufica se o assento selecionado já está ocupado
    if(seats.find((s) => s.letra + s.numero === seat)?.ocupada) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  useEffect(() => {
    // seta a poltrona selecionada para null
    setSelectedSeats([]);

    async function fetchSets() {
      console.log(selectedSession)
      const { data } = await api.get(`/totem/seats/${selectedSession}/`);
      console.log(data)
      setSeats(data);
    }

    fetchSets()
  }, [])

  return (
    <div className="poltrona-page">
      <h1>CINEACH</h1>
      <h2>Selecione os assentos</h2>
      <div className="layout">
        <div className="legend">
          <p className="black">
            <span className="legend-color"></span> Disponível
          </p>
          <p className="red">
            <span className="legend-color"></span> Ocupado
          </p>
          <p className="yellow">
            <span className="legend-color"></span> PCD
          </p>
        </div>
  
        {/* Container de poltronas */}
        <div className="container">
          <div className="screen">TELA</div>
          <div className="seats-container">
            {seats.flat().map((seat) => (
              <div
                key={seat.letra + seat.numero}
                className={`seat ${
                  (seat.ocupada)
                    ? "occupied"
                    : selectedSeats.includes(seat.letra + seat.numero)
                    ? "selected"
                    : seat.letra === "A" || seat.letra === "B"
                    ? "vip"
                    : "available"
                }`}
                onClick={() => toggleSeat(seat.letra + seat.numero)}
              >
                {seat.ocupada ? (
                  <TbArmchair2Off />
                ) : (
                  <RiArmchairLine />
                )}
                <span>{seat.letra + seat.numero}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footer">
        <button
          className="back-button"
          onClick={() => setTabActive(tabActive - 1)}
        >
          Voltar
        </button>
        <span>{selectedSeats.length} assentos selecionados</span>
        <button
          className="next-button"
          onClick={() => setTabActive(tabActive + 1)}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default Poltrona;
