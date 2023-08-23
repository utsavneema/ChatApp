import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sendmessage from './Sendmessage';
import { addMessage } from './redux/slices/chats';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { baseUrl } from './helpers';
import './Chatbox.css'; 

const Chatbox = () => {
  const dispatch = useDispatch();
  // const [message, setMessage] = useState('');
  const chats = useSelector((state) => state.chat.chats);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const [currentUser, setCurrentUser] = useState('');
  // console.log(selectedUser);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8000');
    setSocket(newSocket);

    newSocket.addEventListener('open', () => {
      console.log('WebSocket connection opened.');
      
    });

    newSocket.addEventListener('message', function (event) {
      const receivedMessage = JSON.parse(event.data);
    
      if (receivedMessage) {
        if (receivedMessage.image && receivedMessage.sender) {
          dispatch(addMessage({
            text: null, 
            sender: receivedMessage.sender,
            imageUrl: receivedMessage.image,
          }));
        } else if (receivedMessage.text && receivedMessage.sender) {
          
          const plainTextMessage = receivedMessage.text;
          dispatch(addMessage({ text: plainTextMessage, sender: receivedMessage.sender }));
        }
      }
    });

    
  
    newSocket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed with code:', event.code);
    console.log('WebSocket close reason:', event.reason);

    });

    newSocket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error.message);
    });

    const broadcastChannel = new BroadcastChannel('chat_channel');
    broadcastChannel.addEventListener('message', function (event) {
      const receivedMessage = event.data;
      console.log('Dispatching to Redux:', receivedMessage);
      dispatch(addMessage(receivedMessage));
    });
    
    return () => {
      newSocket.close();
      broadcastChannel.removeEventListener('message');
    };
  }, []);

  // const handleSendMessage = (text) => {
  //   const newMessage = { text, sender: currentUser};
  //   socket?.send(JSON.stringify(newMessage));
  //   console.log('Dispatching to Redux:', newMessage);
  //   dispatch(addMessage(newMessage));
  // };
  const handleSendMessage = (text, image) => {
    // console.log('Sending message:', text, image);
    const newMessage = {
      text,
      sender: currentUser,
      image:image,
    };
  
    socket?.send(JSON.stringify(newMessage));
    console.log('Message sent:', newMessage);

  };
  
  

  useEffect(()=>{
    getUserDetail();
  }
  , [])

  const getUserDetail = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.get(baseUrl + 'api/auth', {
          headers: {
            Authorization: token,
          },
        });

        const {userDetails } = response.data;
        setCurrentUser(userDetails.name);
      } catch (error) {
        console.error('Error', error);
      }
    }
  };
  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '95vh' }}>
      <div
        className="navbar"
        style={{
          background: "#c3c3c3",
          display: "flex",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <i
                  className="fa fa-user-circle-o"
                  aria-hidden="true"
                  style={{
                    fontSize: "18px",
                    color: "black",
                    width: "50px",
                    height: "20px",
                    borderRadius: "50%",
                    marginRight: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                ></i>
       <div style={{ padding: '10px', background: "#c3c3c3" }}>
          <h6>{selectedUser}</h6> 
        </div>
        <Link
          className="user"
          style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <i
            className="fa fa-search"
            aria-hidden="true"
            style={{ fontSize: "18px", color: "black", marginRight: "25px" }}
          ></i>
          <div
            className="fa fa-ellipsis-v"
            style={{ fontSize: "18px", color: "black", marginRight: "15px" }}
          ></div>
        </Link>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
      {chats.map((message, index) => {
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message.text);
  } catch (error) {
    parsedMessage = null;
  }

  if (parsedMessage && parsedMessage.text) {
    return (
      <div
        key={index}
        className={`message-container ${
          message.sender === currentUser ? 'my-message' : 'other-message'
        }`}
      >
        <div
          className={`message ${
            message.sender === currentUser ? 'my-message-content' : 'other-message-content'
          }`}
        >
          {message.sender !== currentUser && (
            <div className="sender-name">{message.sender}</div>
          )}
          {parsedMessage.text}
        </div>
      </div>
    );
  } else if (parsedMessage && parsedMessage.imageUrl) {
    return (
      <div
        key={index}
        className={`message-container ${
          message.sender === currentUser ? 'my-message' : 'other-message'
        }`}
      >
        <div
          className={`message ${
            message.sender === currentUser ? 'my-message-content' : 'other-message-content'
          }`}
        >
          {message.sender !== currentUser && (
            <div className="sender-name">{message.sender}</div>
          )}
          <div>
            <img src={parsedMessage.imageUrl} alt="Image" />
          </div>
        </div>
      </div>
    );
  }
   else {
    return null;
  }
})}
</div>
      <div style={{ padding: '10px', backgroundColor: '#c3c3c3' }}>
      <Sendmessage onSendMessage={handleSendMessage}  />
      </div>
    </div>
  );
};

export default Chatbox;

