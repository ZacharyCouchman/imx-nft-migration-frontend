import { Button, Card, CardBody, CardFooter, Heading, Text, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { passportInstance, zkEVMProvider } from "../../immutable/passport";
import { UserProfile } from "@imtbl/sdk/passport";
import { parseJwt } from "../../utils/jwt";
import { shortenAddress } from "../../utils/walletAddress";

export const Destination = () => {

  const [passportUserInfo, setPassportUserInfo] = useState<UserProfile | null>(null);
  const [passportAddress, setPassportAddress] = useState<string>("");

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
          <Text>Connect to your Passport wallet</Text>
          <Text>Email: {passportUserInfo?.email}</Text>
          <Text>Wallet address: {shortenAddress(passportAddress)}</Text>
        </VStack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
        {!passportUserInfo && <Button colorScheme="pink" onClick={connectPassport}>Connect Passport</Button>}
      </CardFooter>
    </Card>
  )
}
