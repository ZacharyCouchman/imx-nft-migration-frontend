// PassportButton.tsx
import { Button, Box, Text } from '@chakra-ui/react';
import PassportSymbol from '../../assets/passport_logo_32px.svg?react';

interface PassportButtonProps {
  title: string;
  onClick: () => void;
}

export function PassportButton({ title, onClick }: PassportButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      backgroundColor="#F3F3F3"
      height="32px"
      borderRadius="32px"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      color="black"
      paddingX="10px" // shorthand for paddingLeft and paddingRight
      _hover={{ bg: "#e2e2e2" }} // optional hover effect
      _active={{ bg: "#d1d1d1" }} // optional active state effect
    >
      <Box marginRight="12px" height="20px" width="20px" as={PassportSymbol} />
      <Text>{title}</Text>
    </Button>
  );
}

export default PassportButton;