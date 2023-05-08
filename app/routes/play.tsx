import {
  Button,
  Center,
  Container,
  Text,
  VStack,
} from "@chakra-ui/react";

const Play = () => {
  return (
    <Container maxW="md" height="95vh" paddingTop={16}>
      <VStack height="full" align="stretch" justifyContent="space-between">
        <Center
          bgColor="gray.200"
          borderRadius="xl"
          height="64"
          paddingX="10"
          paddingY="20"
        >
          <Text fontSize="3xl" overflowWrap="anywhere">
            Wer war in 1920 Präsident des Monds?
          </Text>
        </Center>
        <VStack align="stretch" justifyContent="space-evenly" spacing="4">
          <Button size="lg">Test 1</Button>
          <Button size="lg">Test 1</Button>
          <Button size="lg">Test 1</Button>
        </VStack>
      </VStack>
    </Container>
  );
};

export default Play;
