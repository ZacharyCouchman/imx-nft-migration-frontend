import { Button, VStack } from '@chakra-ui/react'

export const Migrate = () => {

  const runMigration = async () => {
    console.log('Run migration... do all the burns')
  }

  return (
    <VStack width={200}>
      <Button size="lg" width={[200, 150]} colorScheme='blue' onClick={() => runMigration()}>Migrate</Button>
    </VStack>
  )
}

