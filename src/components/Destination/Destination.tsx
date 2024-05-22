import { Button, Card, CardBody, CardFooter, Flex, Heading, Text, VStack } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react";
import { passportInstance, zkEVMProvider } from "../../immutable/passport";
import { UserProfile } from "@imtbl/sdk/passport";
import { parseJwt } from "../../utils/jwt";
import { shortenAddress } from "../../utils/walletAddress";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import { getZkEvmNFTsForAddress } from "../../apis/immutable";
import { Nft } from "../../types/blockchainData";

const DESTINATION_TOKEN_ADDRESS = '0xEc672172B6dc766Bc9656086b97B17162946e815';
const USE_PASSPORT = false;
export const Destination = () => {

  const {walletAddress} = useContext(EIP1193Context);

  const [passportUserInfo, setPassportUserInfo] = useState<UserProfile | null>(null);
  const [passportAddress, setPassportAddress] = useState<string>("");

  const [fetchNFTsLoading, setFetchNFTsLoading] = useState(false);
  const [zkEvmNFTs, setZkEvmNFTs] = useState<Nft[]>([]);

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

  const fetchNFTs = async () => {
    if(!walletAddress) return;
    setFetchNFTsLoading(true);
    const results = await getZkEvmNFTsForAddress(walletAddress, DESTINATION_TOKEN_ADDRESS);
    setZkEvmNFTs((results || []) as unknown as Nft[]);
    setFetchNFTsLoading(false);
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
        {walletAddress && <Button colorScheme="blue" onClick={fetchNFTs}>Fetch Immutable zkEVM NFTs</Button>}
        {USE_PASSPORT && !passportUserInfo && <Button colorScheme="pink" onClick={connectPassport}>Connect Passport</Button>}
      </CardFooter>
    </Card>
  )
}
