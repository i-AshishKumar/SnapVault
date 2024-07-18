import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Buffer } from 'buffer';

import { useApiGateway } from '../context/ApiGatewayContext';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Image,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const navigate = useNavigate();
  //const api_endpoint = "https://wix1azv9n1.execute-api.us-east-1.amazonaws.com/"
  const api_endpoint = useApiGateway()

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('');
  const webcamRef = useRef(null);
  const toast = useToast();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const registerUser = async (e) => {
    e.preventDefault();
    const fileName = `${firstName}_${lastName}`;
    const base64Image = image.split(',')[1];
    const binaryImage = Buffer.from(base64Image, 'base64');

    try {
      await fetch(`${api_endpoint}dev/user-faces-cloud-term-2024/${fileName}.jpeg`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: binaryImage,
      });
      setUploadResultMessage('Registration successful!');
      toast({
        title: 'Success!',
        description: 'Registration successful!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate("/login")
    } catch (error) {
      setUploadResultMessage('Registration failed. Try again.');
      toast({
        title: 'Error!',
        description: 'Registration failed. Try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.log(error);
    }
    
  };

  const handleFirstNameChange = (e) => {
    const trimmedValue = e.target.value.replace(/\s/g, '');
    setFirstName(trimmedValue);
  };

  const handleLastNameChange = (e) => {
    const trimmedValue = e.target.value.replace(/\s/g, '');
    setLastName(trimmedValue);
  };

  return (
    <Box maxW="md" mx="auto" p={4} borderWidth={1} borderRadius="lg" overflow="hidden">
      <Heading as="h2" size="xl" textAlign="center" mb={4}>
        Register Your Face
      </Heading>
      <form onSubmit={registerUser}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              type='text'
              placeholder='First Name'
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              type='text'
              placeholder='Last Name'
              value={lastName}
              onChange={handleLastNameChange}
            />
          </FormControl>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality ={1}
            width={250}
            height={250}
            style={{ alignSelf: 'center' }}
          />
          <Button onClick={capture}>Capture photo</Button>
          <Button type='submit' colorScheme='teal' isDisabled={!image}>Register</Button>
        </Stack>
      </form>
      {uploadResultMessage && (
        <Text mt={4} color={uploadResultMessage.includes('successful') ? 'green.500' : 'red.500'}>
          {uploadResultMessage}
        </Text>
      )}
      {image && <Image src={image} alt="Captured" height={250} width={250} mt={4} />}
    </Box>
  );
};

export default RegistrationForm;
