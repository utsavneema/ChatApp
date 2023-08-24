import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from './helpers';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(baseUrl+ 'api/register', {
        name: name,
        email: email,
        password: password,
      });
      console.log(response.data);
      // alert('User created successfully');
      setName('');
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      
        <center>

          <div
            style={{
              backdropFilter: 'blur(5px)',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgb(164 164 164)',
              flexDirection: 'column',
            }}
          >
          <h2>Welcome to ChatOn</h2>
          <br/> <br/>
            <h4>Please Register</h4>
            <br/>
            <Card style={{ width: '18rem' }}>
              <Card.Body style={{ backgroundColor: 'rgb(208, 208, 208)', color: 'white' }}>
                <Card.Title style={{color:'black'}}>Create Account</Card.Title>
                <Card.Subtitle className="mb-2 " style={{color:'black'}}>Please enter the following details</Card.Subtitle>
                <Form onSubmit={handleSubmit}>
                  <div className="mt-3"></div>
                  <Form.Group controlId="formName">
                    <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <div className="mt-3"></div>
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className="mt-3"></div>
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="mt-3"></div>
                  </Form.Group>
                  <div className="mt-3"></div>
                  <Button variant="dark" type="submit" style={{ width: '100%', color: 'white' }}>
                    Sign Up
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </center>
    </div>
  );
};

export default Register;