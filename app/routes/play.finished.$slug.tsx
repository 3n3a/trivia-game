import { Box, Container, VStack } from "@chakra-ui/react";
import { LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGameSession } from "~/models/game.server";

export const loader = async({ params }: LoaderArgs) => {
    const slug = params.slug
    if (slug) {
        const session = await getGameSession(slug);
        if (!session) return json({});
        return json({score: session.score, questions_count: session.current_question})
    }
    return redirect('/')
}

const Finsihed = () => {
    const loaderData = useLoaderData<typeof loader>() as {score: number, questions_count: number};

  return (
    <Container maxW="md" height="95vh" paddingTop={16}>
      <VStack height="full" align="stretch" justifyContent="space-between">
        <VStack spacing={8}>
          <Box bg="white" w="100%" paddingTop={16} color="black" fontSize={40}>
            You Finished!
          </Box>
          <Box>
            Score: {loaderData.score}/{loaderData.questions_count}
          </Box>
        </VStack>
      </VStack>
    </Container>
  );
};

export default Finsihed;
