import "../App.css";

import { useParams } from "react-router-dom";

export function Profile() {
	const { name } = useParams();

	return (
		<div className="App">
			<div className="App-body"></div>
		</div>
	);
}
