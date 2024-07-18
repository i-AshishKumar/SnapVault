import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  Image,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { useApiGateway } from '../context/ApiGatewayContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setRekognitionId } = useAuth(); // Destructure the setRekognitionId function from the useAuth hook

  const [uploadResultMessage, setUploadResultMessage] = useState('');
  const [isAuth, setAuth] = useState(false);
  const [image, setImage] = useState('');
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // const api_endpoint = "https://wix1azv9n1.execute-api.us-east-1.amazonaws.com"
  const api_endpoint = useApiGateway()
  console.log(api_endpoint)
  async function authenticate(visitorImageName) {
    const requestUrl = `${api_endpoint}dev/user?` + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`,
    });

    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => console.log(error));
  }

  function sendImage(e) {
    e.preventDefault();
    const visitorImageName = uuidv4();

    const base64Image = image.split(',')[1];
    const binaryImage = Buffer.from(base64Image, 'base64');

    fetch(`${api_endpoint}dev/visitor-faces-cloud-term-2024/${visitorImageName}.jpeg`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: binaryImage,
    })
      .then(async () => {
        const response = await authenticate(visitorImageName);
        if (response.Message === 'Success') {
          setAuth(true);
          setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, Welcome to work!`);
          toast({
            title: 'Logged in!',
            description: `Hi ${response['firstName']} ${response['lastName']}!`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          setRekognitionId(response['rekognitionId']); // Set the rekognitionId in the context
          navigate(`/welcome/${response['firstName']}_${response['lastName']}`, { state: { rekognitionId: response['rekognitionId'], fname: response['firstName'] } });
        } else {
          setAuth(false);
          setUploadResultMessage('Person not Authenticated');
          toast({
            title: 'Error!',
            description: 'Person not Authenticated',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        setAuth(false);
        setUploadResultMessage("There's an error during authentication. Try again.");
        toast({
          title: 'Error!',
          description: "There's an error during authentication. Try again.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.log(error);
      });
  }

  return (
    <Box maxW="md" mx="auto" p={4} borderWidth={1} borderRadius="lg" overflow="hidden">
      <Heading as="h1" size="xl" textAlign="center" mb={4}>
        Authenticate your Face
      </Heading>
      <Stack spacing={4} align="center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          width={250}
          height={250}
          style={{ alignSelf: 'center' }}
        />
        <Button onClick={capture}>Capture photo</Button>
        <form onSubmit={sendImage}>
          <Button type='submit' colorScheme='teal' mt={4} isDisabled={!image}>Authenticate</Button>
        </form>
        <Text mt={4} color={isAuth ? 'green.500' : 'red.500'}>
          {uploadResultMessage}
        </Text>
        {image && <Image src={image} alt="Captured" height={250} width={250} mt={4} />}
      </Stack>
    </Box>
  );
}

export default LoginForm;
