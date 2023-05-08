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
import { ActionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

function createGameSession(formData: any) {
  const category = formData.get("category")
  const questions = formData.get("questions")
  console.log("Session", category, "qs: ", questions)
  return {id: "123"}
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const session = await createGameSession(formData);
  return redirect(`/play/${session.id}`);
}

const Index = () => {
  const minQuestions = 10;
  const defaultQuestions = 20;
  const maxQuestions = 200;

  return (
    <Container maxW="md" height="95vh">
      <Form method="post" action="/play" style={{
        height: "100%"
      }}>
        <VStack height="full" align="stretch" justifyContent="space-between">
          <VStack spacing={8}>
            <Box bg="white" w="100%" paddingTop={16} color="black" fontSize={40}>
              Trivia-Game
            </Box>
            <FormControl>
              <FormLabel>Kategorie</FormLabel>
              <Select name="category" placeholder="Wähle eine Kategorie...">
                <option value="test1">Test 1</option>
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
            <Button type="submit" pt={1} bgColor="tomato" size="lg" width="full">
              Spiel Starten
            </Button>
          </Box>
        </VStack>
      </Form>
    </Container>
  );
};

export default Index;
