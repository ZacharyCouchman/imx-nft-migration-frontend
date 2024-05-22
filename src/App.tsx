// App.tsx
import { Box, Flex, Image as ChakraImage, Spinner } from '@chakra-ui/react';
import { AppHeaderBar } from './components/AppHeaderBar/AppHeaderBar';
import { useEffect, useState } from 'react';
import { Source } from './components/Source/Source';
import { Destination } from './components/Destination/Destination';
import { createWeb3Modal } from '@web3modal/ethers5/react'
import { Migrate } from './components/Migrate/Migrate';
import { ethersConfig, imtblzkEvmTestnet, projectId, sepolia } from './config/web3modal';

// Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [sepolia, imtblzkEvmTestnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#007dbb',
    '--w3m-color-mix-strength': 30,
    '--w3m-border-radius-master': '1px'
  }
})

const BACKGROUND_IMAGE_URL = "https://assets-global.website-files.com/646557ee455c3e16e4a9bcb3/646557ee455c3e16e4a9be6b_Iridescent%20Bitmap%20Blend.jpg";

function App() {
  const [sourceLoaded, setSourceLoaded] = useState<string>()

  useEffect(() => {
    const src = BACKGROUND_IMAGE_URL;
    const img = new Image()
    img.src = src;
    img.onload = () => {
      setSourceLoaded(src);
    }
  }, [])

  if(!sourceLoaded) {
    return (
      <Flex 
      flex={1} 
      flexDir={"column"} 
      justifyContent={"center"} 
      alignItems={"center"}
      w="100%" 
      bgColor={'white'}
      >
        <Spinner w={"50px"} h={"50px"} color='blue.300' /> 
      </Flex>
    )
  }
  
  return (
    <Flex 
      flex={1} 
      w="100%" 
      bgImage={BACKGROUND_IMAGE_URL}
      bgPosition={"center"}
      bgRepeat={"no-repeat"}
      bgSize={"cover"}
      >
      <Flex w={"100%"} flexDir={"column"} justifyContent={"flex-start"} alignItems={"center"} p={2}>
        <AppHeaderBar />
        <Box zIndex={1} paddingX={4} mb={10}>
          <ChakraImage 
            src="https://assets-global.website-files.com/646557ee455c3e16e4a9bcb3/646557ee455c3e16e4a9bcbe_immutable-logo.svg" 
            alt="Example Image" 
            width={["100%", "400px"]}
            />
          </Box>
          <Flex 
            w={"100%"} 
            flexDir={["column", "column", "column", "row"]} 
            justifyContent={"space-evenly"} 
            alignItems={"center"}
            gap={4}
          >
            <Source />
            <Migrate />
            <Destination />
          </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
