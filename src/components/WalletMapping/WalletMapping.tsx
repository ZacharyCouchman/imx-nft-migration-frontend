import { Button, Card, Flex, Text, theme, useToast } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react"
import { EIP1193Context } from "../../contexts/EIP1193Context"
import { shortenAddress } from "../../utils/walletAddress";
import { passportInstance, zkEVMProvider } from "../../immutable/passport";
import { UserProfile } from "@imtbl/sdk/passport";
import { parseJwt } from "../../utils/jwt";
import { useDisconnect, useWeb3Modal } from "@web3modal/ethers5/react";
import { createAddressMapping, getEOAAddressMapping, getPassportAddressMapping } from "../../apis/migration";
import { Web3Provider } from "@ethersproject/providers";
import { MigrationContext } from "../../contexts/MigrationContext";

interface WalletMapping {
  passportAddress: string;
  setPassportAddress: (address: string) => void
}
export const WalletMapping = ({
  passportAddress,
  setPassportAddress
}: WalletMapping) => {
  const {provider, walletAddress} = useContext(EIP1193Context);
  const { correctWalletMap, eoaAddressMapResult, setEOAAddressMapResult, passportAddressMapResult, setPassportAddressMapResult, walletMappingMessage} = useContext(MigrationContext);
  const {open} = useWeb3Modal()
  const { disconnect } = useDisconnect()
  const toast = useToast();

  const [passportUserInfo, setPassportUserInfo] = useState<UserProfile | null>(null);

  const [addressMapLoading, setAddressMapLoading] = useState(false);

  const connectPassport = async () => {
    try{
      const accounts = await zkEVMProvider.request({method: 'eth_requestAccounts'});
      setPassportAddress(accounts[0]);
      const userInfo = await passportInstance.getUserInfo();
      if(userInfo) {
        console.log(userInfo);
        setPassportUserInfo(userInfo);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchPassportAddressMapping = useCallback(async () => {
    const result = await getPassportAddressMapping(passportAddress);
    console.log(result)
    setPassportAddressMapResult(result);
  }, [passportAddress, setPassportAddressMapResult]);

  const fetchEOAAddressMapping = useCallback(async () => {
    setAddressMapLoading(true);
    try{
      const result = await getEOAAddressMapping(walletAddress);
      console.log(result)
      if(result) {
        setEOAAddressMapResult(result);
      } else {
        await fetchPassportAddressMapping();
      }
    } catch(err) {
      console.log(err)
    }
    setAddressMapLoading(false);
  }, [walletAddress, setEOAAddressMapResult, fetchPassportAddressMapping])

  const createAddressMap = async () => {
    if(!provider) return;

    const web3Provider = new Web3Provider(provider);
    setAddressMapLoading(true);
    let signature: string = "";
    try{
      signature = await web3Provider.getSigner().signMessage(`I want to map my EOA address to my Passport address. Here is my Passport adddress: ${passportAddress}`);
    } catch(error) {
      console.error(error)
      setAddressMapLoading(false)
    }

    if(signature === "") return;

    try{
      await createAddressMapping(walletAddress, signature)
      toast({
        position: 'bottom-right',
        status: 'success',
        duration: 4000,
        title: 'Addresses mapped successfully'
      })
      await fetchEOAAddressMapping();
    } catch(err) {
      console.log(err);
    }
    
    setAddressMapLoading(false);
  }

  useEffect(() => {
    const loadPassportInfo = async () => {
      const userInfo = await passportInstance.getUserInfo();
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
  }, [setPassportAddress])

  useEffect(() => {
    setEOAAddressMapResult(null);

    if(walletAddress && passportAddress) {
      // try EOA first  
      fetchEOAAddressMapping();
    } else if(!walletAddress && passportAddress) {
      fetchPassportAddressMapping();
    }
  }, [
    walletAddress, 
    passportAddress, 
    setEOAAddressMapResult, 
    setPassportAddressMapResult,
    fetchEOAAddressMapping,
    fetchPassportAddressMapping
  ])
  
  return (
    <Card w={['90%', '500px']} p={4} bgColor={'rgba(0,0,0,0.75)'} mb={8} display={'flex'} flexDirection={'column'} gap={4}>
      <Flex justifyContent={"space-between"}>
        {walletAddress 
        ? <Button size="small" p={2} colorScheme="blue" onClick={() => disconnect()}>Disconnect Wallet</Button>
        : <Button size="small" p={2} colorScheme="blue" onClick={() => open()}>Connect Wallet</Button>
        }
        {passportUserInfo 
          ? <Button size="small" p={2} colorScheme="blue" onClick={() => passportInstance.logout()}>Logout Passport</Button>
          : <Button size="small" p={2} colorScheme="blue" onClick={connectPassport}>Connect Passport</Button>
        }
      </Flex>
      <Text><strong>Source wallet:</strong> {shortenAddress(walletAddress)}</Text>
      <Text wordBreak={'keep-all'}><strong>Passport:</strong> {passportUserInfo 
        && `${shortenAddress(passportAddress)} | ${passportUserInfo?.email}` }</Text>
      {walletAddress && passportAddress && !eoaAddressMapResult && !passportAddressMapResult && <Button colorScheme="blue" isLoading={addressMapLoading} onClick={createAddressMap}>Link wallets</Button>}
      <Text wordBreak={"keep-all"} color={correctWalletMap ? theme.colors.green["600"] : theme.colors.red["500"]}>{walletMappingMessage}</Text>
    </Card>
  )
}