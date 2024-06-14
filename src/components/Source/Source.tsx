import { Button, Card, CardBody, CardFooter, Flex, Heading, Image, Spinner, Text, VStack } from "@chakra-ui/react"
import { useContext, useState } from "react";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import {useWeb3Modal} from "@web3modal/ethers5/react"
import { getNFTsForAddress } from "../../apis/migration";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/providers";

const SOURCE_TOKEN_ADDRESS = "0x9a120e1219128d944feb53b76b018f4fffea1b0a";
const SOURCE_TOKEN_ABI_FOR_BURN = [
  "function burn(uint256 tokenId)"
]
export const Source = () => {
  const { provider, walletAddress } = useContext(EIP1193Context);

  const {open} = useWeb3Modal()

  const [fetchNFTsLoading, setFetchNFTsLoading] = useState(false);
  const [sourceNFTs, setSourceNFTs] = useState<{tokenId: string}[]>([]);

  const [burnLoading, setBurnLoading] = useState(false);


  const fetchNFTs = async () => {
    setFetchNFTsLoading(true);
    const results = await getNFTsForAddress(walletAddress, SOURCE_TOKEN_ADDRESS);
    setSourceNFTs(results || []);
    setFetchNFTsLoading(false);
  }

  const burnNFT = async (tokenId: string) => {
    if(!provider) return;

    let burnTransaction: TransactionResponse | null = null;
    setBurnLoading(true);
    try{
      const sourceNFTContract = new Contract(
        SOURCE_TOKEN_ADDRESS,
        SOURCE_TOKEN_ABI_FOR_BURN,
        provider.getSigner()
      )
      burnTransaction = await sourceNFTContract.burn(tokenId);
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
      } else {
        console.log('Transaction reverted');
      }
    } catch(err) {
      console.log(err);
    } finally {
      setBurnLoading(false);
    }
  }


  return (
    <Card minH={"600px"} minW="xs" w={["100%", "430px"]} bgColor={'rgba(0,0,0,0.75)'}>
      <CardBody>
        <VStack mt="6" gap={4} alignItems={"center"}>
          <Heading size="lg">Sepolia</Heading>
          <Text>Connect to your wallet that holds the NFTs</Text>
          <Image src="https://zacharycouchman.github.io/nft-project-metadata-immutable/cryptobirds.webp" width={200} alt="CryptoBirds" borderRadius={8} />
          {!fetchNFTsLoading && !burnLoading && sourceNFTs.length > 0 && sourceNFTs.map((sourceNFT) => (
            <Flex key={sourceNFT.tokenId} flexDirection={'row'} gap={4} justifyContent={'center'} alignItems={'center'}><Button onClick={() => burnNFT(sourceNFT.tokenId.toString())}>Migrate token {sourceNFT.tokenId}</Button></Flex>
          ))}
          {burnLoading && (
            <Flex flexDirection={"column"} gap={6} justifyContent={'center'} alignItems={'center'}>
              <Heading>Migration request</Heading>
              <Text>Confirm the transaction in your wallet</Text>
              <Spinner  />
            </Flex>
          )}
        </VStack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
        {(!provider || !walletAddress) && <Button colorScheme="blue" onClick={() => open()}>Connect Wallet</Button>}
        {provider && walletAddress  && <Button colorScheme="blue" isLoading={fetchNFTsLoading} loadingText="Loading" onClick={() => fetchNFTs()}>Check my NFTS</Button>}
      </CardFooter>
    </Card>
  )
}

