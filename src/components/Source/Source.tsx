import { Button, Card, CardBody, Flex, Heading, Image as ChakraImage, Link, Spinner, Text, VStack, useToast } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import { getNFTsForAddress } from "../../apis/migration";
import { Contract } from "ethers";
import { TransactionResponse, Web3Provider } from "@ethersproject/providers";
import { SOURCE_TOKEN_ABI } from "../../config/migration";
import { TokenBurn } from "../../types/migration";
import { MigrationContext } from "../../contexts/MigrationContext";
import config, { applicationEnvironment } from "../../config/config";

export const Source = () => {
  const { provider, walletAddress } = useContext(EIP1193Context);
  const { successfulBurns, setSuccessfulBurns, correctWalletMap } = useContext(MigrationContext);
  const toast = useToast();

  const [fetchNFTsLoading, setFetchNFTsLoading] = useState(false);
  const [sourceNFTs, setSourceNFTs] = useState<{tokenId: string}[]>([]);

  const [burnLoading, setBurnLoading] = useState(false);

  const fetchNFTs = useCallback(async () => {
    setFetchNFTsLoading(true);
    const results = await getNFTsForAddress(walletAddress, config[applicationEnvironment].migration.sourceTokenAddress);
    setSourceNFTs(results || []);
    setFetchNFTsLoading(false);
  }, [walletAddress])

  const burnNFT = useCallback(async (tokenId: string) => {
    if(!provider || !provider.request) return;

    if(!correctWalletMap) {
      toast({
        status: 'error',
        duration: 4000,
        position: 'bottom-right',
        title: 'Please correct your wallet mapping before proceeding'
      })
      return;
    }

    // Check network first
    const currentProviderChain = await provider!.request({method: 'eth_chainId'});
    if(currentProviderChain !== config[applicationEnvironment].migration.sourceChainId) {
      // must switch to source chain
      try {
        await provider.request({method: 'wallet_switchEthereumChain', params: [{chainId: `0x${config[applicationEnvironment].migration.sourceChainId.toString(16)}`}]})
      } catch(err) {
        console.log(err);
        return;
      }
    }

    let burnTransaction: TransactionResponse | null = null;
    setBurnLoading(true);
    const web3Provider = new Web3Provider(provider);
    try{
      const sourceNFTContract = new Contract(
        config[applicationEnvironment].migration.sourceTokenAddress,
        SOURCE_TOKEN_ABI,
        web3Provider.getSigner()
      )
      burnTransaction = await sourceNFTContract.safeTransferFrom(walletAddress, config[applicationEnvironment].migration.burnAddress, tokenId);
      toast({
        position: 'bottom-right',
        status: 'success',
        duration: 4000,
        title: 'Burn transaction sent, please wait...'
      })
      console.log(burnTransaction);
      console.log('Waiting for transaction...')
    } catch(err) {
      console.log(err);
      console.log("There was an error sending the transaction");
      setBurnLoading(false);
    }
    if(!burnTransaction) return;

    try{
      const receipt = await burnTransaction.wait(1);
      console.log(receipt);
      if(receipt.status === 1){
        console.log('Success')
        setSuccessfulBurns((prev) => [{tokenId, transactionHash: receipt.transactionHash}, ...prev])
        toast({
          position: 'bottom-right',
          status: 'success',
          duration: 4000,
          title: 'Token burn successful'
        })
      } else {
        console.log('Transaction reverted');
        toast({
          position: 'bottom-right',
          status: 'error',
          duration: 4000,
          title: 'Token burn failed, transaction reverted'
        })
      }
    } catch(err) {
      console.log(err);
    } finally {
      setBurnLoading(false);
    }
  }, [correctWalletMap, provider, setSuccessfulBurns, toast, walletAddress])

  useEffect(() => {
    if(correctWalletMap) {
      fetchNFTs();
    } else {
      setSourceNFTs([]);
    }
  }, [correctWalletMap, fetchNFTs])

  return (
    <Card minH={"600px"} minW="xs" w={["100%", "430px"]} bgColor={'rgba(0,0,0,0.75)'}>
      <CardBody>
        <VStack h={"560px"} overflowY={"scroll"} gap={2} alignItems={"center"}>
          <Heading size="md">{config[applicationEnvironment].migration.sourceChainName}</Heading>
          <Text>Connect to your wallet that holds the NFTs</Text>
          <ChakraImage src={config[applicationEnvironment].migration.sourceCollectionImage} width={200} alt="Source Collection Image" borderRadius={8} />
          {fetchNFTsLoading && <Spinner />}
          {!fetchNFTsLoading && !burnLoading && sourceNFTs.length > 0 && sourceNFTs.map((sourceNFT) => {
            const matchingBurn = successfulBurns.find((burn: TokenBurn) => burn.tokenId === sourceNFT.tokenId);
            return (
              <Flex key={sourceNFT.tokenId} w={'100%'} flexDirection={'row'} gap={4} justifyContent={'center'} alignItems={'center'}>
                {matchingBurn 
                  ? <Link color="pink" href={`https://polygonscan.com/tx/${matchingBurn?.transactionHash ?? ''}`} target="_blank">Inspect txn for {matchingBurn.tokenId}</Link>
                  : <Button colorScheme="pink" onClick={() => burnNFT(sourceNFT.tokenId)}>Migrate token {sourceNFT.tokenId}</Button>  
                }
              </Flex>
            )}
          )}
          {burnLoading && (
            <Flex flexDirection={"column"} gap={6} justifyContent={'center'} alignItems={'center'}>
              <Heading>Migration request</Heading>
              <Text>Confirm the transaction in your wallet</Text>
              <Spinner  />
            </Flex>
          )}
        </VStack>
      </CardBody>
    </Card>
  )
}

