import { Button, Card, CardBody, CardFooter, Flex, Image, Heading, Text, VStack } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import { getZkEvmNFTsForAddress } from "../../apis/immutable";
import { Collection, Nft } from "../../types/blockchainData";
import Countdown from "../Countdown/Countdown";
import { zkEVMDataClient } from "../../immutable/blockchainData";
import { MigrationContext } from "../../contexts/MigrationContext";
import config, { applicationEnvironment } from "../../config/config";

interface Destination {
  passportAddress: string
}
export const Destination = ({
  passportAddress
}: Destination) => {
  const {walletAddress} = useContext(EIP1193Context);
  const { successfulBurns } = useContext(MigrationContext);

  const [fetchNFTsRefresh, setFetchNFTsRefresh] = useState(false);
  const [fetchNFTsLoading, setFetchNFTsLoading] = useState(false);
  const [zkEvmNFTs, setZkEvmNFTs] = useState<Nft[]>([]);
  const [countdownEndTime, setCountdownEndTime] = useState(0);

  const [collection, setCollection] = useState<Collection>();

  const fetchNFTs = useCallback(async () => {
    setFetchNFTsRefresh(true);
    setCountdownEndTime((new Date().getTime() + 10000)/1000)
    setFetchNFTsLoading(true);
    const results = await getZkEvmNFTsForAddress(passportAddress, config[applicationEnvironment].migration.destinationTokenAddress);
    setZkEvmNFTs((results || []) as unknown as Nft[]);
    setFetchNFTsLoading(false);
  }, [passportAddress]);

  const handleFetchNFTsClick = async () => {
    if(!walletAddress) return;
    window.addEventListener('refresh-zkevm-nfts', fetchNFTs);
    await fetchNFTs();
  }

  const stopRefresh = () => {
    window.removeEventListener('refresh-zkevm-nfts', fetchNFTs)
    setCountdownEndTime(0);
    setFetchNFTsRefresh(false);
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('refresh-zkevm-nfts', fetchNFTs)
    }
  }, [fetchNFTs])

  useEffect(() => {
    if(successfulBurns.length > 0) {
      window.addEventListener('refresh-zkevm-nfts', fetchNFTs);
      fetchNFTs();
    }
  }, [successfulBurns, fetchNFTs])

  useEffect(() => {
    const getCollection = async() => {
      try {
        const collectionResult = await zkEVMDataClient.getCollection({
          chainName: "imtbl-zkevm-testnet",
          contractAddress: config[applicationEnvironment].migration.destinationTokenAddress,
        })
        setCollection(collectionResult.result as unknown as Collection);
      } catch(err) {
        console.log("Failed to get zkEVM collection info")
        console.error(err)
      }
    }
    getCollection();
  }, []);

  return (
    <Card h={"600px"} minW="xs" w={["100%", "430px"]} bgColor={'rgba(0,0,0,0.75)'}>
      <CardBody>
        <VStack h={"450px"} overflowY={"scroll"} gap={2} alignItems={"center"} textAlign={'center'}>
          <Heading size="md" overflowWrap={"break-word"}>{config[applicationEnvironment].migration.destinationChainName}</Heading>
          <Text>Receive your NFTs on Immutable zkEVM after migration</Text>
          <Image src={collection?.image} width={200} alt="CryptoBirds" borderRadius={8} />
          {!fetchNFTsLoading && zkEvmNFTs.length > 0 && zkEvmNFTs.map((zkEvmNFT: Nft) => (
              <Flex key={zkEvmNFT.token_id} flexDirection={'row'} gap={4} justifyContent={'flex-start'} alignItems={'flex-start'} paddingX={4} paddingY={2} borderRadius={4}>
                <Heading size="sm" wordBreak={"break-word"}>zkEVM Token {zkEvmNFT.token_id}</Heading>
              </Flex>
          ))}
        </VStack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
        {(!fetchNFTsRefresh && walletAddress) 
          ? <Button colorScheme="blue" onClick={handleFetchNFTsClick}>Fetch Immutable zkEVM NFTs</Button>
          : null
        }
        {fetchNFTsRefresh ? (
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Flex gap={2} alignItems={'center'}>
              <Text size={'sm'} fontWeight={'bold'}>Refreshing in:</Text><Countdown size="sm" deadlineEventTopic="refresh-zkevm-nfts" endTime={countdownEndTime} />
            </Flex>
            <Button size={'xs'} borderRadius={8} colorScheme="blue" onClick={stopRefresh}>Stop refresh</Button>
          </Flex>
          )
          : null
        }
      </CardFooter>
    </Card>
  )
}
