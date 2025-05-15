import { useContext } from "react";
import { InformationsContext } from "../../contexts/informationsProvider";
import "./styles.scss";

export default function Cinemas() {
  const { tabActive, setTabActive } = useContext(InformationsContext);
  
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
          <button onClick={() => setTabActive(tabActive + 1)}>
            <h3>Cinema Paulista1</h3>
            <p>Av.Paulista 100</p>
          </button>

          <button onClick={() => setTabActive(tabActive + 1)}>
            <h3>Cinema Paulista2</h3>
            <p>Av.Paulista 100</p>
          </button>

          <button onClick={() => setTabActive(tabActive + 1)}>
            <h3>Cinema Paulista3</h3>
            <p>Av.Paulista 100</p>
          </button>

          <button onClick={() => setTabActive(tabActive + 1)}>
            <h3>Cinema Paulista4</h3>
            <p>Av.Paulista 100</p>
          </button>
        </div>
      </div>
    </div>
  );
}
