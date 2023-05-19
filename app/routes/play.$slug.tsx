import { CloseIcon, StarIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Grid,
  GridItem,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  Tooltip,
  VStack,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigation, useTransition } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  deductJoker,
  getGameSession,
  nextQuestion,
} from "~/models/game.server";

export const loader = async ({ params }: LoaderArgs) => {
  const slug = params.slug;
  if (slug) {
    const session = await getGameSession(slug);
    if (!session) return redirect("/");

    if (session.current_question >= session.questions.length) {
      return redirect("/play/finished/" + slug);
    }

    for (const question of session.questions) {
      delete question.correct_answer;
      delete question.incorrect_answers;
    }

    return json(session);
  }
  return json({});
};

export const action = async ({ params, request }: ActionArgs) => {
  const slug = params.slug;
  if (slug) {
    const session = await getGameSession(slug);
    if (!session) return redirect("/");

    const formData = await request.formData();
    const answer = String(formData.get("answer"));
    const currentQuestion = session.questions[session.current_question];
    let isCorrect = currentQuestion.correct_answer === answer;

    if (answer === "use-joker") {
      isCorrect = true;
      await deductJoker(slug);
    }

    const updatedSession = await nextQuestion(
      slug,
      isCorrect,
      currentQuestion.difficulty
    );
    if (!updatedSession) {
      return redirect("/");
    }

    if (updatedSession!.current_question >= updatedSession!.questions.length) {
      return redirect("/play/finished/" + slug);
    }

    for (const question of updatedSession!.questions) {
      delete question.correct_answer;
      delete question.incorrect_answers;
    }

    if (isCorrect) {
      return json({
        message: { is_correct: true, text: "Your answer was correct!" + ` ${updatedSession.score - session.score} points.` },
        ...updatedSession,
      });
    }
    return json({
      message: { is_correct: false, text: "Your answer was wrong!" },
      ...updatedSession,
    });
  }
  return redirect("/");
};

// Idk how safe this is, but like so it does not make additional get-requests when answer submitted :)
export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}: {
  actionResult: any;
  defaultShouldRevalidate: boolean;
}) {
  return false;
}

const Play = () => {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const gameSession: any = actionData ?? loaderData;
  const activeQuestion = gameSession.questions[gameSession.current_question];

  const [isEndGame, setIsEndGame] = useState(false);
  const transition = useNavigation();

  const PureButton = chakra("button", {});


  return (
    <>
      <Form method="post">
        <Grid
          as={Container}
          maxW="md"
          h="95vh"
          paddingTop={16}
          templateRows="1fr 10fr 10fr 1fr"
          gap={10}
        >
          <GridItem>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              <GridItem>
                <Center h="full">
                  <Text fontSize="xl">{gameSession.score} Pt.</Text>
                </Center>
              </GridItem>
              <GridItem>
                <Center h="full">
                  <Text fontSize="xl">
                    {gameSession.current_question + 1}/{gameSession.amount}
                  </Text>
                </Center>
              </GridItem>
              <GridItem>
                <Center h="full" justifyContent="end">
                  <Tooltip hasArrow label="Spiel Beenden">
                    <IconButton
                      isLoading={isEndGame}
                      onClick={() => setIsEndGame(true)}
                      as={Link}
                      to="/"
                      aria-label="Spiel Beenden"
                      icon={<CloseIcon />}
                      colorScheme="red"
                    >
                      Spiel Beenden
                    </IconButton>
                  </Tooltip>
                </Center>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem>
            <Grid h="full" templateRows="1fr 5fr" rowGap={8}>
              <GridItem>
                <Box h="full">
                  {gameSession.hasOwnProperty("message") ? (
                    <Alert
                      h="full"
                      status={
                        gameSession.message.is_correct ? "success" : "error"
                      }
                    >
                      <AlertIcon />
                      {gameSession.message.text}
                    </Alert>
                  ) : null}
                </Box>
              </GridItem>
              <GridItem>
                <Card h="full">
                  <CardBody as={Center}>
                    <Text fontSize="3xl" overflowWrap="anywhere">
                      {decodeURIComponent(activeQuestion.question)}
                    </Text>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem>
            <VStack
              height="full"
              align="stretch"
              justifyContent="flex-start"
              maxW="md"
            >
              <SimpleGrid columns={2} spacing={8} height="full">
                {activeQuestion.answers!.map((q: any) => (
                  <Card
                    as={PureButton}
                    key={q}
                    w="full"
                    type="submit"
                    name="answer"
                    value={q}
                    color="white"
                    bgColor="blue.400"
                    height="full"
                    _hover={{
                      backgroundColor: "blue.500",
                    }}
                  >
                    <CardBody as={Center}>
                      <Text
                        wordBreak="break-all"
                        inlineSize="full"
                        overflow="hidden"
                        fontSize="lg"
                        fontWeight="semibold"
                      >
                        {decodeURIComponent(q)}
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </GridItem>
          <GridItem>
            <Button
              hidden={gameSession.joker_count <= 0}
              type="submit"
              name="answer"
              value="use-joker"
              w="full"
              size="lg"
              colorScheme="pink"
              leftIcon={<StarIcon />}
              iconSpacing={4}
            >
              <Text pt="1">Joker ({gameSession.joker_count})</Text>
            </Button>
          </GridItem>
        </Grid>
      </Form>
      <Modal isCentered isOpen={transition.state !== "idle"} onClose={() => {}}>
        <ModalOverlay></ModalOverlay>
        <ModalContent bg="transparent" shadow="none">
          <Center>
          <Spinner size="xl" color="white"></Spinner>

          </Center>
        </ModalContent>

      </Modal>
    </>
  );
};

export default Play;
