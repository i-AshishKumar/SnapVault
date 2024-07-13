import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [rekognitionId, setRekognitionId] = useState(null);

  return (
    <AuthContext.Provider value={{ rekognitionId, setRekognitionId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
