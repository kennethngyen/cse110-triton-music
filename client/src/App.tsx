import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/navbar";
import { Home } from "./pages/home";
import { Timer } from "./pages/timer";
import { Profile } from "./pages/profile";
import { MusicFeed } from "./pages/music-feed-page";


const App = () => {
	return (
		<div>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/music-feed" element={<MusicFeed/>} />
				<Route path="/timer" element={<Timer />} />
				<Route path="/profile/:name" element={<Profile />} />
			</Routes>
		</div>
	);
};

export default App;
