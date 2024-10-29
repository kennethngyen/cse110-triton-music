import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<div>
			<nav style={{ display: "flex", justifyContent: "space-around" }}>
				<Link to="/">Home</Link>
				<Link to="/study">Study</Link>
				<Link to="/profile/me">Profile</Link>
			</nav>
		</div>
	);
};
