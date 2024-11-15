<<<<<<< Updated upstream
import "../App";
import "../index";
import { useEffect } from "react";
import "../styles/Timer.css";
=======
>>>>>>> Stashed changes
import React, { ChangeEventHandler, useState } from "react";
import "../App.css";
import { useParams } from "react-router-dom";

export function Timer() {
	const { name } = useParams();

	return (
		<div className="App">
			<div className="App-body"></div>
		</div>
	);
}
