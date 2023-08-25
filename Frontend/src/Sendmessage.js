import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, createChatRoom } from './redux/slices/chats'
import axios from 'axios';
import { baseUrl } from './helpers';
import AudioRecorder from './Audiorecorder';
import  EmojiPicker  from 'emoji-picker-react';
import moment from 'moment';

const Sendmessage = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const userlist = useSelector((state) => state.user.userList);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const [mediaType, setMediaType] = useState(null); 
  const [imageData, setImageData] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

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
        setImageData(e.target.result);
      };
      reader.readAsDataURL(selectedImage); 
    }
  };


  const videoUpload = async (files) => {
    if (files[0] !== undefined) {
      const formData = new FormData();
      formData.append('userfile', files[0]); 
  
      const config = {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      };
  
      try {
        const response = await axios.post(baseUrl+'api/upload-video', formData, config);
        console.log(response);
        console.log(response.data.path);
        if (response) {
          setVideo(response.data.path);
          // console.log('video updated successfully');
          // alert('Video uploaded successfully');
        } else {
          console.error('Failed to upload');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };


  const recordAudio = async (audioBlob) => {
    if (audioBlob !== undefined) {
      const formData = new FormData();
      formData.append('audiofile', audioBlob);
  
      const config = {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      };
  
      try {
        const response = await axios.post(baseUrl+'api/upload-audio', formData, config);
        console.log(response);
        console.log(response.data.path);
        if (response) {
          
          setAudio(response.data.path);
          alert('Please Click Send Button to send audio');
        } else {
          console.error('Failed to upload');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const selectEmoji = (emojiObject) => {
    setSelectedEmoji(emojiObject.emoji);
    setMessage(message + emojiObject.emoji); 
    setShowEmojiPicker(false); 
  };

  const selectedUserId = userlist.find(user => user.name === selectedUser).id;
  // console.log(selectedUserObject);

  const send = async () => {
    const newMessage = {
      text: message,
      senderId: userDetails.id,
      receiverId: selectedUserId,
      imageUrl: imageData,
      videoUrl: video,
    audioUrl: audio,
    created_at: moment().format('h:mm A'),
    };


      try {
        const response = await axios.post(baseUrl + 'api/chats', newMessage
        );

        const { status, chatRoomId, messageId } = response.data;

        if (status) {
          dispatch(createChatRoom({ id: chatRoomId, user1: userDetails.id, user2: selectedUser.id }));
          dispatch(addMessage({ ...newMessage, id: messageId }));
          // onSendMessage(newMessage.text, newMessage.imageUrl); 
          onSendMessage(JSON.stringify(newMessage));
          setMessage('');
          setImageData(null);
          setVideo(null);
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
      {showEmojiPicker && (
        <div style={{ position: 'absolute', bottom: '60px', right: '10px' }}>
          <EmojiPicker onEmojiClick={selectEmoji} />
        </div>
      )}

      <span
        style={{ fontSize: '25px', marginRight: '20px', cursor: 'pointer' }}
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        <i className="fa fa-smile-o" aria-hidden="true"></i>
      </span>


    
    <label
  htmlFor="fileInput"
  style={{ fontSize: '25px', marginRight: '20px', cursor: 'pointer' }}
>
  <i
    className="fa fa-paperclip"
    aria-hidden="true"
    onClick={() => {
      if (!mediaType) {
        document.getElementById('fileInput').click();
      }
    }}
  ></i>
</label>
<input
  type="file"
  id="fileInput"
  accept="image/*, video/*"
  style={{ display: 'none' }}
  onChange={(e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFileType = e.target.files[0].type.startsWith('image') ? 'image' : 'video';
      setMediaType(selectedFileType);

      if (selectedFileType === 'image') {
        alert('Please Click Send Button to send Image');
        imageUpload(e);
      } else if (selectedFileType === 'video') {
        alert('Please Click Send Button to send video');
        videoUpload(e.target.files);
      }
    } else {
      setMediaType(null); 
    }
  }}
/>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        style={inputStyle}
      />
      
<span>
<AudioRecorder onRecordingStop={recordAudio} />
</span>
      <i
        className="fa fa-paper-plane-o"
        aria-hidden="true"
        onClick={send}
        
        style={{ marginLeft: '10px', padding: 5, fontSize: '18px' }}
      >
        
      </i>
    </div>
  );
};

export default Sendmessage;