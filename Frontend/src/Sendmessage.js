import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, createChatRoom } from './redux/slices/chats'
import axios from 'axios';
import { baseUrl } from './helpers';

const Sendmessage = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const userlist = useSelector((state) => state.user.userList);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const [image, setImage] = useState(null);
  // const chats = useSelector((state) => state.chat.chats);

  const dispatch = useDispatch();
  
  const inputStyle = {
    flex: '1',
    padding: '5px',
    borderRadius: '5px',
    marginRight: '10px',
    border: 'none',
    outline: 'none',
    backgroundColor: '#c3c3c3',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    height: '42px',
  };

  useEffect(() => {
    getUserDetail();
  }, []);

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
        setUserDetails(userDetails);
      } catch (error) {
        console.error('Error', error);
      }
    }
  };

  const imageUpload = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(selectedImage); 
    }
  };

  const selectedUserId = userlist.find(user => user.name === selectedUser).id;
  // console.log(selectedUserObject);

  const send = async () => {
    const newMessage = {
      text: message,
      senderId: userDetails.id,
      receiverId: selectedUserId,
      imageUrl: image,
    };


      try {
        const response = await axios.post(baseUrl + 'api/chats', 
        {
          senderId: userDetails.id,
          receiverId: selectedUserId,
          message: newMessage.text,
          imageUrl: newMessage.imageUrl,
        }
        );

        const { status, chatRoomId, messageId } = response.data;

        if (status) {
          dispatch(createChatRoom({ id: chatRoomId, user1: userDetails.id, user2: selectedUser.id }));
          dispatch(addMessage({ ...newMessage, id: messageId }));

          onSendMessage(JSON.stringify(newMessage));
          setMessage('');
          setImage(null);
        } else {
          console.error('Failed to create chat room');
        }
      } catch (error) {
        console.error('Error creating chat room', error);
      }
    };
  
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      send();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '40px',
      }}
    >
      <span style={{ fontSize: '25px', marginRight: '20px' }}>
        <i className="fa fa-smile-o" aria-hidden="true"></i>
      </span>
      <label htmlFor="imageInput" style={{ fontSize: '25px', marginRight: '20px', cursor: 'pointer' }}>
        <i className="fa fa-paperclip" aria-hidden="true"></i>
      </label>
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={imageUpload}

      />

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        style={inputStyle}
      />

      <i
        className="fa fa-paper-plane-o"
        aria-hidden="true"
        onClick={send}
        style={{ marginLeft: '10px', padding: 5, fontSize: '18px' }}
      ></i>
    </div>
  );
};

export default Sendmessage;