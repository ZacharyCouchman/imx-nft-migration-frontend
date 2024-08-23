// App.tsx
import { Box, Flex, Spinner, Button, Heading, useToast } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { Source } from './components/Source/Source';
import { Destination } from './components/Destination/Destination';
import { createWeb3Modal } from '@web3modal/ethers5/react'
import { ethersConfig, mainnet, polygon, projectId } from './config/web3modal';
import config, { applicationEnvironment } from './config/config';
import { EIP1193Context } from './contexts/EIP1193Context';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { SOURCE_TOKEN_ABI } from './config/migration';
import { WalletMapping } from './components/WalletMapping/WalletMapping';
import { MigrationContext } from './contexts/MigrationContext';

// Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet, polygon],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  themeMode: 'dark',
  themeVariables: {
    '--w3m-border-radius-master': '1px'
  }
})

const BACKGROUND_IMAGE_URL = "https://assets-global.website-files.com/646557ee455c3e16e4a9bcb3/646557ee455c3e16e4a9be6b_Iridescent%20Bitmap%20Blend.jpg";

function App() {
  const [sourceLoaded, setSourceLoaded] = useState<string>();
  const {provider, walletAddress, chainId} = useContext(EIP1193Context);
  const {passportAddress, setPassportAddress} = useContext(MigrationContext);
  const toast = useToast();
  const [mintLoading, setMintLoading] = useState(false);

  useEffect(() => {
    const src = BACKGROUND_IMAGE_URL;
    const img = new Image()
    img.src = src;
    img.onload = () => {
      setSourceLoaded(src);
    }
  }, [])

  /**
   * Function will need updating to match contract mint function
   */
  const handleOriginNFTMint = async () => {
    if(!provider || !walletAddress) return;
    setMintLoading(true);

    // Check network first
    if(chainId !== config[applicationEnvironment].migration.sourceChainId) {
      // must switch to source chain
      try {
        await provider.request!({method: 'wallet_switchEthereumChain', params: [{chainId: `0x${config[applicationEnvironment].migration.sourceChainId.toString(16)}`}]})
      } catch(err) {
        console.log(err);
        setMintLoading(false);
        return;
      }
    }
    
    let mintTransaction: TransactionResponse | null = null;
    // setBurnLoading(true);
    try{
      const web3Provider = new Web3Provider(provider);
      const sourceNFTContract = new Contract(
        config[applicationEnvironment].migration.sourceTokenAddress,
        SOURCE_TOKEN_ABI,
        web3Provider.getSigner()
      )
      mintTransaction = await sourceNFTContract.mint(walletAddress);
      toast({
        position: 'bottom-right',
        status: 'success',
        duration: 4000,
        title: 'Minting token, please wait...'
      })
      console.log(mintTransaction);
      console.log('Waiting for transaction...')
    } catch(err) {
      console.log(err);
      console.log("There was an error sending the transaction");
      setMintLoading(false);
    }
    if(!mintTransaction) return;

    try{
      const receipt = await mintTransaction.wait(1);
      console.log(receipt);
      if(receipt.status === 1){
        toast({
          position: 'bottom-right',
          status: 'success',
          duration: 4000,
          title: 'Token minted'
        })
      } else {
        console.log('Transaction reverted');
      }
    } catch(err) {
      console.log(err);
    } finally {
      setMintLoading(false);
    }
  }

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
        {/* <AppHeaderBar /> */}
        {config[applicationEnvironment].migration.allowOriginMint && 
          <Button 
            colorScheme='blue' 
            p={4} 
            size={"small"} 
            position={"absolute"} 
            top={4} 
            left={4} 
            onClick={handleOriginNFTMint}
            zIndex={10}
            isLoading={mintLoading}
            >Mint Origin NFT</Button>
        }
        <Box zIndex={1} paddingX={4} paddingY={4}>
          <Heading color='black'>NFT Migration</Heading>
        </Box>
        <WalletMapping passportAddress={passportAddress} setPassportAddress={setPassportAddress} />
        <Flex 
          w={"100%"} 
          flexDir={["column", "column", "column", "row"]} 
          justifyContent={"space-evenly"} 
          alignItems={"center"}
          gap={4}
        >
          <Source />
          <Destination />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
