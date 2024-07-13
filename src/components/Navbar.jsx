import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { rekognitionId, setRekognitionId } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRekognitionId(null);
    navigate('/');
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="teal.400"
      color="white"
      mb={5}
    >
      <Flex align="center" mr={5}>
        <Link to="/">
          <Button variant="link" color="white" _hover={{ textDecoration: 'none', color: 'gray.300' }}>
            Home
          </Button>
        </Link>
      </Flex>

      <Flex align="center">
        {rekognitionId ? (
          <Button variant="link" color="white" onClick={handleLogout} _hover={{ textDecoration: 'none', color: 'gray.300' }}>
            Logout
          </Button>
        ) : (
          <>
            <Link to="/login">
              <Button variant="link" color="white" mr={4} _hover={{ textDecoration: 'none', color: 'gray.300' }}>
                Login with Your Face
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="link" color="white" _hover={{ textDecoration: 'none', color: 'gray.300' }}>
                Register with Your Face
              </Button>
            </Link>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
