import { useContext, useEffect } from "react";
import "./styles.scss";
import { InformationsContext } from "../../contexts/informationsProvider";

export default function Identification() {
  const { tabActive, setTabActive, CPF,setCPF } = useContext(InformationsContext);

  const handleButtonClick = (value: string) => {
    if (value === "<") {
      const updatedCpf = CPF.slice(0, -1); // Remove o último caractere
      setCPF(updatedCpf);
    } else if (CPF.length < 11) {
      const updatedCpf = CPF + value; // Adiciona o número clicado
      setCPF(updatedCpf);
    }
  };

  useEffect(() => {
    // seta o CPF para null
    setCPF("");
  }, [])

  return (
    <div className="identification-container">
      <h1>CINEACH</h1>
      <h2>Se Identifique</h2>

      <div className="cpf-input-container">
        <input
          type="text"
          value={CPF}
          placeholder="Digite seu CPF"
          readOnly
        />
      </div>

      <button
        className="skip-button"
        onClick={() => {
          setCPF("");
          setTabActive(tabActive + 1)
        }}
      >
        Não quero me identificar
      </button>

      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "<", 0].map((key) => (
          <button
            key={key}
            className="keypad-button"
            onClick={() => handleButtonClick(key.toString())}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Botões Voltar e Seguinte */}
      <div className="footer-buttons">
        <button
          className="back-button"
          onClick={() => setTabActive(tabActive - 1)}
        >
          Voltar
        </button>
        {CPF.length === 11 && (
          <button
            className="next-button"
            onClick={() => setTabActive(tabActive + 1)}
          >
            Seguinte
          </button>
        )}
      </div>
    </div>
  );
}
