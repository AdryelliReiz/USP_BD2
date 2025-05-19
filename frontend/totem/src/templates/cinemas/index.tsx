import { useContext, useEffect, useState } from "react";
import { InformationsContext } from "../../contexts/informationsProvider";
import "./styles.scss";
import api from "../../services/api";

type Cinema = {
  cnpj: string;
  nome: string;
  rua: string;
  n_end: string;
}

export default function Cinemas() {
  const { tabActive, setTabActive, setSelectedCinema } = useContext(InformationsContext);
  const [cinemas, setCinemas] = useState<Cinema[]>([]); 

  useEffect(() => {
    //totem/cinemas/
    async function fetchCinemas() {
      const {data} = await api.get("/totem/cinemas/");

      setCinemas(data);
    }

    fetchCinemas()
  }, [])
  
  return (
    <div className="cinemas-container">
      <div className="c-content">
        <div className="c-header">
          <h1>CINEACH</h1>
        </div>

        <div className="c-title">
          <h2>SELECIONE UM DOS NOSSOS CINEMAS</h2>
        </div>

        <div className="c-buttons">
          {cinemas.map((cinema) => (
            <button key={cinema.cnpj} onClick={() => {
              setSelectedCinema(cinema.cnpj)
              setTabActive(tabActive + 1)
            }}>
              <h3>{cinema.nome}</h3>
              <p>{cinema.rua}, {cinema.n_end}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
