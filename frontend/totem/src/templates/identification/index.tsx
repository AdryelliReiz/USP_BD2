import { useContext, useState } from "react";
import "./styles.scss";
import { InformationsContext } from "../../contexts/informationsProvider";

export default function Identification() {
  const { tabActive, setTabActive } = useContext(InformationsContext);
  const [cpf, setCpf] = useState<string>("");

  const handleButtonClick = (value: string) => {
    if (value === "<") {
      const updatedCpf = cpf.slice(0, -1); // Remove o último caractere
      setCpf(updatedCpf);
    } else if (cpf.length < 11) {
      const updatedCpf = cpf + value; // Adiciona o número clicado
      setCpf(updatedCpf);
    }
  };

  return (
    <div className="identification-container">
      <h1>CINEACH</h1>
      <h2>Se Identifique</h2>

      <div className="cpf-input-container">
        <input
          type="text"
          value={cpf}
          placeholder="Digite seu CPF"
          readOnly
        />
      </div>

      <button
        className="skip-button"
        onClick={() => setTabActive(tabActive + 1)}
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
        {cpf.length === 11 && (
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
