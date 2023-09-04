import React, { useContext, useState } from "react";
import Img from "../images/img.png";
import Attach from "../images/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "../styles/Chat.scss";

const Input = () => {
	const [ text, setText ] = useState("");
	const [ file, setFile ] = useState(null);

	const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);

	const handleSend = async (event) => {
		event.preventDefault();

		if (data.chatId === "null") {
			return alert("Find user first")
		}

		if (file) {
			const storageRef = ref(storage, `/files/${uuid()}`);

      uploadBytes(storageRef, file)
      .then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                url: downloadURL,
								type: file.type,
								name: file.name
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

		await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setFile(null);
  };

	return (
		<div>
		{/* {err && alert(err)} */}
		<form onSubmit={handleSend} className="input">
			<input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
			<div className="send">
			<input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
				<label htmlFor="file">
				<img src={Attach} alt="" />
				</label>
				
				<input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
				<label htmlFor="file">
					<img src={Img} alt="" />
				</label>
				<button type="submit">Send</button>
			</div>
		</form>
		</div>
	)
}

export default Input;