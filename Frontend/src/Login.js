import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from './helpers';
import { fetchUserList } from './redux/slices/user';

const Login = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState(null); 
  // const userList = useSelector(state => state.user.userList);
  // const roomUserList = useSelector(state => state.user.roomUserList)


  // useEffect(() => {
  //   const token = localStorage.getItem('authToken');
  //   if (token) {
  //     setError('You are already logged in.');
  //   }
  // }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const data = {
        email: email,
        password: password,
      };
      const response = await axios.post(baseUrl + 'api/login', data);
  
      if (response.data.status) {
        localStorage.setItem('authToken', response.data.token);
        setUserDetails(response.data.user);
  

        const [userListResponse, roomDetailsResponse] = await Promise.all([
          axios.get(baseUrl + 'api/user-list', {
            headers: {
              Authorization: response.data.token,
            },
          }),
          axios.get(baseUrl + 'api/room-details', {
            headers: {
              Authorization: response.data.token,
            },
          }),
        ]);
  
        const userList = userListResponse.data.userDetails;
        // console.log(userList);
        const roomUserList = roomDetailsResponse.data.roomDetails;
        // console.log(roomUserList);
      
  
        dispatch(fetchUserList({ userList, roomUserList }));
        navigate('/inbox');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Login failed');
    }
  };
  
  
  
  // const roomDetail = async (userId) => {
  //   try {
  //     const token = localStorage.getItem('authToken');
  //     if (token) {
  //       const response = await axios.get(baseUrl + 'api/room-details', {
  //         headers: {
  //           Authorization: token,
  //         },
  //       });
  //       console.log(response);
  //       dispatch(fetchUserList()); 
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  
  return (
    
<div style={{ backgroundColor: 'rgb(164 164 164)', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <center>
        <h2>Welcome to App</h2>
        <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card style={{ width: '18rem' }}>
            <Card.Body style={{ backgroundColor: 'rgb(208, 208, 208)', color: 'black' }}>
              <Card.Title>Please login</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Control type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <div className="mt-3"></div>
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <div className="mt-3"></div>
                </Form.Group>
                {error && <div className="text-danger">{error}</div>}
                <div className="mt-3"></div>
                <Button variant="dark" type="submit" style={{ width: '100%' }}> Sign In </Button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  Don't have an Account? <Link to="/register" style={{ color: 'black' }}>Register</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </center>
    </div>

  
      );
};

export default Login;