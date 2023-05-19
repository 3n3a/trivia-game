import {
  Box,
  FormControl,
  Select,
  FormLabel,
  Container,
  VStack,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getCategoriesList } from "~/models/game.server";
import type {Category} from "lib/triviadb/trivia"
import { useState } from "react";

export const loader = async () => {
  return json(await getCategoriesList())
}

const Index = () => {
  const minQuestions = 10;
  const defaultQuestions = 20;
  const maxQuestions = 200;

  const [loadingGame, setLoadingGame] = useState(false);

  const categoriesList = useLoaderData<typeof loader>()

  return (
    <Container maxW="md" height="95vh">
      <Form method="post" action="/play/new" onSubmit={() => setLoadingGame(true)} style={{
        height: "100%"
      }}>
        <VStack height="full" align="stretch" justifyContent="space-between">
          <VStack spacing={8}>
            <Box bg="white" w="100%" paddingTop={16} color="black" fontSize={40}>
              Trivia-Game
            </Box>
            <FormControl>
              <FormLabel>Kategorie</FormLabel>
              <Select name="category" defaultValue="-1">
                <option key="all" value='-1'>Alle Kategorien</option>
                {
                  categoriesList.map((category: Category) => <option key={category.id} value={category.id}>{category.name}</option>)
                }
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Anzahl Fragen</FormLabel>
              <NumberInput
                defaultValue={defaultQuestions}
                max={maxQuestions}
                min={minQuestions}
                name="questions"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
          <Box>
            <Button type="submit" pt={1} colorScheme="teal" size="lg" width="full" isLoading={loadingGame} loadingText="Creating...">
              Spiel Starten
            </Button>
          </Box>
        </VStack>
      </Form>
    </Container>
  );
};

export default Index;
