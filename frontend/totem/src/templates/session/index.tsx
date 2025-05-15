import { useContext } from "react";
import { InformationsContext } from "../../contexts/informationsProvider";
import "./styles.scss";

export default function Session() {
  const { tabActive, setTabActive } = useContext(InformationsContext);

  return (
    <div className="cinema-container">
      <header className="header">
        <h1 className="cinema-logo">CINEACH</h1>
      </header>

      <div className="header-cinema">
        <button className="back-button" onClick={() => setTabActive(tabActive - 1)}>
          &lt; Voltar
        </button>

        <h1 className="title">SELECIONE UMA SESSÃO</h1>

        <div />
      </div>

      <div className="content">
        <div className="sessions">
          <h2>Sessões - Hoje</h2>
          <hr className="divider" />

          <div className="sessions-list">
            <div className="session-room">
              <p>
                <strong>Sala 1</strong> <span className="tag">dub</span> <span className="tag">3D</span>
              </p>
              <div className="times">
                <button onClick={() => setTabActive(tabActive + 1)}>13:30</button>
                <button onClick={() => setTabActive(tabActive + 1)}>20:20</button>
              </div>
            </div>

            <div className="session-room">
              <p>
                <strong>Sala 5</strong> <span className="tag">leg</span>
              </p>
              <div className="times">
                <button onClick={() => setTabActive(tabActive + 1)}>19:10</button>
              </div>
            </div>

            <div className="session-room">
              <p>
                <strong>Sala 7</strong> <span className="tag">dub</span> <span className="tag">IMax</span>
              </p>
              <div className="times">
                <button onClick={() => setTabActive(tabActive + 1)}>20:50</button>
              </div>
            </div>
          </div>
        </div>

        <div className="movie-details">
          <img
            src="https://lumiere-a.akamaihd.net/v1/images/tidalwave_payoff_poster_brazil_caf2354b.jpeg"
            alt="Poster do filme Deadpool & Wolverine"
          />
          <div className="details">
            <h3>Deadpool & Wolverine</h3>
            <p>
              <strong>Duração:</strong> 127 minutos
            </p>
            <p>
              <strong>Descrição:</strong> Wolverine está se recuperando quando cruza
              seu caminho com Deadpool. Juntos, eles formam uma equipe e enfrentam
              um inimigo em comum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
