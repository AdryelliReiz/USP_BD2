import { useContext, useState } from "react";
import { RiArmchairLine } from "react-icons/ri";
import { TbArmchair2Off } from "react-icons/tb";
import { InformationsContext } from "../../contexts/informationsProvider";
import "./styles.scss";

const Poltrona = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const { tabActive, setTabActive } = useContext(InformationsContext);

  const seats = [   
    ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"],
    ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"],
    ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"],
    ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
    ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"],
    ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8"],
    ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"],
    ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8"],
    ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8"],
  ];

  const occupiedSeats = ["B3", "C4", "D4", "D5"];

  const toggleSeat = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

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
                key={seat}
                className={`seat ${
                  occupiedSeats.includes(seat)
                    ? "occupied"
                    : selectedSeats.includes(seat)
                    ? "selected"
                    : seat.startsWith("A")
                    ? "vip"
                    : "available"
                }`}
                onClick={() => toggleSeat(seat)}
              >
                {occupiedSeats.includes(seat) ? (
                  <TbArmchair2Off />
                ) : (
                  <RiArmchairLine />
                )}
                <span>{seat}</span>
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
