import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Chatmessage = ({ text, sender }) => {
  // const chats = useSelector(state => state.chat.chats);
  [chats, setChats] = useState([]);

  const messageStyle = {
    padding: '5px',
    borderRadius: '5px',
    margin: '5px',
    backgroundColor: sender === 'me' ? '#dcf8c6' : '#fff',
    alignSelf: sender === 'me' ? 'flex-end' : 'flex-start',
  };

  const textStyle = {
    margin: '0',
    wordWrap: 'break-word',
  };

  return (
    <div>
      {chats.map((message, index) => (
        <div key={index} className={message.sender === 'me' ? 'my-message' : 'other-message'}>
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default Chatmessage;
