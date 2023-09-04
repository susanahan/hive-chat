import React, { useState } from "react";
import Add from "../images/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db, storage } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../components/Spinner";

const Register = () => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		setLoading(true);
		event.preventDefault();

		const username = event.target[0].value;
		const email = event.target[1].value;
		const password = event.target[2].value;
		const file = event.target[3].files[0];
	
		try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${username + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName: username,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName: username,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
						if (!loading) {
							navigate("/");
						} 
          
          } catch (error) {
            setError(true);
            setLoading(false);
          }
        });
      });
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
			{!loading 
				? <div className="formWrapper">
        <span className="logo">Hive Chat</span>
        <span className="title">Register</span>
				<form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
					<input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
					{
						error && <span>
							Something went wrong
						</span> 
					}
        </form>
        <p>Already a hiver? <Link to="/login">Login</Link></p>
      		</div>
				: <Spinner />
			}
    </div>
  )
}

export default Register;
