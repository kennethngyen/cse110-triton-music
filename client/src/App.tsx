import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/navbar";
import { Home } from "./pages/home";
import { Timer } from "./pages/timer";
import { Profile } from "./pages/profile";
import { Signup } from "./pages/signup";
import { MusicFeed } from "./pages/music-feed-page";



//<Route path="/timer:time" element={<Timer />} /> may need to be what line 14 is changed to
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/music-feed" element={<MusicFeed/>} />
        <Route path="/study" element={<Timer />} />
        <Route path="/profile/:name" element={<Profile />} />
        <Route path="/signup" element={<Signup />} /> 
      </Routes>
    </div>
  );

};
//<Route path="/timer" element={<Timer />} /> may need to be what line 14 is changed to
export default App;
