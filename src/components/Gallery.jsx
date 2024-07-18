import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Heading,
  ButtonGroup,
  IconButton
} from '@chakra-ui/react';
import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import CaptureUpload from './CaptureUpload';

import { useAuth } from '../context/AuthContext';
import { useApiGateway } from '../context/ApiGatewayContext';



const Gallery = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [images, setImages] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

    // const api_endpoint = "https://wix1azv9n1.execute-api.us-east-1.amazonaws.com/"
    const api_endpoint = `${useApiGateway()}dev/gallery`
  
  const { rekognitionId } = useAuth();

  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isCaptureOpen, onOpen: onCaptureOpen, onClose: onCaptureClose } = useDisclosure();
  const userName = location.state['fname'];

  useEffect(() => {
    if (!rekognitionId) {
      navigate('/login'); // Redirect to login if rekognitionId is not available
      return;
    }
    fetchImages();
  }, [rekognitionId, navigate]);

  const fetchImages = async () => {
    const payload = JSON.stringify({
      body: {
        action: 'list',
        rekognitionId: rekognitionId,
      }
    });
    const response = await axios.post(api_endpoint, payload);
    console.log(response);
    const files = JSON.parse(response.data.body)['files'];
    const images = files.map(file => ({
      url: file.fileUrl,
      name: file.fileName
    }));
    setImages(images);
  };

  const handleFileInput = (e) => {
    setSelectedFiles(e.target.files);
  };

  const uploadFile = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64File = reader.result.split(',')[1];

      const payload = JSON.stringify({
        body: {
          action: 'upload',
          rekognitionId: rekognitionId,
          file: base64File,
          fileName: file.name,
        }
      });

      await axios.post(api_endpoint, payload);

      fetchImages();
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    Array.from(selectedFiles).forEach((file) => {
      uploadFile(file);
    });
    onUploadClose();
  };

  const refreshComponent = () => {
    fetchImages();
  };

  const handleDelete = async (fileName) => {
    const payload = JSON.stringify({
      body: {
        action: 'delete',
        rekognitionId: rekognitionId,
        fileName: fileName,
      }
    });

    await axios.post(api_endpoint, payload);
    fetchImages();
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageUrl.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box p={8} mx="auto" mt={8}>
      <Heading mb={2}>{userName}'s Gallery</Heading>
      <ButtonGroup spacing={4}>
        <Button colorScheme="teal" onClick={onUploadOpen}>
          Upload Images
        </Button>
        <Button colorScheme="blue" onClick={onCaptureOpen}>
          Capture Photo
        </Button>
        <Button colorScheme="green" onClick={refreshComponent}>
          Refresh
        </Button>
      </ButtonGroup>

      <SimpleGrid columns={[1, 2, 3]} spacing={5} mt={4}>
        {images.map((image, index) => (
          <Box key={index} position="relative" overflow="hidden">
            <Image
              src={image.url}
              alt={`User's file ${index}`}
              height="auto"
              width="100%"
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.05)' }}
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              bg="rgba(0, 0, 0, 0.6)"
              opacity="0"
              transition="opacity 0.2s"
              _hover={{ opacity: 1 }}
            >
              <ButtonGroup spacing={2}>
                <IconButton
                  colorScheme="red"
                  icon={<DeleteIcon />}
                  onClick={() => handleDelete(image.name)}
                />
                <IconButton
                  colorScheme="blue"
                  icon={<DownloadIcon />}
                  onClick={() => handleDownload(image.url)}
                />
              </ButtonGroup>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isUploadOpen} onClose={onUploadClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <input type="file" multiple onChange={handleFileInput} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleUpload}>
              Upload
            </Button>
            <Button variant="ghost" ml={3} onClick={onUploadClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <CaptureUpload isOpen={isCaptureOpen} onClose={onCaptureClose} onCapture={fetchImages} />
    </Box>
  );
};

export default Gallery;
