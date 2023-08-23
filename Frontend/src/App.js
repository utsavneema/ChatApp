import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Sidebar from './Sidebar';
import Register from './Register';
import Login from './Login';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path = '/register' element = {<Register/>}></Route>
    <Route path = '/' element={<Login/>}></Route>
    <Route path = '/inbox' element={<Sidebar/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
