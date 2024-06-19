import { Button, Card, CardBody, Flex, Heading, Image as ChakraImage, Link, Spinner, Text, VStack } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import { getNFTsForAddress } from "../../apis/migration";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/providers";
import { SOURCE_TOKEN_ABI } from "../../config/migration";
import { TokenBurn } from "../../types/migration";
import { MigrationContext } from "../../contexts/MigrationContext";
import config, { applicationEnvironment } from "../../config/config";
interface Source {
  passportAddress: string
}
export const Source = ({passportAddress}: Source) => {
  const { provider, walletAddress } = useContext(EIP1193Context);
  const { successfulBurns, setSuccessfulBurns } = useContext(MigrationContext);

  const [fetchNFTsLoading, setFetchNFTsLoading] = useState(false);
  const [sourceNFTs, setSourceNFTs] = useState<{tokenId: string}[]>([]);

  const [burnLoading, setBurnLoading] = useState(false);

  const fetchNFTs = useCallback(async () => {
    setFetchNFTsLoading(true);
    const results = await getNFTsForAddress(walletAddress, config[applicationEnvironment].migration.sourceTokenAddress);
    setSourceNFTs(results || []);
    setFetchNFTsLoading(false);
  }, [walletAddress])

  const burnNFT = async (tokenId: string) => {
    if(!provider) return;

    let burnTransaction: TransactionResponse | null = null;
    setBurnLoading(true);
    try{
      const sourceNFTContract = new Contract(
        config[applicationEnvironment].migration.sourceTokenAddress,
        SOURCE_TOKEN_ABI,
        provider.getSigner()
      )
      burnTransaction = await sourceNFTContract.safeTransferFrom(walletAddress, config[applicationEnvironment].migration.burnAddress, tokenId);
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
      } else {
        console.log('Transaction reverted');
      }
    } catch(err) {
      console.log(err);
    } finally {
      setBurnLoading(false);
    }
  }

  useEffect(() => {
    if(walletAddress && passportAddress) {
      fetchNFTs();
    } else {
      setSourceNFTs([]);
    }
  }, [walletAddress, passportAddress, fetchNFTs])

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

