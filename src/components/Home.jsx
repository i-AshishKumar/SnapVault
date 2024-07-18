import React from 'react';
import { Box, Heading } from '@chakra-ui/react';


function Home() {
  return (
    <Box p={8} maxW="xl" mx="auto" mt={8}>
      <Heading as="h1" size="xl" textAlign="center">
        You are on Home
      </Heading>
    </Box>
  );
}

export default Home;