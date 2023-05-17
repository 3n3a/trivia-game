import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Container,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
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
      <Container maxW="md" height="95vh" paddingTop={16}>
        <Center>
          <Text fontSize="xl">
            {gameSession.current_question + 1}/{gameSession.amount}
          </Text>{" "}
        </Center>
        {gameSession.hasOwnProperty("message") ? (
          <Alert status={gameSession.message.is_correct ? "success" : "error"}>
            <AlertIcon />
            {gameSession.message.text}
          </Alert>
        ) : null}
        <VStack height="full" align="stretch" justifyContent="space-evenly">
          <Center
            bgColor="gray.200"
            borderRadius="xl"
            minHeight="64"
            paddingX="10"
            paddingY="20"
          >
            <Text fontSize="3xl" overflowWrap="anywhere">
              {decodeURIComponent(activeQuestion.question)}
            </Text>
          </Center>
          <VStack align="stretch" justifyContent="space-evenly" spacing="4">
            {activeQuestion.answers!.map((q: any) => (
              <Button key={q} size="lg" type="submit" name="answer" value={q}>
                <Text width="full" textOverflow="ellipsis" overflow="clip">
                  {decodeURIComponent(q)}
                </Text>
              </Button>
            ))}
          </VStack>
        </VStack>
      </Container>
    </Form>
  );
};

export default Play;
