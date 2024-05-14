import { Box, Button, Flex, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, theme } from '@chakra-ui/react'
import { shortenAddress } from '../../utils/walletAddress';
import ImxBalance from '../ImxBalance/ImxBalance';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useWeb3Modal, useDisconnect} from "@web3modal/ethers5/react"
import { useCallback, useContext } from 'react';
import { EIP1193Context } from '../../contexts/EIP1193Context';
import { passportInstance } from '../../immutable/passport';

export function AppHeaderBar() {
  const {provider, walletAddress} = useContext(EIP1193Context);

  const {open} = useWeb3Modal()
  const { disconnect } = useDisconnect()

  const logout = useCallback(() => {
    passportInstance.logout();
  }, []);

  return (
    <Flex as={'nav'} 
      width={'100vw'} 
      height={'auto'} 
      p={4} 
      flexDirection={"row"} 
      alignItems={"center"} 
      justifyContent={"space-between"}
      bg={theme.colors.transparent}
      zIndex={5}
      >
      <Box></Box>
      <Box>
      {(!walletAddress || !provider) 
        ? (<Button variant="solid" colorScheme='blue' onClick={() => open()}>Connect Wallet</Button>)
        : (
        <Menu>
          <MenuButton as={Button} colorScheme='blue' rightIcon={<ChevronDownIcon />}>
            <Flex flexDirection="column">
              <Text>{shortenAddress(walletAddress)}</Text>
            </Flex>
          </MenuButton>
          <MenuList minW={40} w={60}>
            <ImxBalance />
            <MenuDivider />
            <MenuItem onClick={() => disconnect()}>Disconnect Wallet</MenuItem>
            <MenuItem onClick={logout}>Logout Passport</MenuItem>
          </MenuList>
        </Menu>
      )}
      </Box>
    </Flex>
  )
}