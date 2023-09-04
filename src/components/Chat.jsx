import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import More from "../images/more.png";

import Input from "./Input";
import Messages from "./Messages";
import "../styles/Chat.scss";


const Chat = () => {
	const { data } = useContext(ChatContext);

	return (
		<div className="Chat">
			<div className="chatInfo">
				<span>{data.user?.displayName}</span>
				<div className="chatIcons">
			
					<img src={More} alt="" />
				</div>
			</div>
			<Messages />
			<Input />
		</div>
	)
}

export default Chat;