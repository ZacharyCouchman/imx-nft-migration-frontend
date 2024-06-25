import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { TokenBurn } from "../types/migration";
import { EIP1193Context } from "./EIP1193Context";
import { shortenAddress } from "../utils/walletAddress";

export interface MigrationContextState {
  passportAddress: string;
  setPassportAddress: React.Dispatch<React.SetStateAction<string>>;
  successfulBurns: TokenBurn[];
  setSuccessfulBurns: React.Dispatch<React.SetStateAction<TokenBurn[]>>;
  correctWalletMap: boolean;
  setCorrectWalletMap: React.Dispatch<React.SetStateAction<boolean>>;
  eoaAddressMapResult: {destinationWalletAddress:string} | null;
  setEOAAddressMapResult: React.Dispatch<React.SetStateAction<{destinationWalletAddress:string} | null>>;
  passportAddressMapResult: {originWalletAddress:string} | null;
  setPassportAddressMapResult: React.Dispatch<React.SetStateAction<{originWalletAddress:string} | null>>;
  walletMappingMessage: string;
}

const initialState: MigrationContextState = {
  passportAddress: "",
  setPassportAddress: () => {},
  successfulBurns: [],
  setSuccessfulBurns: () => {},
  correctWalletMap: false,
  setCorrectWalletMap: () => {},
  eoaAddressMapResult: null,
  setEOAAddressMapResult: () => {},
  passportAddressMapResult: null,
  setPassportAddressMapResult: () => {},
  walletMappingMessage: ""
}

export const MigrationContext = createContext(initialState);

interface MigrationProvider{
  children: ReactNode;
}

export const MigrationProvider = ({children}: MigrationProvider) => {
  const {walletAddress} = useContext(EIP1193Context);
  const [passportAddress, setPassportAddress] = useState<string>("");
  const [successfulBurns, setSuccessfulBurns] = useState<TokenBurn[]>([]);
  const [correctWalletMap, setCorrectWalletMap] = useState<boolean>(false);
  const [eoaAddressMapResult, setEOAAddressMapResult] = useState<{destinationWalletAddress:string} | null>(null);
  const [passportAddressMapResult, setPassportAddressMapResult] = useState<{originWalletAddress:string} | null>(null);
  const [walletMappingMessage, setWalletMappingMessage] = useState("");

  useEffect(() => {
    /**
     * User connects a wallet - no passport yet - correctWalletMap false
     * User connects a wallet - and connects passport - no wallet mapping created - correctWalletMap false
     * User connects a wallet - and connects passport - creates wallet mapping - correctWalletMap true
     * User connects a wallet - and connects different passport - wallet mapping exists for different passport - correctWalletMap false
     * User connects a new wallet - and connects original passport - wallet mapping exists for passport but different EOA - correctWalletMap false
     */
    // setCorrectWalletMap(false);
    if(!walletAddress || !passportAddress) {
      setCorrectWalletMap(false);
      setWalletMappingMessage("");
    } 
    if(!eoaAddressMapResult && !passportAddressMapResult) {
      setCorrectWalletMap(false);
      setWalletMappingMessage("");
    } 
    if(eoaAddressMapResult?.destinationWalletAddress.toLowerCase() === passportAddress.toLowerCase()) {
      setCorrectWalletMap(true);
      setWalletMappingMessage("Addresses successfully mapped");
    } 
    if(eoaAddressMapResult && eoaAddressMapResult?.destinationWalletAddress.toLowerCase() !== passportAddress.toLowerCase()){
      setCorrectWalletMap(false);
      setWalletMappingMessage(`Incorrect Passport connected. EOA mapped to ${shortenAddress(eoaAddressMapResult?.destinationWalletAddress.toLowerCase())}`);
    }
    if(passportAddressMapResult && passportAddressMapResult?.originWalletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      setCorrectWalletMap(false);
      setWalletMappingMessage(`Incorrect EOA wallet connected. Passport mapped to ${shortenAddress(passportAddressMapResult?.originWalletAddress.toLowerCase())}`);
    }
  }, [walletAddress, passportAddress, eoaAddressMapResult, passportAddressMapResult])
  return (
    <MigrationContext.Provider value={{
      passportAddress,
      setPassportAddress,
      successfulBurns,
      setSuccessfulBurns,
      correctWalletMap,
      setCorrectWalletMap,
      eoaAddressMapResult,
      setEOAAddressMapResult,
      passportAddressMapResult,
      setPassportAddressMapResult,
      walletMappingMessage
    }}>
      {children}
    </MigrationContext.Provider>
  )
}
