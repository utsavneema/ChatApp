import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sendmessage from './Sendmessage';
import { addMessage, clearChat } from './redux/slices/chats';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { baseUrl } from './helpers';
import './Chatbox.css'; 
import moment from "moment";

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
        if (receivedMessage.imageUrl) {
          dispatch(addMessage({ imageUrl: receivedMessage.imageUrl, sender: receivedMessage.sender }));
        }
        else if (receivedMessage.videoUrl) {
          dispatch(addMessage({ videoUrl: receivedMessage.videoUrl, sender: receivedMessage.sender }));
        }
        else if (receivedMessage.audioUrl) {
          dispatch(addMessage({ audioUrl: receivedMessage.audioUrl, sender: receivedMessage.sender }));
        }
        else if (receivedMessage.text) {
        dispatch(addMessage({ text: receivedMessage.text, sender: receivedMessage.sender }));
        }
      }
    });
    

    newSocket.addEventListener('close', () => {
      console.log('WebSocket connection closed.');
    });

    newSocket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // const broadcastChannel = new BroadcastChannel('chat_channel');
    // broadcastChannel.addEventListener('message', function (event) {
    //   const receivedMessage = event.data;
    //   console.log('Dispatching to Redux:', receivedMessage);
    //   dispatch(addMessage(receivedMessage));
    // });
    
    return () => {
      newSocket.close();
      //  broadcastChannel.removeEventListener('message');
    };
  }, []);

  const handleSendMessage = (text, imageUrl, videoUrl, audioUrl) => {
    const newMessage = { text, imageUrl, videoUrl,audioUrl, sender: currentUser };
    socket?.send(JSON.stringify(newMessage));
    console.log('Dispatching to Redux:', newMessage);
    dispatch(addMessage(newMessage));
  };


  useEffect(() => {
    dispatch(clearChat());
  }, [selectedUser, dispatch]);

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

        const { userDetails } = response.data;
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
                    height: "30px",
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
          {/* <i
            className="fa fa-search"
            aria-hidden="true"
            style={{ fontSize: "18px", color: "black", marginRight: "25px" }}
          ></i>
          <div
            className="fa fa-ellipsis-v"
            style={{ fontSize: "18px", color: "black", marginRight: "15px" }}
          ></div> */}
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

  if (parsedMessage) {
    const messageTime = moment().format('LT'); 
    if (parsedMessage.imageUrl) {
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
            <img src={parsedMessage.imageUrl} alt="Received Image" className="received-image" />
            <div className="message-timestamp">{messageTime}</div>
          </div>
        </div>
      );
    }
    else if (parsedMessage.text) {
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
            <div className="message-timestamp">{messageTime}</div>
          </div>
        </div>
      );
    }
    else if (parsedMessage.videoUrl) {
     
      const videoPath = parsedMessage.videoUrl;
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
            <div className="video-container">
              
          <video controls>
          <source src={baseUrl+`videos/${videoPath}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <a
              href={ baseUrl+`videos/${videoPath}`}
              download ={`video_${index}.mp4`} 
              className="download-link">
                <i class="fa fa-arrow-circle-o-down" aria-hidden="true"></i>
              </a>
            </div>
            <div className="message-timestamp">{messageTime}</div>
          </div>
        </div>
      );
    }

    else if (parsedMessage.audioUrl) {
     
      const audioPath = parsedMessage.audioUrl;
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
            <div className="audio-container">
              
          <audio controls>
          <source src={baseUrl+`audios/${audioPath}`} type="video/mp4" />
          Your browser does not support the video tag.
        </audio>
        <a
              href={ baseUrl+`audios/${audioPath}`}
              download ={`audio_${index}.mp3`} 
              className="download-link">
                <i class="fa fa-arrow-circle-o-down" aria-hidden="true"></i>
              </a>
            </div>
            <div className="message-timestamp">{messageTime}</div>
          </div>
        </div>
      );
    }
  } else {
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
