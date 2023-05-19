import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link as RemixLink } from "@remix-run/react";
import { Container, Heading, Link, Text, Button } from "@chakra-ui/react";

const Impressum = () => {

  return (
    <Container pt={16}>
        <Heading size="2xl">Impressum</Heading>
        <Text mt={16}>
            This site utilizes data from the Open Trivia Database provided by <Link color="blue" href="https://opentdb.com">opentdb.com</Link>, licensed under <Link color="blue" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</Link>.
        </Text>
        
        <Text mt={16}>
            <Link color="blue" href="https://trivia-game.enea.tech">Trivia Game</Link> by <Link color="blue" href="https://3n3a.ch">3n3a und co.</Link> is licensed under <Link color="blue" href="http://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1">CC BY-SA 4.0</Link>
        </Text>

        <Button as={RemixLink} to="/" colorScheme="blue" mt={16} leftIcon={<ArrowBackIcon />}>
            <Text pt={1}>
            Back
            </Text>
        </Button>
    </Container>
  );
};

export default Impressum;