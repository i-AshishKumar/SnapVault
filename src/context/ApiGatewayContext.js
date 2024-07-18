import React, { createContext, useContext, useState, useEffect } from 'react';
import AWS from 'aws-sdk';

// Create the context
const ApiGatewayContext = createContext();

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
    region: 'us-east-1'
  });
const ssm = new AWS.SSM();


// Create a provider component
export const ApiGatewayProvider = ({ children }) => {
  const [apiGatewayUrl, setApiGatewayUrl] = useState('');

  useEffect(() => {
    async function fetchApiGatewayUrl() {
      try {
        const params = {
          Name: 'api-endpoint',
          WithDecryption: false
        };
        const data = await ssm.getParameter(params).promise();
        setApiGatewayUrl(data.Parameter.Value);
      } catch (error) {
        console.error('Error fetching API Gateway URL:', error);
      }
    }

    fetchApiGatewayUrl();
  }, []);

  return (
    <ApiGatewayContext.Provider value={apiGatewayUrl}>
      {children}
    </ApiGatewayContext.Provider>
  );
};

// Custom hook to use the ApiGatewayContext
export const useApiGateway = () => {
  return useContext(ApiGatewayContext);
};
