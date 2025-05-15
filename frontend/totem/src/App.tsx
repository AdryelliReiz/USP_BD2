import { useContext } from "react";
import { InformationsContext } from "./contexts/informationsProvider"
import Welcome from "./templates/welcome";
import Tickets from "./templates/tickets";
import Cinemas from "./templates/cinemas";
import Identification from "./templates/identification";
import Payment from "./templates/payment";
import End from "./templates/end";
import Session from "./templates/session";
import Catalogo from "./templates/catalogo";
import Poltrona from "./templates/poltrona";

function App() {
	const {tabActive} = useContext(InformationsContext)

	return (
		<main>
			{
				tabActive == 0 ? <Welcome />
				: tabActive == 1 ? <Cinemas />
				: tabActive == 2 ? <Identification />
				: tabActive == 3 ? <Catalogo />
				: tabActive == 4 ? <Session />
				: tabActive == 5 ? <Poltrona />
				: tabActive == 6 ? <Tickets />
				: tabActive == 7 ? <Payment />
				: tabActive == 8 ? <End />
				:null
			}
		</main>
	);
}

export default App;
