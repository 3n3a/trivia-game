import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Container,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getGameSession, nextQuestion } from "~/models/game.server";

export const loader = async ({ params }: LoaderArgs) => {
  const slug = params.slug;
  if (slug) {
    const session = await getGameSession(slug);
    if (!session) return json({});
    session.questions = JSON.parse(session.questions);
    if (session.current_question >= session.questions.length) {
      return redirect('/play/finished/' + slug)
    }
    return json(session);
  }
  return json({});
};

export const action = async ({ params, request }: ActionArgs) => {
  const slug = params.slug;
  if (slug) {
    const session = await getGameSession(slug);
    if (!session) return json({});
    session.questions = JSON.parse(session.questions);
    const formData = await request.formData();
    const answer = String(formData.get("answer"));
    //  @ts-ignore
    const isCorrect = session.questions[session.current_question].correct_answer === answer

    const updatedSession = await nextQuestion(slug, isCorrect)
    updatedSession.questions = JSON.parse(updatedSession.questions);
    if (updatedSession.current_question >= updatedSession.questions.length) {
      return redirect('/play/finished/' + slug)
    }
    if (isCorrect) {
      return json({ message: { is_correct: true }, ...updatedSession });
    }
    return json({ message: { is_correct: false }, ...updatedSession });
  }
  return redirect('/')
};

const Play = () => {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const gameSession: any = actionData ?? loaderData
  const activeQuestion = gameSession.questions[gameSession.current_question];

  return (
    <Form method="post">
      <Container maxW="md" height="95vh" paddingTop={16}>
        {gameSession.hasOwnProperty("message") ? (
          gameSession.message.is_correct ? (
            <Alert status="success">
              <AlertIcon />
              Your answer is correct!
            </Alert>
          ) : (
            <Alert status="error">
              <AlertIcon />
              Your answer was incorrect!
            </Alert>
          )
        ) : null}
        <VStack height="full" align="stretch" justifyContent="space-between">
          <Center
            bgColor="gray.200"
            borderRadius="xl"
            height="64"
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
                {decodeURIComponent(q)}
              </Button>
            ))}
          </VStack>
        </VStack>
      </Container>
    </Form>
  );
};

export default Play;
