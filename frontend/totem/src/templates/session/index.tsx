import { useContext, useEffect, useState } from "react";
import { InformationsContext } from "../../contexts/informationsProvider";
import "./styles.scss";
import api from "../../services/api";
import formatarData from "../../utils/formatarData";
import formatarHora from "../../utils/formatarHora";

type SessionsData = {
    sala: number;
    e3D: boolean;
    dub: boolean;
    imax: boolean;
    session: {
      hora: string;
      session_id: string;
    }[];
}

type SessionsMovieData = {
  movie: {
    id: number;
    titulo: string;
    duracao: string;
    class_ind: number;
    descricao: string;
    poster_url?: string;
  };
  sessions_by_room: SessionsData[]
}


export default function Session() {
  const { tabActive, setTabActive, selectedMovie, dateSelected, selectedCinema, setSelectedSession, setSelectedSessionTime } = useContext(InformationsContext);

  const [filmData, setFilmData] = useState<SessionsMovieData>();

  useEffect(() => {
    async function fetchSessions() {
      console.log(`filme ${selectedMovie}`)
      const { data } = await api.get(`/totem/sessions/${selectedMovie}/`, {
        params: {
          data: dateSelected,
          cnpj: selectedCinema,
        },
      });

      console.log(data)

      setFilmData(data);
    }

    fetchSessions();
  }, []);

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
          <h2>Sessões - {formatarData(dateSelected)}</h2>
          <hr className="divider" />

          <div className="sessions-list">
            {filmData && filmData.sessions_by_room.map((session, index) => (
              <div key={index} className="session-room">
                <p>
                  <strong>Sala {session.sala}</strong> {session.dub && <span className="tag">dub</span>} {session.e3D && <span className="tag">3D</span>} {session.imax && <span className="tag">IMax</span>}
                </p>
                <div className="times">
                  {session.session.map((sess) => (
                    <button key={sess.session_id} onClick={() => (
                      setSelectedSession(sess.session_id),
                      setSelectedSessionTime(sess.hora),
                      setTabActive(tabActive + 1)
                    )}>
                      {formatarHora(sess.hora)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="movie-details">
          {filmData && (
            <>
              {
                filmData.movie.poster_url ? <img src={filmData.movie.poster_url} alt="Poster do filme" />
                : <img src="https://dummyimage.com/500x750/000/fff.jpg&text=Erro+na+imagem" alt="Poster do filme" />
              }
              <div className="details">
                <h3>{filmData.movie.titulo}</h3>
                <p>
                  <strong>Duração:</strong> {formatarHora(filmData.movie.duracao)}
                </p>
                <p>
                  <strong>Descrição:</strong> {filmData.movie.descricao}
                </p>
              </div>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
}
