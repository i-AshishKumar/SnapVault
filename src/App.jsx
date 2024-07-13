import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm'
import Gallery from './components/Gallery';
import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {
  return (
      <>
      <AuthProvider>
        <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/welcome/:fullName" element={<Gallery />} />
          </Routes>
      </AuthProvider>
      </>

  );
}

export default App;
