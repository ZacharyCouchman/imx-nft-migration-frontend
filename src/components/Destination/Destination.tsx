import { Button, Card, CardBody, CardFooter, Flex, Heading, Text, VStack } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react";
import { passportInstance, zkEVMProvider } from "../../immutable/passport";
import { UserProfile } from "@imtbl/sdk/passport";
import { parseJwt } from "../../utils/jwt";
import { shortenAddress } from "../../utils/walletAddress";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import { getZkEvmNFTsForAddress } from "../../apis/immutable";
import { Nft } from "../../types/blockchainData";
import Countdown from "../Countdown/Countdown";

const DESTINATION_TOKEN_ADDRESS = '0xEc672172B6dc766Bc9656086b97B17162946e815';
const USE_PASSPORT = false;
export const Destination = () => {

  const {walletAddress} = useContext(EIP1193Context);

  const [passportUserInfo, setPassportUserInfo] = useState<UserProfile | null>(null);
  const [passportAddress, setPassportAddress] = useState<string>("");

  const [fetchNFTsRefresh, setFetchNFTsRefresh] = useState(false);
  const [fetchNFTsLoading, setFetchNFTsLoading] = useState(false);
  const [zkEvmNFTs, setZkEvmNFTs] = useState<Nft[]>([]);
  const [countdownEndTime, setCountdownEndTime] = useState(0);

  const connectPassport = async () => {
    try{
      const accounts = await zkEVMProvider.request({method: 'eth_requestAccounts'});
      setPassportAddress(accounts[0]);
      console.log(accounts);
      const userInfo = await passportInstance.getUserInfo();
      if(userInfo) {
        console.log(userInfo);
        setPassportUserInfo(userInfo);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchNFTs = useCallback(async () => {
    if(!walletAddress) return;
    setFetchNFTsRefresh(true);
    setCountdownEndTime((new Date().getTime() + 10000)/1000)
    setFetchNFTsLoading(true);
    const results = await getZkEvmNFTsForAddress(walletAddress, DESTINATION_TOKEN_ADDRESS);
    setZkEvmNFTs((results || []) as unknown as Nft[]);
    setFetchNFTsLoading(false);
  }, [walletAddress]);

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
    const loadPassportInfo = async () => {
      const userInfo = await passportInstance.getUserInfo();
      console.log(userInfo)
      if(userInfo) {
        setPassportUserInfo(userInfo);
      }
      const idToken = await passportInstance.getIdToken();
      if(idToken){
        const decoded = parseJwt(idToken);
        console.log(decoded)
        setPassportAddress(decoded.passport.zkevm_eth_address ?? '');
      }
    }
    loadPassportInfo();
  }, [])

  useEffect(() => {
    return () => {
      window.removeEventListener('refresh-zkevm-nfts', fetchNFTs)
    }
  }, [fetchNFTs])

  return (
    <Card minH={"600px"} minW="xs" w={["100%", "430px"]} bgColor={'rgba(0,0,0,0.75)'}>
      <CardBody>
        <VStack mt="6" gap={4} alignItems={"center"}>
          <Heading size="lg" overflowWrap={"break-word"}>Immutable zkEVM</Heading>
          {USE_PASSPORT && (
            <VStack gap={2} alignItems={"center"}>
              <Text>Connect to your Passport wallet</Text>
              <Text>Email: {passportUserInfo?.email}</Text>
              <Text>Wallet address: {shortenAddress(passportAddress)}</Text>
            </VStack>
          )}
          {!fetchNFTsLoading && zkEvmNFTs.length > 0 && zkEvmNFTs.map((zkEvmNFT: Nft) => (
              <Flex key={zkEvmNFT.token_id} flexDirection={'row'} gap={4} justifyContent={'center'} alignItems={'center'}>{zkEvmNFT.token_id}</Flex>
          ))}
        </VStack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
        {!fetchNFTsRefresh && walletAddress && <Button colorScheme="blue" onClick={handleFetchNFTsClick}>Fetch Immutable zkEVM NFTs</Button>}
        {fetchNFTsRefresh && (
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Flex gap={2} alignItems={'center'}>
              <Text size={'sm'} fontWeight={'bold'}>Refreshing your NFT list in:</Text><Countdown size="sm" deadlineEventTopic="refresh-zkevm-nfts" endTime={countdownEndTime} />
            </Flex>
            <Button size={'xs'} borderRadius={8} colorScheme="blue" onClick={stopRefresh}>Stop refresh</Button>
          </Flex>
          )}
        
        {USE_PASSPORT && !passportUserInfo && <Button colorScheme="pink" onClick={connectPassport}>Connect Passport</Button>}
      </CardFooter>
    </Card>
  )
}
