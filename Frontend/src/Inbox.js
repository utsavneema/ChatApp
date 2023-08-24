import React, { useState, useEffect } from "react";
import {useSelector, useDispatch} from 'react-redux'
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "./helpers";
import { Form, Button } from "react-bootstrap";
import { setSelectedUser, fetchUserList} from "./redux/slices/user"
import './Chatbox.css';

const Inbox = ({setShowChatbox}) => {
  // const chats = useSelector((state) => state.chat.chats);
  const dispatch = useDispatch();
  const userlist = useSelector((state) => state.user.userList);
  const roomUserList = useSelector((state)=> state.user.roomUserList);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const chattedBefore = roomUserList.length > 0;
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showRoomUserList, setShowRoomUserList] = useState(false)
  const [currentUser, setCurrentUser] = useState('');
  const [showCurrentUser, setShowCurrentUser] = useState(false);

 
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUserList, setFilteredUserList] = useState(userlist);

  const addChat = (userName) => {
    dispatch(setSelectedUser(userName))
    setShowChatbox(true);
  };

  useEffect(() => {
    const filteredUsers = userlist.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUserList(filteredUsers);
  }, [searchQuery, userlist]);

  useEffect(() => {
    setFilteredUserList(showRoomUserList ? roomUserList : userlist);
  }, [showRoomUserList, roomUserList, userlist]);
  useEffect(()=>{
    getUserDetail();
  })

  const handleUserCircleClick = () => {
    setShowCurrentUser(!showCurrentUser);
  };

  const getUserDetail = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.get(baseUrl + 'api/auth', {
          headers: {
            Authorization: token,
          },
        });

        const { status, userDetails } = response.data;
        setCurrentUser(userDetails.name);
      } catch (error) {
        console.error('Error', error);
      }
    }
  };

const currentName = () =>{
  setCurrentUser(currentUser) 
}

  return (
    <div className="inbox">
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
                    // width: "50px",
                    height: "30px",
                    borderRadius: "50%",
                    // marginRight: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={handleUserCircleClick}>
                </i>
                {showCurrentUser && (
            <h7 style={{  color:'black' }}>
              <b>{currentUser}</b></h7>
          )}
        <Link
          className="user"
          style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
           <h7 
           style={{marginRight:"40px", color: "black"}}
           ><b>Start ChatOn</b></h7>
          <i
            className="fa fa-users"
            style={{ fontSize: "18px", color: "black", marginRight: "10px" }}
            onClick={() => {
              setShowRoomUserList(false);
              setShowUserList(true);
            }}
          ></i>
         
          {/* <img
            src={"concentric.png"}
            style={{ width: "18px", height: "18px", marginRight: "35px" }}
            alt="Concentric Icon"
          />
          <i
            className="fa fa-comments"
            style={{ fontSize: "18px", color: "black", marginRight: "35px" }}
            
          ></i>
          <div
          // <i class="fa fa-sign-out" aria-hidden="true"></i>
            className="fa fa-ellipsis-v"
            style={{ fontSize: "18px", color: "black", marginRight: "15px" }}
          ></div> */}
        </Link>
      </div>

      <Form
        className="d-flex"
        style={{
          marginTop: "2px",
          alignItems: "center",
          width: "100%",
          marginLeft: "10px",
        }}
      >
        <div
          className="search-icon"
          style={{
            display: "flex",
            alignItems: "center",
            paddingRight: "30px",
            background: "#c3c3c3",
            border: "1px solid #ccc",
            borderRadius: "5px",
            position: "relative",
            width: "100%",
            
          }}
        >
          <i
            className="fa fa-search"
            aria-hidden="true"
            style={{
              color: "black",
              marginRight: "10px",
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          ></i>
          <Form.Control
            type="search"
            placeholder="Search or start new chat"
            className="search-input"
            style={{
              border: "none",
              outline: "none",
              boxShadow: "none",
              paddingLeft: "30px",
              width: "100%",
              background: "#c3c3c3",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div
          className="filter-icon"
          style={{ marginLeft: "10px", position: "relative" }}
        >
          <i
            className="fa fa-filter"
            aria-hidden="true"
            style={{ color: "black", marginRight: "10px", padding: "5px" }}
            onClick={() => {
              setShowRoomUserList(true);
              setShowUserList(false);
            }}
          ></i>
        </div>
      </Form>
      <div
        className="user-list-container"
        style={{
          paddingTop: 0,
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
        }}
      >
        <ul className="list-group">
          {filteredUserList.map((user) => (
            <li
              key={user.id}
              className="py-2 border-bottom cursor-pointer d-flex align-items-center"
              onClick={() => addChat(user.name)}
            >
                <i
                  className="fa fa-user-circle-o"
                  aria-hidden="true"
                  style={{
                    fontSize: "18px",
                    color: "black",
                    width: "50px",
                    height: "50px",
                    
                    borderRadius: "50%",
                    
                    display: "flex",
                    alignItems: "center",
                  }}
                ></i>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className={`chat-username ${selectedUser === user.name ? 'selected-user' : ''}`}>
                    {user.name}
                  </div>
                </div>
              </div>
              <div
                      style={{ alignSelf: "flex-end", marginRight: "10px" }}
                      className="d-flex align-items-center"
                    >
                      {/* <Button
                        variant="dark"
                        onClick={() => addChat(user.name)}
                      >
                        Add
                      </Button> */}
                    </div>
            </li>
          ))}
        </ul>
      </div>
          </div>
  );
};

export default Inbox;
