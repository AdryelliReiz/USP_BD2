import { useContext } from "react";
import { InformationsContext } from "../../contexts/informationsProvider"; 
import "./styles.scss";

interface Film {
  title: string;
  image: string;
  times: string[];
}

const Cinema: React.FC = () => {
  const { tabActive, setTabActive } = useContext(InformationsContext);

  const films: Film[] = [
    {
      title: "Deadpool & Wolverine",
      image: "/imagens/deadpool.png", 
      times: ["13:30", "19:40", "20:20"],
    },
    {
      title: "Divertidamente 2",
      image: "/imagens/divertidamente.png", 
      times: ["11:45", "14:50"],
    },
    {
      title: "Homem-Aranha Através do Aranhaverso",
      image: "/imagens/spider.png", 
      times: ["16:00", "17:30", "19:30"],
    },
  ];

  return (
    <div className="cinema-container">
      <h1 className="cinema-title">CINEACH</h1>
      <p className="cinema-subtitle">Filmes em cartaz</p>
      <div className="date-tabs">
        <button className="active-tab">Hoje</button>
        <button>27/11</button>
        <button>28/11</button>
        <button>29/11</button>
        <button>30/11</button>
      </div>
      <div className="films-container">
        {films.map((film, index) => (
          <div className="film-card" key={index}>
            <button
              onClick={() => setTabActive(tabActive + 1)}
              className="film-poster-button"
            >
              <img src={film.image} alt={film.title} className="film-poster" />
            </button>
            <p className="film-title">{film.title}</p>
            <div className="film-times">
              {film.times.map((time, idx) => (
                <span key={idx} className="film-time">
                  {time}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cinema;
