import { Box, Container, VStack, Text, Button } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getGameSession } from "~/models/game.server";

export const loader = async ({ params }: LoaderArgs) => {
  const slug = params.slug;
  if (slug) {
    const session = await getGameSession(slug);
    if (!session) return json({});
    return json({
      score: session.score,
      questions_count: session.current_question,
      percentage: (session.score / session.current_question) * 100,
      restart_url: `/play/restart/${slug}`
    });
  }
  return redirect("/");
};

const Finsihed = () => {
  const loaderData = useLoaderData<typeof loader>() as {
    score: number;
    questions_count: number;
    percentage: number;
    restart_url: string;
  };

  const [loadingGame, setLoadingGame] = useState(false);

  return (
    <Container maxW="md" height="95vh">
      <VStack height="full" align="stretch" justifyContent="space-between">
        <VStack spacing={8}>
          <Box bg="white" w="100%" paddingTop={16} color="black" fontSize={40}>
            Trivia-Game
          </Box>
          <Box bg="white" w="100%" marginTop={16} color="black" fontSize={30}>
            Spiel beendet
          </Box>
          <Box w="100%">
            <Text fontSize="xl">Deine Punktzahl:</Text>
          </Box>
          <Box fontSize={50} justifySelf="center">
            {loaderData.score}/{loaderData.questions_count} Fragen
          </Box>
          <Box w="100%">
            <Text fontSize="xl">Prozent aller Fragen:</Text>
          </Box>
          <Box fontSize={50} justifySelf="center">
            {loaderData.percentage}%
          </Box>
        </VStack>
        <VStack w="100%" spacing={4}>
          <Button as={Link} to={loaderData.restart_url} isLoading={loadingGame} loadingText="Starting..." onClick={() => setLoadingGame(true)} pt={1} colorScheme="pink" variant="outline" size="lg" width="full">
            Neues Spiel Starten
          </Button>
          <Button as={Link} to="/"  pt={1} colorScheme="teal" size="lg" width="full">
            Zurück zur Startseite
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
};

export default Finsihed;
