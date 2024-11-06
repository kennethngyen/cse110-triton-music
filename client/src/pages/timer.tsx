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
