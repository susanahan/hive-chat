import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import "../styles/Navbar.scss";

const Navbar = () => {
	const {currentUser} = useContext(AuthContext);
	const handleLogOut = (auth) => {
		if (currentUser) {
			signOut(auth)
		} else {
			<Spinner />
		}
	}

	return (
		<div className="Navbar">
			<span className="logo"> Hive Chat </span>
			<div className="user">
				<img 
					src={currentUser.photoURL}
					alt=""
				/>
				<span>{currentUser.displayName}</span>
				<button onClick={() => handleLogOut(auth)}>logout</button>
			</div>
		</div>
	)
}

export default Navbar;