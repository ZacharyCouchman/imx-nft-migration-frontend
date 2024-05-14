import { createContext, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers5/react"

export interface EIP1193ContextState {
  provider: Web3Provider | null;
  setProvider: (provider: Web3Provider | null) => void;
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  isPassportProvider: boolean;
}

export const EIP1193Context = createContext<EIP1193ContextState>({
  provider: null,
  setProvider: () => {},
  walletAddress: '',
  setWalletAddress: () => {},
  isPassportProvider: false
});

interface EIP1193ContextProvider {
  children: React.ReactNode;
}
export const EIP1193ContextProvider = ({children}: EIP1193ContextProvider) => {
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isPassport, setIsPassport] = useState(false);

  const { walletProvider } = useWeb3ModalProvider()
  const {address} = useWeb3ModalAccount()

  useEffect(() => {
    setWalletAddress(address?.toLowerCase() ?? '')
  }, [address])

  useEffect(() => {
    if(!walletProvider) {
      setWalletAddress('');
      setIsPassport(false);
      return;
    }
    setProvider(new Web3Provider(walletProvider));
  }, [walletProvider]);

  return (
    <EIP1193Context.Provider value={{
      provider, 
      setProvider,
      walletAddress,
      setWalletAddress,
      isPassportProvider: isPassport,
      }}>
      {children}
    </EIP1193Context.Provider>
  )

}
