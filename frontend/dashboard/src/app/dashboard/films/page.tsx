'use client';

import FilmCard from "@/components/FilmCard";
import { useSession } from "@/context/sessionContext";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";

const filmsData = [
    {
        id: 0,
        titulo: 'Spideman',
        ano: '2002',
        diretor: 'Sam Raimi',
        genero: ['Ação'],
        classificacao: '12',
        duracao: 121,
        descriçao: 'Peter Parker é um jovem estudante que vive com seus tios, Ben e May, desde que seus pais faleceram. Peter tem dificuldade em se relacionar com seus colegas, por ser tímido e por eles o considerarem um nerd. Até que, em uma aula de ciências, é mordido por uma aranha geneticamente modificada. A partir de então, Peter desenvolve superpoderes que o ajudam a enfrentar seus problemas cotidianos e a combater o mal.',
        odioma: 'Inglês',
        dublado: true,
        contrato: '30-12-2021',
        capa: 'https://sm.ign.com/t/ign_br/screenshot/s/spider-man/spider-man-2002-poster-tobey-maguire-as-spider-man_nbcp.600.jpg',
    },
    {
        id: 1,
        titulo: 'Spideman 2',
        ano: '2004',
        diretor: 'Sam Raimi',
        genero: ['Ação'],
        classificacao: '12',
        duracao: 127,
        descriçao: 'Dois anos se passaram desde que o tranquilo Peter Parker (Tobey Maguire) separou-se do grande amor de sua vida, Mary Jane Watson (Kirsten Dunst), e decidiu assumir o compromisso de ser o Homem-Aranha. Peter decide dar uma chance ao amor e finalmente pede Mary Jane em casamento. Entretanto, a felicidade do casal é ameaçada pela chegada do poderoso vilão Electro (Jamie Foxx), que ameaça a cidade.',
        odioma: 'Inglês',
        dublado: true,  
        contrato: '30-12-2021',
        capa: 'https://i.pinimg.com/736x/72/61/67/72616709f3a5d440f17c88684be8040a.jpg',
    },
    {
        id: 2,
        titulo: 'Spideman 3',
        ano: '2007',
        diretor: 'Sam Raimi',   
        genero: ['Ação'],   
        classificacao: '12',    
        duracao: 139,
        descriçao: 'Peter Parker (Tobey Maguire) conseguiu encontrar um meio-termo entre seus deveres como o Homem-Aranha e seu relacionamento com Mary Jane (Kirsten Dunst). Porém o sucesso como herói e como estudante tem um preço: o surgimento de Venom, a junção da consciência de Eddie Brock (Topher Grace) com o traje do Homem-Aranha, que o torna agressivo e vingativo.',
        odioma: 'Inglês',
        dublado: true,
        contrato: '30-12-2021',
        capa: 'https://i.ebayimg.com/images/g/LmsAAOSwfBNk0~CA/s-l1200.jpg',
    },
    {
        id: 3,
        titulo: 'Spideman 4',
        ano: '2012',
        diretor: 'Marc Webb',
        genero: ['Ação'],
        classificacao: '12',
        duracao: 136,
        descriçao: 'Peter Parker (Andrew Garfield) é um rapaz tímido e estudioso, que inicou há pouco tempo um namoro com Gwen Stacy (Emma Stone), sua colega de colégio. Ele vive com os tios, May (Sally Field) e Ben (Martin Sheen), desde que foi deixado pelos pais. Certo dia, o jovem encontra uma misteriosa maleta que pertenceu a seu pai. O artefato faz com que visite o laboratório do dr. Curt Connors (Rhys Ifans) na Oscorp. Parker está em busca de respostas sobre o que aconteceu com os pais, só que acaba entrando em rota de colisão com o perigoso alter-ego de Connors, o Lagarto.',
        odioma: 'Inglês',
        dublado: true,
        contrato: '30-12-2021',
        capa: 'https://preview.redd.it/qihc8uzt4luc1.jpeg?auto=webp&s=32d3428594dd32ab49cb3c22ee0a2219eee58c62'
    },
]

export default function FilmsPage(){
    const { sessionUser } = useSession();
    
    return (
        <section>
            {sessionUser ? (
                <div className="dash-container">
                    <div className="dash-header">
                        <h2>Filmes</h2>
                        <h3>Veja mais sobre nossos filmes</h3>
                    </div>

                    <div className="dash-content">
                        <div className="dash-actions">
                            <div />
                            <Link href={`/dashboard/films/new`}>
                                <button className="add-btn" >
                                    <BiPlus size={24} />
                                    Adicionar Filme
                                </button>
                            </Link>
                        </div>

                        <div className="cards-container-grid">
                            {filmsData.map((film, index) => (
                                <Link key={index} href={`/dashboard/films/${index}`}>
                                    <FilmCard film={film} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                null
            )}
        </section>
    )
}