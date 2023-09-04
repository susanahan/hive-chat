import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Spinner from "../components/Spinner";

const Login = () => {
  const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
		setLoading(true);
    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
			setLoading(false);
      navigate("/")
    } catch (error) {
			setLoading(false);
      setError(true);
    }
  };
  return (
    <div className="formContainer">
			{
				!loading ?
      	<div className="formWrapper">
        <span className="logo">Hive Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign in</button>
          {error && <span>Something went wrong</span>}
        </form>
        <p>You don't have an account? <Link to="/register">Register</Link></p>
      	</div>
				: <Spinner />
			}
    </div>
  );
};

export default Login;