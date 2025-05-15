import { useContext } from "react";
import { InformationsContext } from "../../contexts/informationsProvider"

import "./styles.scss";

export default function Welcome() {
    const {tabActive, setTabActive} = useContext(InformationsContext)
    return (
        <div className="welcome-container" >
            <div className="w-content" >
                <h1>CINEACH</h1>

                <button onClick={() => setTabActive(tabActive + 1)} >
                    COMEÇAR
                </button>
            </div>
        </div>
    )
}