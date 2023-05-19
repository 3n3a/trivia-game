import { CloseIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Card,
  CardBody,
  Center,
  Container,
  Grid,
  GridItem,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { getGameSession, nextQuestion } from "~/models/game.server";

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
    const isCorrect =
      session.questions[session.current_question].correct_answer === answer;

    const updatedSession = await nextQuestion(slug, isCorrect);
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
        message: { is_correct: true, text: "Your answer was correct!" },
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

const Play = () => {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const gameSession: any = actionData ?? loaderData;
  const activeQuestion = gameSession.questions[gameSession.current_question];

  return (
    <Form method="post">
      <Grid
        as={Container}
        maxW="md"
        h="95vh"
        paddingTop={16}
        templateRows="1fr 5fr 3fr 5fr"
        gap={3}
      >
        <GridItem>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            <GridItem></GridItem>
            <GridItem>
              <Center h="full">
                <Text fontSize="xl">
                  {gameSession.current_question + 1}/{gameSession.amount}
                </Text>
              </Center>
            </GridItem>
            <GridItem>
              <Center h="full" justifyContent="end">
                <IconButton
                  as={Link}
                  to="/"
                  aria-label="Spiel Beenden"
                  icon={<CloseIcon />}
                  colorScheme="red"
                >
                  Spiel Beenden
                </IconButton>
              </Center>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem>
          <VStack
            spacing={8}
            height="full"
            align="stretch"
            justifyContent="space-between"
          >
            <Box h="20" py="10">
              {gameSession.hasOwnProperty("message") ? (
                <Alert
                  status={gameSession.message.is_correct ? "success" : "error"}
                >
                  <AlertIcon />
                  {gameSession.message.text}
                </Alert>
              ) : null}
            </Box>
            <Card>
              <CardBody>
                <Text fontSize="3xl" overflowWrap="anywhere">
                  {decodeURIComponent(activeQuestion.question)}
                </Text>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>
        <GridItem></GridItem>
        <GridItem>
          <VStack
            height="full"
            align="stretch"
            justifyContent="flex-start"
            maxW="md"
          >
            <VStack align="stretch" justifyContent="space-evenly" spacing="4">
              {activeQuestion.answers!.map((q: any) => (
                <button key={q} type="submit" name="answer" value={q}>
                  <Box
                    w="full"
                    bgColor="blue.500"
                    color="white"
                    padding={4}
                    borderRadius={6}
                    _hover={{
                      backgroundColor: "blue.600"
                    }}
                  >
                    <Text
                      wordBreak="break-all"
                      inlineSize="full"
                      overflow="hidden"
                      fontSize="lg"
                      fontWeight="semibold"
                    >
                      {decodeURIComponent(q)}
                    </Text>
                  </Box>
                </button>
              ))}
            </VStack>
          </VStack>
        </GridItem>
      </Grid>
    </Form>
  );
};

export default Play;
