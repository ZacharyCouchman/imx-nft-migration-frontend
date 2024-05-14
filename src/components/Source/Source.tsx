import { Button, Card, CardBody, CardFooter, Heading, Text, VStack } from "@chakra-ui/react"
import { useContext, useState } from "react";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import {useWeb3Modal} from "@web3modal/ethers5/react"

export const Source = () => {
  const { provider, walletAddress } = useContext(EIP1193Context);

  const {open} = useWeb3Modal()

  const [fetchNFTsLoading, setFetchNFTsLoading] = useState(false)

  const fetchNFTs = async () => {
    setFetchNFTsLoading(true);
    setTimeout(() => {
      setFetchNFTsLoading(false);
    }, 1000)
  }


  return (
    <Card minH={"600px"} minW="xs" w={["100%", "430px"]} bgColor={'rgba(0,0,0,0.75)'}>
      <CardBody>
        <VStack mt="6" gap={4} alignItems={"center"}>
          <Heading size="lg">Ethereum</Heading>
          <Text>Connect to your wallet that holds the NFTs</Text>
        </VStack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
        {(!provider || !walletAddress) && <Button colorScheme="blue" onClick={() => open()}>Connect Wallet</Button>}
        {provider && walletAddress  && <Button colorScheme="blue" isLoading={fetchNFTsLoading} loadingText="Loading" onClick={() => fetchNFTs()}>Check my NFTS</Button>}
      </CardFooter>
    </Card>
  )
}

