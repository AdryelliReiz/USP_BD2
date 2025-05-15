import './styles.scss';

type Film = {
    id: number;
    titulo: string;
    ano: string;
    diretor: string;
    genero: string[];
    classificacao: string;
    duracao: number;
    descriçao: string;
    odioma: string;
    dublado: boolean;
    contrato: string;
    capa: string;
}

export default function FilmCard({film}: {film: Film}) {
    return (
        <div className="film-card">
            <div className="film-card-header">
                <img src={film.capa} alt={film.titulo} />
            </div>
            <div className="film-card-body">
                <h2>{film.titulo}</h2>
                <p>Ano: {film.ano}</p>
                <p>Diretor: {film.diretor}</p>
                <p>Genêro: {film.genero.join(', ')}</p>
                <p>Classificação: {film.classificacao}</p>
                <p>Duração: {film.duracao}</p>
                <p>Idioma: {film.odioma}</p>
                <p>{film.dublado ? 'Dublado' : 'Legendado'}</p>
                <p>{film.contrato}</p>
            </div>
        </div>
    );
}